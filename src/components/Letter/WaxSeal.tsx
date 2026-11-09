import React from 'react';

interface WaxSealProps {
  isBroken: boolean;
  onBreak: () => void;
  className?: string;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  isBroken,
  onBreak,
  className = '',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onBreak}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBreak();
        }
      }}
      aria-label="ختم الشمع الملكي - فضّ الرسالة"
      className={`relative cursor-pointer select-none group transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      {/* Outer Golden Glow Pulse */}
      <div className="absolute inset-0 rounded-full bg-gold-400/30 blur-md group-hover:bg-gold-400/50 transition-all animate-pulse" />

      {/* Wax Seal Medallion Base (Organic Melted Wax Look) */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-700 via-gold-500 to-amber-800 p-1 shadow-[0_8px_20px_rgba(0,0,0,0.6)] border border-gold-300/60 flex items-center justify-center">
        {/* Scalloped / Melted Wax Rim Details */}
        <div className="absolute -top-1 left-2 w-3 h-2 bg-amber-600 rounded-full blur-[0.5px]" />
        <div className="absolute -bottom-1.5 right-3 w-4 h-2.5 bg-amber-800 rounded-full blur-[0.5px]" />
        <div className="absolute top-3 -right-1 w-2.5 h-3 bg-amber-700 rounded-full blur-[0.5px]" />

        {/* Inner Stamped Ring with Golden Bevel */}
        <div className="w-full h-full rounded-full border-2 border-dashed border-amber-950/40 bg-gradient-to-tr from-amber-600 via-gold-400 to-amber-500 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          {/* Subtle Crack Lines when Broken */}
          {isBroken && (
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full text-amber-950/80 stroke-current stroke-2">
                <path d="M 50 10 L 48 35 L 56 60 L 45 90" fill="none" />
                <path d="M 48 35 L 30 45" fill="none" />
                <path d="M 56 60 L 75 65" fill="none" />
              </svg>
            </div>
          )}

          {/* Embossed Monogram "هـ" (Hadel) */}
          <span className="font-amiri text-2xl sm:text-3xl font-black text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] select-none">
            هـ
          </span>

          {/* Micro Arabic Inscription */}
          <span className="text-[7px] sm:text-[8px] font-bold tracking-widest text-amber-950/70 -mt-1 uppercase">
            HADEL
          </span>
        </div>
      </div>

      {/* Floating Prompt Tooltip */}
      {!isBroken && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-obsidian-900/90 border border-gold-400/30 text-[10px] text-gold-300 shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          انقري لكسر الختم 💌
        </div>
      )}
    </div>
  );
};

export default WaxSeal;
