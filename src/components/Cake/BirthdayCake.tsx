import React, { useState } from 'react';
import { Sparkles, Flame, RotateCcw, Heart, PartyPopper } from 'lucide-react';
import { Candle } from './Candle';
import { MakeAWishModal } from './MakeAWishModal';
import { audioEngine } from '../../services/audioEngine';
import { fireCandleExtinguishConfetti } from '../../services/confetti';

export const BirthdayCake: React.FC = () => {
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [blowCount, setBlowCount] = useState<number>(0);

  const handleExtinguish = () => {
    // Invoke required sound effect and confetti
    audioEngine.playCandleBlowoutSFX();
    fireCandleExtinguishConfetti();
    setIsBlown(true);
    setIsModalOpen(true);
    setBlowCount((prev) => prev + 1);
  };

  const handleRelight = () => {
    setIsBlown(false);
  };

  return (
    <section
      id="birthday-cake"
      className="space-y-8 scroll-mt-20 py-8 sm:py-12 animate-fade-in"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>طقس الاحتفال السنوي • أمنيات المحبة</span>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-amiri font-bold gold-gradient-text">
          كعكة يوم الميلاد الافتراضية 🎂
        </h3>

        <p className="text-sm sm:text-base text-ivory-lavender leading-relaxed">
          انقري على شعلة الشمعة لإطفائها وتمني أمنية من قلبك
        </p>

        {blowCount > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-850 border border-gold-400/20 text-xs text-gold-300 font-mono">
            <Heart className="w-3 h-3 text-roseGold-400 fill-roseGold-400" />
            <span>مرات الاحتفال بالأمنية: {blowCount}</span>
          </div>
        )}
      </div>

      {/* Main Cake Stage Canvas */}
      <div className="relative max-w-xl mx-auto flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl glass-panel border border-gold-400/25 shadow-glow-gold overflow-hidden">
        {/* Ambient Warm Golden Glow behind the cake */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gold-400/5 blur-[90px] pointer-events-none" />

        {/* Cake Assembly Stack */}
        <div className="relative flex flex-col items-center select-none pt-4 pb-2">
          {/* Central Candle on Top Tier */}
          <div className="relative z-30 mb-[-12px]">
            <Candle
              isBlown={isBlown}
              onBlowout={!isBlown ? handleExtinguish : handleRelight}
            />
          </div>

          {/* Tier 3: Top Layer (Rosy Blush Glaze & Gold Leaf Flakes) */}
          <div className="relative z-20 w-44 sm:w-52 h-16 rounded-t-2xl bg-gradient-to-r from-roseGold-500 via-roseGold-400 to-roseGold-600 shadow-md border-t-2 border-gold-300/40 flex flex-col justify-between overflow-hidden">
            {/* Top Frosting Rosettes & Gold Dust */}
            <div className="flex justify-around items-center pt-1 px-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full bg-gold-200 shadow-xs border border-gold-400/40"
                />
              ))}
            </div>

            {/* Gold Leaf Accent Shimmer */}
            <div className="absolute top-3 left-6 w-5 h-4 bg-gold-300/60 rounded-xs rotate-12 blur-[0.5px]" />
            <div className="absolute bottom-2 right-8 w-6 h-3 bg-gold-300/70 rounded-xs -rotate-6 blur-[0.5px]" />

            {/* Dripping Glaze Scallops */}
            <div className="w-full flex justify-between px-1 pb-0.5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-2.5 bg-roseGold-300/80 rounded-b-full shadow-xs -mb-1"
                />
              ))}
            </div>
          </div>

          {/* Tier 2: Middle Layer (Champagne Vanilla Cream & Pearls) */}
          <div className="relative z-10 w-64 sm:w-72 h-20 rounded-t-2xl bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300 shadow-lg border-t-2 border-gold-400/40 flex flex-col justify-between overflow-hidden -mt-1">
            {/* Pearl Border Ring */}
            <div className="flex justify-around items-center pt-1.5 px-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-white shadow-xs border border-gold-300/50"
                />
              ))}
            </div>

            {/* Middle Filigree Pattern */}
            <div className="text-center font-amiri text-xs text-amber-800/40 tracking-widest font-bold">
              ✦ هديل ✦
            </div>

            {/* Vanilla Drips to Bottom */}
            <div className="w-full flex justify-between px-1.5 pb-0.5">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-3 bg-gold-50/90 rounded-b-full shadow-xs -mb-1"
                />
              ))}
            </div>
          </div>

          {/* Tier 1: Bottom Base Layer (Velvet Obsidian Chocolate & Gold Filigree) */}
          <div className="relative z-0 w-80 sm:w-96 h-24 rounded-t-2xl bg-gradient-to-r from-obsidian-700 via-obsidian-600 to-obsidian-700 shadow-2xl border-t-2 border-gold-400/50 flex flex-col justify-between overflow-hidden -mt-1">
            {/* Top Golden Swirls */}
            <div className="flex justify-around items-center pt-2 px-6">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gold-400/80 shadow-xs border border-gold-500/60"
                />
              ))}
            </div>

            {/* Arabesque Golden Inscription Ribbon */}
            <div className="text-center font-amiri text-sm sm:text-base font-bold gold-gradient-text tracking-wider">
              كل عام وأنتِ الأغلى والأجمل يا هديل ✨
            </div>

            {/* Edible Gold Leaf Border along bottom rim */}
            <div className="h-3 w-full bg-gradient-to-r from-amber-600 via-gold-400 to-amber-600 shadow-md border-t border-gold-300/40" />
          </div>

          {/* Ornate Golden Cake Platter / Stand */}
          <div className="relative z-10 w-[340px] sm:w-[420px] h-7 bg-gradient-to-r from-amber-700 via-gold-400 to-amber-700 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.8)] border-2 border-gold-300/70 flex items-center justify-center -mt-1">
            {/* Metallic Platter Inner Ring */}
            <div className="w-[94%] h-3.5 rounded-full border border-gold-100/60 bg-gradient-to-r from-gold-500 via-gold-200 to-gold-500" />
          </div>

          {/* Platter Pedestal Foot */}
          <div className="w-32 h-5 bg-gradient-to-r from-amber-800 via-gold-500 to-amber-800 rounded-b-xl shadow-lg border-x-2 border-b-2 border-gold-400/50 -mt-1" />
        </div>

        {/* Ceremony Actions & Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 relative z-20">
          {!isBlown ? (
            <button
              type="button"
              onClick={handleExtinguish}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm sm:text-base shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-amber-900 animate-pulse" />
              <span>إطفاء شمعة الميلاد والتمني ✨</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRelight}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs sm:text-sm shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إشعال الشمعة مجدداً 🕯️</span>
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full glass-panel glass-panel-hover text-gold-200 hover:text-white font-medium text-xs sm:text-sm border border-gold-400/30 transition-all cursor-pointer"
              >
                <PartyPopper className="w-4 h-4 text-gold-400" />
                <span>مراجعة بطاقة الأمنية 🌟</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Make a Wish Modal Dialog */}
      <MakeAWishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRelight={handleRelight}
      />
    </section>
  );
};

export default BirthdayCake;
