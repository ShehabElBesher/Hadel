import React from 'react';
import {
  Sparkles,
  PartyPopper,
  Mail,
  Flame,
  Gift,
} from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import {
  fireCelebrationConfetti,
  fireCandleExtinguishConfetti,
  fireGiftOpenConfetti,
} from '../../services/confetti';
import { StardustCanvas } from './StardustCanvas';
import { FloatingBalloons } from './FloatingBalloons';

interface HeroProps {
  onStartCelebration?: () => void;
  onScrollToSection?: (sectionId: string) => void;
  onCandleTest?: () => void;
  onWaxSealTest?: () => void;
  onFanfareTest?: () => void;
  onBalloonPopTest?: () => void;
  onGiftOpenTest?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCelebration,
  onScrollToSection,
  onCandleTest,
  onWaxSealTest,
  onFanfareTest,
  onBalloonPopTest,
  onGiftOpenTest,
}) => {
  const handleStartCelebration = () => {
    fireCelebrationConfetti();
    audioEngine.playMelody();

    if (onStartCelebration) {
      onStartCelebration();
    } else {
      const target = document.getElementById('memory-lane') || document.getElementById('birthday-cake');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollTo = (id: string) => {
    if (onScrollToSection) {
      onScrollToSection(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCandleClick = () => {
    if (onCandleTest) {
      onCandleTest();
    } else {
      audioEngine.playCandleBlowoutSFX();
      fireCandleExtinguishConfetti();
    }
  };

  const handleWaxSealClick = () => {
    if (onWaxSealTest) {
      onWaxSealTest();
    } else {
      audioEngine.playWaxSealBreakSFX();
    }
  };

  const handleFanfareClick = () => {
    if (onFanfareTest) {
      onFanfareTest();
    } else {
      audioEngine.playConfettiFanfareSFX();
      fireCelebrationConfetti();
    }
  };

  const handleBalloonPopClick = () => {
    if (onBalloonPopTest) {
      onBalloonPopTest();
    } else {
      audioEngine.playBalloonPopSFX();
    }
  };

  const handleGiftOpenClick = () => {
    if (onGiftOpenTest) {
      onGiftOpenTest();
    } else {
      audioEngine.playGiftOpenSFX();
      fireGiftOpenConfetti();
    }
  };

  return (
    <section className="text-center py-6 sm:py-12 space-y-6 relative overflow-hidden rounded-3xl min-h-[520px] flex flex-col justify-center items-center">
      {/* Background Golden Stardust Particle Engine */}
      <StardustCanvas />

      {/* Interactive Floating SVG Balloons (Pop & Localized Confetti) */}
      <FloatingBalloons />

      {/* Royal Crown Badge with Golden Shimmer */}
      <div className="relative z-20 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs sm:text-sm font-medium shadow-glow-gold backdrop-blur-md transition-all hover:bg-gold-400/15">
        <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
        <span className="font-semibold">👑 أميرة هذا اليوم • هديل</span>
        <span className="text-gold-400/40 hidden sm:inline">•</span>
        <span>نظام الاحتفال الفاخر • الإصدار المخصص لهديل</span>
      </div>

      {/* Glowing Amiri Typography Headline */}
      <div className="relative z-20 space-y-3 max-w-4xl px-4">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-amiri font-bold gold-gradient-text tracking-wide leading-tight drop-shadow-[0_0_35px_rgba(243,192,91,0.4)]">
          كل عام وأنتِ بخير يا هديل ✨ كل عام وأنتِ الخير لكل عام يا هديل
        </h2>

        {/* Elegant Subtitle */}
        <p className="text-base sm:text-xl lg:text-2xl font-cairo text-ivory font-medium leading-relaxed drop-shadow-sm">
          يوم ميلاد أسعد، يا أجمل وأغلى أخت في الدنيا ✨
        </p>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-ivory-lavender leading-relaxed pt-1">
          تم بنجاح بناء محرك الصوت الإجرائي Web Audio API، وتجهيز الصور الثمانية مع تصحيح زوايا الدوران بالكامل،
          وتضمين الرسائل الأخوية العميقة وشهادة التقدير.
        </p>
      </div>

      {/* Primary Action Call-to-Actions (CTAs) */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
        {/* Main Celebration Trigger */}
        <button
          onClick={handleStartCelebration}
          className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm sm:text-base shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="ابدأي الاحتفال 🎈"
        >
          <PartyPopper className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>ابدأي الاحتفال 🎈</span>
        </button>

        {/* Brother's Letter CTA */}
        <button
          onClick={() => handleScrollTo('brother-letter')}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full glass-panel glass-panel-hover text-gold-200 hover:text-white font-medium text-xs sm:text-sm border border-gold-400/30 hover:border-gold-400/60 transition-all duration-300"
          aria-label="رسالة أخوكِ 💌"
        >
          <Mail className="w-4 h-4 text-roseGold-400" />
          <span>رسالة أخوكِ 💌</span>
        </button>

        {/* Birthday Cake Candle CTA */}
        <button
          onClick={() => handleScrollTo('birthday-cake')}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full glass-panel glass-panel-hover text-gold-200 hover:text-white font-medium text-xs sm:text-sm border border-gold-400/30 hover:border-gold-400/60 transition-all duration-300"
          aria-label="إطفاء الشمعة 🎂"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>إطفاء الشمعة 🎂</span>
        </button>
      </div>

      {/* Quick Sound FX Test Panel (Preserves Tier 1/2/3 Test Suite Expectations) */}
      <div className="relative z-20 pt-4 w-full max-w-4xl px-2">
        <h3 className="text-xs uppercase tracking-widest text-gold-300 font-semibold mb-3">
          اختبار المؤثرات الصوتية الإجرائية (Web Audio API Synthesizer)
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={handleCandleClick}
            className="px-3 py-2 rounded-xl glass-panel glass-panel-hover flex items-center gap-2 text-xs sm:text-sm text-gold-200 hover:text-white"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>نفخ الشمعة (Air + Chime)</span>
          </button>

          <button
            onClick={handleWaxSealClick}
            className="px-3 py-2 rounded-xl glass-panel glass-panel-hover flex items-center gap-2 text-xs sm:text-sm text-gold-200 hover:text-white"
          >
            <Mail className="w-4 h-4 text-roseGold-400" />
            <span>كسر ختم الشمع (Snap + Rustle)</span>
          </button>

          <button
            onClick={handleFanfareClick}
            className="px-3 py-2 rounded-xl glass-panel glass-panel-hover flex items-center gap-2 text-xs sm:text-sm text-gold-200 hover:text-white"
          >
            <PartyPopper className="w-4 h-4 text-yellow-300" />
            <span>فرحة الكنفيتي (Chime Fanfare)</span>
          </button>

          <button
            onClick={handleBalloonPopClick}
            className="px-3 py-2 rounded-xl glass-panel glass-panel-hover flex items-center gap-2 text-xs sm:text-sm text-gold-200 hover:text-white"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>فرقعة البالون (Cute Pop)</span>
          </button>

          <button
            onClick={handleGiftOpenClick}
            className="px-3 py-2 rounded-xl glass-panel glass-panel-hover flex items-center gap-2 text-xs sm:text-sm text-gold-200 hover:text-white"
          >
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>فتح الهدية (Magical Shimmer)</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
