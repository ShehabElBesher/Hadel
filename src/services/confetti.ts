import confetti from 'canvas-confetti';

const GOLD_COLORS = ['#f5cf75', '#d4af37', '#e5989b', '#faf8f5', '#ffe484', '#e29578'];

/**
 * Grand celebratory confetti burst (e.g. Hero CTA, celebration kickoff)
 */
export function fireCelebrationConfetti(): void {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: GOLD_COLORS,
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    try {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    } catch (err) {
      console.warn('Canvas confetti error suppressed:', err);
    }
  }

  try {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch (err) {
    console.warn('fireCelebrationConfetti failed gracefully:', err);
  }
}

/**
 * Candle extinguish celebration: golden sparks and stars shooting upwards
 */
export function fireCandleExtinguishConfetti(): void {
  if (typeof window === 'undefined') return;

  try {
    // Center-bottom burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#ffe484', '#f5cf75', '#ffffff', '#e29578'],
      startVelocity: 35,
      scalar: 1.1,
      shapes: ['star', 'circle'],
      zIndex: 9999,
    });
  } catch (err) {
    console.warn('fireCandleExtinguishConfetti burst failed gracefully:', err);
  }

  // Left & right secondary streams
  setTimeout(() => {
    try {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.6 },
        colors: GOLD_COLORS,
        zIndex: 9999,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.6 },
        colors: GOLD_COLORS,
        zIndex: 9999,
      });
    } catch (err) {
      console.warn('fireCandleExtinguishConfetti secondary burst failed gracefully:', err);
    }
  }, 250);
}

/**
 * Localized micro-burst when popping a balloon
 */
export function fireBalloonPopConfetti(clientX: number, clientY: number): void {
  if (typeof window === 'undefined') return;

  try {
    const x =
      window.innerWidth > 0
        ? Math.max(0, Math.min(1, clientX / window.innerWidth))
        : 0.5;
    const y =
      window.innerHeight > 0
        ? Math.max(0, Math.min(1, clientY / window.innerHeight))
        : 0.5;

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { x, y },
      colors: GOLD_COLORS,
      startVelocity: 18,
      decay: 0.9,
      scalar: 0.75,
      zIndex: 9999,
    });
  } catch (err) {
    console.warn('fireBalloonPopConfetti failed gracefully:', err);
  }
}

/**
 * Gift box open fireworks
 */
export function fireGiftOpenConfetti(): void {
  if (typeof window === 'undefined') return;

  try {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      try {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 40 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random() * 0.4 + 0.3, y: Math.random() * 0.4 + 0.3 },
          colors: GOLD_COLORS,
          zIndex: 9999,
        });
      } catch (err) {
        clearInterval(interval);
        console.warn('fireGiftOpenConfetti interval failed gracefully:', err);
      }
    }, 250);
  } catch (err) {
    console.warn('fireGiftOpenConfetti failed gracefully:', err);
  }
}
