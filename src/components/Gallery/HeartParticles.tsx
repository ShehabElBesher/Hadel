import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  color: string;
}

interface HeartParticlesProps {
  triggerCount: number;
}

const COLORS = ['#f5cf75', '#e5989b', '#e29578', '#ffd166', '#ff70a6'];

export const HeartParticles: React.FC<HeartParticlesProps> = ({ triggerCount }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (triggerCount === 0) return;

    // Generate 6-8 bursting heart particles
    const newParticles: Particle[] = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60, // -30px to +30px
      y: -20 - Math.random() * 45, // upward travel
      size: 14 + Math.random() * 12,
      rotation: (Math.random() - 0.5) * 50,
      duration: 0.7 + Math.random() * 0.4,
      delay: i * 0.04,
      color: COLORS[i % COLORS.length],
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 1200);

    return () => clearTimeout(timer);
  }, [triggerCount]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-30">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-block animate-float-slow"
          style={{
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
            transition: `all ${p.duration}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
            color: p.color,
            fontSize: `${p.size}px`,
            filter: 'drop-shadow(0 0 6px rgba(245, 207, 117, 0.6))',
          }}
        >
          <Heart className="fill-current w-4 h-4 sm:w-5 sm:h-5" />
        </span>
      ))}
    </div>
  );
};

export default HeartParticles;
