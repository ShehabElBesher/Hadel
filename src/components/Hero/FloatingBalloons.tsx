import React, { useState } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { fireBalloonPopConfetti } from '../../services/confetti';

interface BalloonItem {
  id: number;
  label: string;
  colorName: string;
  gradientFrom: string;
  gradientTo: string;
  highlightColor: string;
  leftPercent: number; // 0 to 100
  topPercent: number; // 0 to 100
  delaySeconds: number;
  durationSeconds: number;
  scale: number;
}

const BALLOON_DATA: BalloonItem[] = [
  {
    id: 1,
    label: 'ذهبي كلاسيكي',
    colorName: 'gold',
    gradientFrom: '#ffe484',
    gradientTo: '#d4af37',
    highlightColor: '#fffdf5',
    leftPercent: 6,
    topPercent: 12,
    delaySeconds: 0,
    durationSeconds: 6,
    scale: 1.05,
  },
  {
    id: 2,
    label: 'وردي ذهبي ملكي',
    colorName: 'rose-gold',
    gradientFrom: '#fca5a5',
    gradientTo: '#e29578',
    highlightColor: '#fff1f2',
    leftPercent: 88,
    topPercent: 16,
    delaySeconds: 1.2,
    durationSeconds: 7,
    scale: 0.95,
  },
  {
    id: 3,
    label: 'شامبانيا براقة',
    colorName: 'champagne',
    gradientFrom: '#fef08a',
    gradientTo: '#f5cf75',
    highlightColor: '#ffffff',
    leftPercent: 18,
    topPercent: 48,
    delaySeconds: 2.1,
    durationSeconds: 6.5,
    scale: 0.9,
  },
  {
    id: 4,
    label: 'وردي ناعم',
    colorName: 'blush',
    gradientFrom: '#fbcfe8',
    gradientTo: '#e5989b',
    highlightColor: '#fdf2f8',
    leftPercent: 78,
    topPercent: 52,
    delaySeconds: 0.8,
    durationSeconds: 7.5,
    scale: 1.0,
  },
  {
    id: 5,
    label: 'بنفسجي لافندر مذهب',
    colorName: 'lavender-gold',
    gradientFrom: '#ddd6fe',
    gradientTo: '#b8accf',
    highlightColor: '#f5f3ff',
    leftPercent: 48,
    topPercent: 8,
    delaySeconds: 1.6,
    durationSeconds: 6.8,
    scale: 0.85,
  },
  {
    id: 6,
    label: 'عنبر دافئ',
    colorName: 'amber',
    gradientFrom: '#fef3c7',
    gradientTo: '#f59e0b',
    highlightColor: '#fffbeb',
    leftPercent: 92,
    topPercent: 68,
    delaySeconds: 2.7,
    durationSeconds: 8,
    scale: 0.9,
  },
];

export const FloatingBalloons: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [poppedMap, setPoppedMap] = useState<Record<number, boolean>>({});

  const handlePop = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, balloon: BalloonItem) => {
    if (poppedMap[balloon.id]) return;

    // Trigger procedural audio pop sound effect
    audioEngine.playBalloonPopSFX();

    // Determine client coordinates for localized confetti burst
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e && (e.clientX !== 0 || e.clientY !== 0)) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      // Fallback for synthetic/keyboard clicks
      const rect = e.currentTarget.getBoundingClientRect();
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }

    fireBalloonPopConfetti(clientX, clientY);

    // Pop the balloon smoothly
    setPoppedMap((prev) => ({ ...prev, [balloon.id]: true }));

    // Respawn gently after 4.5 seconds for ongoing celebration delight
    setTimeout(() => {
      setPoppedMap((prev) => ({ ...prev, [balloon.id]: false }));
    }, 4500);
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}
      aria-label="بالونات الاحتفال العائمة"
    >
      <style>{`
        @keyframes balloonFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-16px) rotate(2deg);
          }
          66% {
            transform: translateY(-8px) rotate(-2deg);
          }
        }
      `}</style>

      {BALLOON_DATA.map((balloon) => {
        const isPopped = poppedMap[balloon.id];

        return (
          <div
            key={balloon.id}
            role="button"
            tabIndex={0}
            aria-label={`بالون احتفالي ${balloon.label} - انقر للفرقعة`}
            onClick={(e) => handlePop(e, balloon)}
            onTouchStart={(e) => handlePop(e, balloon)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePop(e as any, balloon);
              }
            }}
            style={{
              left: `${balloon.leftPercent}%`,
              top: `${balloon.topPercent}%`,
              animation: isPopped
                ? 'none'
                : `balloonFloat ${balloon.durationSeconds}s ease-in-out ${balloon.delaySeconds}s infinite`,
              transform: `scale(${balloon.scale})`,
            }}
            className={`absolute pointer-events-auto cursor-pointer select-none transition-all duration-300 transform-gpu ${
              isPopped
                ? 'scale-0 opacity-0 pointer-events-none'
                : 'opacity-90 hover:opacity-100 hover:scale-110 active:scale-95'
            }`}
          >
            {/* Balloon SVG */}
            <svg
              width="64"
              height="88"
              viewBox="0 0 64 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            >
              <defs>
                <radialGradient
                  id={`balloon-grad-${balloon.id}`}
                  cx="35%"
                  cy="35%"
                  r="65%"
                  fx="30%"
                  fy="30%"
                >
                  <stop offset="0%" stopColor={balloon.highlightColor} stopOpacity="0.95" />
                  <stop offset="45%" stopColor={balloon.gradientFrom} />
                  <stop offset="100%" stopColor={balloon.gradientTo} />
                </radialGradient>
                <filter id={`balloon-glow-${balloon.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Balloon Body */}
              <ellipse
                cx="32"
                cy="36"
                rx="28"
                ry="34"
                fill={`url(#balloon-grad-${balloon.id})`}
                filter={`url(#balloon-glow-${balloon.id})`}
              />

              {/* Specular 3D Reflection Highlight */}
              <ellipse
                cx="22"
                cy="22"
                rx="9"
                ry="14"
                transform="rotate(-25 22 22)"
                fill="#ffffff"
                fillOpacity="0.45"
              />

              {/* Balloon Tie Knot */}
              <polygon
                points="29,70 35,70 37,74 27,74"
                fill={balloon.gradientTo}
              />

              {/* Balloon Hanging String (Curved SVG Path) */}
              <path
                d="M32 74 C 28 78, 36 82, 32 86 C 29 88, 33 90, 31 92"
                stroke="rgba(245, 207, 117, 0.65)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default FloatingBalloons;
