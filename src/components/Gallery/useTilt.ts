import { useState, useCallback } from 'react';

export interface TiltState {
  rotateX: number;
  rotateY: number;
  sheenX: number;
  sheenY: number;
  isHovered: boolean;
}

export const useTilt = (maxAngle: number = 8) => {
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    sheenX: 50,
    sheenY: 50,
    isHovered: false,
  });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Invert Y rotation for natural perspective tilt
      const rotateX = ((y - centerY) / centerY) * -maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      const sheenX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const sheenY = Math.max(0, Math.min(100, (y / rect.height) * 100));

      setTilt({
        rotateX,
        rotateY,
        sheenX,
        sheenY,
        isHovered: true,
      });
    },
    [maxAngle]
  );

  const onMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      sheenX: 50,
      sheenY: 50,
      isHovered: false,
    });
  }, []);

  const onMouseEnter = useCallback(() => {
    setTilt((prev) => ({ ...prev, isHovered: true }));
  }, []);

  return {
    tilt,
    tiltHandlers: {
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
    },
    style: {
      transform: tilt.isHovered
        ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: tilt.isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s ease-out',
    },
  };
};

export default useTilt;
