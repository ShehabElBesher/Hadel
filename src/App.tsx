import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  Music,
} from 'lucide-react';
import { audioEngine } from './services/audioEngine';
import {
  fireCelebrationConfetti,
  fireCandleExtinguishConfetti,
  fireGiftOpenConfetti,
} from './services/confetti';
import { AudioEngineState } from './types';

// Milestone 2, 3, 4 & 5 Components
import { Hero } from './components/Hero';
import { AudioPlayer } from './components/AudioPlayer';
import { Gallery } from './components/Gallery';
import { BirthdayCake } from './components/Cake';
import { BrotherLetter } from './components/Letter';
import { SisterWishes, MilestoneCounters } from './components/Wishes';
import { QuickNavBar } from './components/Navigation';

export const App: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioEngineState>({
    isPlaying: audioEngine.isPlaying(),
    isMuted: audioEngine.isMuted(),
    volume: audioEngine.getVolume(),
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'message' | 'reasons'>('overview');

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState({ ...state });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleCandleTest = () => {
    audioEngine.playCandleBlowoutSFX();
    fireCandleExtinguishConfetti();
  };

  const handleWaxSealTest = () => {
    audioEngine.playWaxSealBreakSFX();
  };

  const handleFanfareTest = () => {
    audioEngine.playConfettiFanfareSFX();
    fireCelebrationConfetti();
  };

  const handleBalloonPopTest = () => {
    audioEngine.playBalloonPopSFX();
  };

  const handleGiftOpenTest = () => {
    audioEngine.playGiftOpenSFX();
    fireGiftOpenConfetti();
  };

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'brother-letter') {
      setActiveTab('message');
    } else if (sectionId === 'memory-lane') {
      setActiveTab('photos');
    } else if (sectionId === 'sister-wishes') {
      setActiveTab('reasons');
    } else if (sectionId === 'hero') {
      setActiveTab('overview');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-ivory flex flex-col selection:bg-gold-500 selection:text-obsidian-950 font-cairo relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-roseGold-500/5 blur-[140px]" />
      </div>

      {/* Persistent Royal Header Bar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gold-400/20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
            <Crown className="w-5 h-5 lucide-crown" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold font-amiri gold-gradient-text">
              عيد ميلاد هديل • Hadel&apos;s Birthday
            </h1>
            <p className="text-xs text-gold-300/90 font-medium">هدية ومفاجأة من أخوكِ شهاب بمناسبة يوم ميلادكِ السعيد 🤍</p>
          </div>
        </div>

        {/* Header Right Royal Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-medium backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>من أخوكِ شهاب • إلى هديل</span>
        </div>
      </header>

      {/* Floating Glassmorphism Audio Player Pill */}
      <AudioPlayer />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-32 sm:pb-36 relative z-10 space-y-10 sm:space-y-12">
        {/* Milestone 2 Celebratory Hero Section */}
        <Hero
          onStartCelebration={() => handleScrollToSection('memory-lane')}
          onScrollToSection={handleScrollToSection}
          onCandleTest={handleCandleTest}
          onWaxSealTest={handleWaxSealTest}
          onFanfareTest={handleFanfareTest}
          onBalloonPopTest={handleBalloonPopTest}
          onGiftOpenTest={handleGiftOpenTest}
        />

        {/* Milestone 4 Virtual Birthday Cake & Interactive Candle */}
        <BirthdayCake />

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-gold-400/20">
          <nav className="flex space-x-2 space-x-reverse" aria-label="أقسام الموقع">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory-lavender hover:text-gold-200'
              }`}
            >
              نظرة عامة والعدادات
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'photos'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory-lavender hover:text-gold-200'
              }`}
            >
              الصور المعالجة (8 صور)
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'message'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory-lavender hover:text-gold-200'
              }`}
            >
              رسالة الأخ
            </button>
            <button
              onClick={() => setActiveTab('reasons')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reasons'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory-lavender hover:text-gold-200'
              }`}
            >
              أسباب تميز هديل والشهادة
            </button>
          </nav>
        </div>

        {/* Tab 1: Overview & Counters */}
        {activeTab === 'overview' && (
          <section className="space-y-8 animate-fade-in">
            <MilestoneCounters />

            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 border-gold-400/20">
              <h3 className="text-xl font-bold font-amiri text-gold-300 flex items-center gap-2">
                <Music className="w-5 h-5 text-gold-400" />
                <span>حالة المحرك الصوتي الموسيقي (Procedural Web Audio API)</span>
              </h3>
              <p className="text-sm text-ivory-muted leading-relaxed">
                يستخدم النظام تركيباً نغمياً مستوحى من صناديق الموسيقى السويسرية وأجراس السيليستا السماوية (Sine
                oscillators with 2.756× inharmonic overtones). يعمل المحرك بدون الحاجة لأي ملفات صوتية خارجية
                (MP3/WAV) أو اتصال بالإنترنت، ويدعم التكرار السلس والتحكم الكامل في الصوت والترددات.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gold-200">
                <span className="px-3 py-1 bg-obsidian-800 rounded-full border border-gold-400/20">
                  الحالة: {audioState.isPlaying ? 'قيد العزف 🎶' : 'متوقف مؤقتاً ⏸️'}
                </span>
                <span className="px-3 py-1 bg-obsidian-800 rounded-full border border-gold-400/20">
                  الكتم: {audioState.isMuted ? 'مكتوم 🔇' : 'مسموع 🔊'}
                </span>
                <span className="px-3 py-1 bg-obsidian-800 rounded-full border border-gold-400/20">
                  مستوى الصوت: {Math.round(audioState.volume * 100)}%
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Interactive Memory Lane (Bento Photo Gallery & Lightbox Modal) */}
        {activeTab === 'photos' && <Gallery />}

        {/* Tab 3: Brother's Message (Milestone 4 Brother's Wax-Sealed Letter) */}
        {activeTab === 'message' && <BrotherLetter />}

        {/* Tab 4: Sister Wishes & Certificate (Milestone 5) */}
        <div id="sister-wishes" className="scroll-mt-20">
          {activeTab === 'reasons' && <SisterWishes />}
        </div>
      </main>

      {/* Floating Bottom Quick Navigation Bar */}
      <QuickNavBar
        activeSection={
          activeTab === 'photos'
            ? 'memory-lane'
            : activeTab === 'message'
            ? 'brother-letter'
            : activeTab === 'reasons'
            ? 'sister-wishes'
            : 'hero'
        }
        onNavigate={handleScrollToSection}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-gold-400/15 py-6 pb-20 sm:pb-24 text-center text-xs text-ivory-lavender relative z-10">
        <p>صُنع بكل محبة واعتزاز للاحتفال بأجمل أخت في الدنيا • هديل ✨</p>
      </footer>
    </div>
  );
};

export default App;
