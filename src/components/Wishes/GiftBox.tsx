import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Crown,
  RotateCcw,
  Award,
} from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import { fireGiftOpenConfetti, fireCelebrationConfetti } from '../../services/confetti';

export interface GiftBoxProps {
  onOpenCertificate?: () => void;
  className?: string;
}

export const GiftBox: React.FC<GiftBoxProps> = ({
  onOpenCertificate,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openCount, setOpenCount] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const handleOpen = () => {
    // 1. Play Web Audio Procedural SFX
    audioEngine.playGiftOpenSFX();

    // 2. Fire celebratory confetti shower
    fireGiftOpenConfetti();
    fireCelebrationConfetti();

    // 3. Update state
    setIsOpen(true);
    setOpenCount((prev) => prev + 1);

    // 4. Trigger Certificate Modal callback if provided
    if (onOpenCertificate) {
      onOpenCertificate();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const triggerShake = () => {
    if (!isOpen) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div
      className={`relative max-w-lg mx-auto w-full select-none text-center ${className}`}
      onMouseEnter={triggerShake}
    >
      {/* 3D Stage Container */}
      <div className="relative [perspective:1200px] flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl glass-panel border border-gold-400/25 shadow-glow-gold overflow-hidden">
        {/* Warm Ambient Golden Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold-400/10 blur-[80px] pointer-events-none" />

        {/* Section Mini Heading */}
        <div className="mb-6 space-y-2 relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-semibold backdrop-blur-md">
            <Gift className="w-3.5 h-3.5 text-gold-400" />
            <span>هدية خاصة ومفاجأة ملكية لهديل</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-amiri font-bold gold-gradient-text">
            صندوق المفاجأة الملكية 🎁
          </h4>
          <p className="text-xs sm:text-sm text-ivory-lavender">
            انقري لفك الشريط الذهبي والكشف عن الشهادة التقديرية المخصصة لكِ
          </p>
        </div>

        {/* 3D Gift Box Interactive Model */}
        <div
          onClick={!isOpen ? handleOpen : undefined}
          className={`relative w-48 sm:w-56 h-48 sm:h-56 cursor-pointer transition-transform duration-500 ease-out z-20 ${
            isShaking ? 'animate-wiggle' : ''
          } ${!isOpen ? 'hover:scale-105 active:scale-95' : ''}`}
          aria-hidden="true"
        >
          {/* Radiant Light Beams Burst when Opened */}
          {isOpen && (
            <div className="absolute -inset-10 rounded-full bg-radial from-gold-300/30 via-gold-400/15 to-transparent blur-xl animate-pulse pointer-events-none z-0" />
          )}

          {/* Surprise Keepsake Badge Rising from Inside the Box */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-out z-10 flex flex-col items-center ${
              isOpen
                ? '-translate-y-16 scale-100 opacity-100'
                : 'translate-y-12 scale-50 opacity-0 pointer-events-none'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-amber-500 shadow-glow-gold-lg border-2 border-gold-200 flex items-center justify-center text-obsidian-950">
              <Crown className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md" />
            </div>
            <span className="mt-2 px-3 py-0.5 rounded-full bg-obsidian-900/90 border border-gold-400/40 text-[11px] font-bold text-gold-300 shadow-md">
              وسام المحبة والفخر 👑
            </span>
          </div>

          {/* Gift Box Lid (Moves up & tilts when opened) */}
          <div
            className={`absolute top-8 left-0 right-0 h-14 sm:h-16 rounded-t-xl bg-gradient-to-r from-obsidian-800 via-obsidian-750 to-obsidian-850 border-2 border-gold-400/50 shadow-xl transition-all duration-700 ease-out z-30 flex items-center justify-center ${
              isOpen
                ? '-translate-y-20 -rotate-12 opacity-80 shadow-glow-gold'
                : 'translate-y-0 rotate-0 shadow-md'
            }`}
          >
            {/* Top Ribbon Bow */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Left Bow Loop */}
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border-4 border-gold-400 bg-amber-300/20 shadow-glow-gold rotate-[-25deg] -mr-1" />
              {/* Center Knot */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 to-gold-500 shadow-md border border-gold-100 z-10" />
              {/* Right Bow Loop */}
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border-4 border-gold-400 bg-amber-300/20 shadow-glow-gold rotate-[25deg] -ml-1" />
            </div>

            {/* Lid Horizontal Ribbon Band */}
            <div className="w-full h-4 bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 shadow-xs border-y border-gold-300/60" />

            {/* Lid Vertical Ribbon Band */}
            <div className="absolute top-0 bottom-0 w-6 bg-gradient-to-b from-amber-300 via-gold-400 to-amber-500 shadow-xs border-x border-gold-300/60" />
          </div>

          {/* Gift Box Base Cube */}
          <div className="absolute bottom-2 left-2 right-2 h-32 sm:h-36 rounded-b-2xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border-2 border-gold-400/40 shadow-2xl z-20 overflow-hidden flex items-center justify-center">
            {/* Vertical Gold Ribbon on Base */}
            <div className="absolute top-0 bottom-0 w-6 bg-gradient-to-b from-amber-300 via-gold-400 to-amber-500 border-x border-gold-300/60 shadow-xs" />

            {/* Horizontal Gold Ribbon on Base */}
            <div className="absolute left-0 right-0 h-5 bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 border-y border-gold-300/60 shadow-xs" />

            {/* Subtle Metallic Corner Highlights */}
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gold-400/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold-400/40" />
          </div>
        </div>

        {/* Action Controls under Box */}
        <div className="mt-8 relative z-20 flex flex-wrap items-center justify-center gap-3">
          {!isOpen ? (
            <button
              type="button"
              onClick={handleOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpen();
                }
              }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>افتحي صندوق المفاجأة 🎁</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs sm:text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>عرض الشهادة التقديرية 📜</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-panel glass-panel-hover text-gold-300 hover:text-white border border-gold-400/25 text-xs font-medium transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة إغلاق الصندوق 🎀</span>
              </button>
            </div>
          )}

          {openCount > 0 && (
            <div className="w-full text-center pt-2">
              <span className="text-[11px] text-ivory-lavender font-mono">
                مرات فتح المفاجأة والاحتفال: {openCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftBox;
