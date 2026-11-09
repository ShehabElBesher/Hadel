import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayRadius: number;
  swayOffset: number;
  baseAlpha: number;
  alphaSpeed: number;
  alphaPhase: number;
  color: string;
}

const GOLD_PALETTE = [
  '#f5cf75', // champagne gold
  '#d4af37', // metallic gold
  '#ffe484', // bright warm gold
  '#e29578', // rose gold
  '#faf8f5', // warm ivory
  '#f7e7bc', // soft amber
];

export const StardustCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Graceful skip in JSDOM or headless environments without 2D canvas support
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      if (typeof canvas.getContext === 'function') {
        ctx = canvas.getContext('2d');
      }
    } catch {
      return;
    }

    if (!ctx) return;

    let animationFrameId: number | null = null;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth || 800;
      height = rect.height || 600;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      try {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } catch {
        // ignore in testing environments without setTransform
      }

      // Initialize particles based on canvas area
      const count = Math.min(60, Math.max(25, Math.floor((width * height) / 14000)));
      particles = Array.from({ length: count }, () => createParticle(width, height, true));
    };

    const createParticle = (w: number, h: number, randomY = false): Particle => {
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + Math.random() * 20,
        size: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.45 + 0.2,
        swaySpeed: Math.random() * 0.02 + 0.008,
        swayRadius: Math.random() * 1.5 + 0.5,
        swayOffset: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.4 + 0.25,
        alphaSpeed: Math.random() * 0.025 + 0.01,
        alphaPhase: Math.random() * Math.PI * 2,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
      };
    };

    let tick = 0;
    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      tick++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.y -= p.speedY;
          p.x += Math.sin(tick * p.swaySpeed + p.swayOffset) * (p.swayRadius * 0.4);

          // Wrap around top to bottom
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }

        // Shimmering alpha calculation
        const currentAlpha = Math.max(
          0.1,
          Math.min(0.9, p.baseAlpha + Math.sin(tick * p.alphaSpeed + p.alphaPhase) * 0.25)
        );

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;

        // Draw particle with gentle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle cross for slightly larger particles
        if (p.size > 2.0 && currentAlpha > 0.45) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = currentAlpha * 0.4;
          const crossSize = p.size * 2.2;
          ctx.beginPath();
          ctx.moveTo(p.x - crossSize, p.y);
          ctx.lineTo(p.x + crossSize, p.y);
          ctx.moveTo(p.x, p.y - crossSize);
          ctx.lineTo(p.x, p.y + crossSize);
          ctx.stroke();
        }

        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    resize();
    render();

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default StardustCanvas;
