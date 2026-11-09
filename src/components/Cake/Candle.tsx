import React from 'react';

interface CandleProps {
  isBlown: boolean;
  onBlowout: () => void;
  className?: string;
}

export const Candle: React.FC<CandleProps> = ({ isBlown, onBlowout, className = '' }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-end select-none cursor-pointer group ${className}`}
      onClick={onBlowout}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBlowout();
        }
      }}
      aria-label={isBlown ? 'شمعة مطفأة - انقري للإشعال' : 'إطفاء شعلة الشمعة'}
    >
      {/* Interactive Dancing Flame or Smoke Wisps */}
      <div className="relative w-16 h-24 flex items-center justify-center">
        {!isBlown ? (
          /* Glowing, Flickering Organic Flame */
          <div className="relative flex items-center justify-center animate-pulse">
            {/* Ambient Radial Flame Glow */}
            <div className="absolute w-24 h-28 -top-4 rounded-full bg-amber-400/25 blur-xl pointer-events-none group-hover:bg-amber-300/40 transition-all duration-300" />
            <div className="absolute w-12 h-16 -top-1 rounded-full bg-gold-400/30 blur-md pointer-events-none" />

            {/* Flame SVG */}
            <svg
              viewBox="0 0 40 60"
              className="w-10 h-16 filter drop-shadow-[0_0_12px_rgba(245,207,117,0.85)] group-hover:scale-110 transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flameOuter" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff4500" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ff8c00" />
                  <stop offset="100%" stopColor="#ffd700" />
                </linearGradient>
                <linearGradient id="flameCore" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#fff2a3" />
                  <stop offset="100%" stopColor="#ffb300" />
                </linearGradient>
                <radialGradient id="flameInnerGlow" cx="50%" cy="60%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="70%" stopColor="#fffae0" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffc107" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer Teardrop Flame */}
              <path
                d="M 20 2 C 24 16 35 28 35 42 C 35 52 28 58 20 58 C 12 58 5 52 5 42 C 5 28 16 16 20 2 Z"
                fill="url(#flameOuter)"
                className="animate-pulse origin-bottom"
              />

              {/* Middle Vibrant Amber Flame */}
              <path
                d="M 20 12 C 23 22 30 31 30 43 C 30 50 25 55 20 55 C 15 55 10 50 10 43 C 10 31 17 22 20 12 Z"
                fill="#ffaa00"
                opacity="0.9"
              />

              {/* Inner Bright Core */}
              <path
                d="M 20 22 C 22 29 26 36 26 45 C 26 50 23 53 20 53 C 17 53 14 50 14 45 C 14 36 18 29 20 22 Z"
                fill="url(#flameCore)"
              />

              {/* White Hot Spot */}
              <ellipse cx="20" cy="46" rx="3.5" ry="5.5" fill="url(#flameInnerGlow)" />
            </svg>
          </div>
        ) : (
          /* Rising Smoke Trail Effect */
          <div className="relative w-12 h-20 flex flex-col items-center justify-end overflow-visible pointer-events-none">
            <svg
              viewBox="0 0 50 80"
              className="w-12 h-20 text-ivory-lavender/60 filter blur-[0.5px] -translate-y-4 transition-all duration-1000"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {/* Smoke Wisp 1 */}
              <path
                d="M 25 75 Q 18 55 28 40 T 22 10"
                className="opacity-40 animate-float-slow"
                strokeDasharray="4 4"
              />
              {/* Smoke Wisp 2 */}
              <path
                d="M 25 75 Q 32 50 20 30 T 27 5"
                className="opacity-50"
                strokeWidth="2.5"
              />
              {/* Smoke Dissipating Cloud */}
              <circle cx="27" cy="12" r="6" fill="currentColor" className="opacity-20 blur-sm" />
              <circle cx="22" cy="24" r="4.5" fill="currentColor" className="opacity-25 blur-sm" />
            </svg>
            <span className="text-[10px] text-ivory-lavender/70 font-mono tracking-tighter">انطفأت ✨</span>
          </div>
        )}
      </div>

      {/* Candle Wick */}
      <div className="w-1 h-3 bg-stone-900 rounded-t-sm relative -mb-0.5 z-10" />

      {/* Candle Cylinder Body */}
      <div className="relative w-7 h-24 rounded-t-sm rounded-b-md shadow-lg overflow-hidden border border-gold-400/40 bg-gradient-to-r from-amber-100 via-gold-300 to-amber-200">
        {/* Spiral Candy-Stripes in Warm Gold & Ivory */}
        <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#faf8f5_0px,#faf8f5_4px,transparent_4px,transparent_10px)]" />

        {/* Vertical Highlight / Cylindrical Sheen */}
        <div className="absolute inset-y-0 left-1.5 w-1 bg-white/70 blur-[0.5px]" />
        <div className="absolute inset-y-0 right-1 w-1 bg-amber-900/20" />

        {/* Wax Drip Accent */}
        <div className="absolute top-0 left-1 w-2 h-3.5 bg-gold-100/90 rounded-b-full shadow-xs" />
        <div className="absolute top-0 right-2 w-1.5 h-2 bg-gold-200/90 rounded-b-full shadow-xs" />
      </div>

      {/* Candle Base Support Ring */}
      <div className="w-9 h-2 bg-gradient-to-r from-amber-600 via-gold-400 to-amber-600 rounded-full -mt-1 shadow-md border border-gold-400/50" />
    </div>
  );
};

export default Candle;
