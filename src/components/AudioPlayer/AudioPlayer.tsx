import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import { AudioEngineState } from '../../types';

export const AudioPlayer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [audioState, setAudioState] = useState<AudioEngineState>({
    isPlaying: audioEngine.isPlaying(),
    isMuted: audioEngine.isMuted(),
    volume: audioEngine.getVolume(),
  });

  // Subscribe to Audio Engine state updates
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState({ ...state });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // First user gesture listener to unlock audio context smoothly
  useEffect(() => {
    let unlocked = false;
    const unlockAudio = () => {
      if (unlocked) return;
      unlocked = true;
      audioEngine.init().catch((err) => {
        console.warn('AudioContext unlock failed gracefully:', err);
      });
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true, once: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('keydown', unlockAudio, { passive: true, once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  const handleToggleMelody = () => {
    audioEngine.toggleMelody();
  };

  const handleToggleMute = () => {
    audioEngine.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioEngine.setVolume(val);
  };

  const isBarActive = audioState.isPlaying && !audioState.isMuted;

  return (
    <aside
      aria-label="مشغل الموسيقى الاحتفالي المنساب"
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 transition-all duration-300 max-w-[calc(100vw-2rem)] ${className}`}
    >
      <style>{`
        @keyframes soundbar1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes soundbar2 {
          0%, 100% { height: 6px; }
          50% { height: 20px; }
        }
        @keyframes soundbar3 {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        @keyframes soundbar4 {
          0%, 100% { height: 5px; }
          50% { height: 18px; }
        }
      `}</style>

      {/* Floating Glassmorphism Player Pill */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 bg-obsidian-850/90 backdrop-blur-xl px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-gold-400/30 shadow-glass-card hover:border-gold-400/50 transition-all duration-300 group">
        {/* Animated Equalizer Soundbars */}
        <div className="flex items-end justify-center gap-0.5 h-5 w-5 sm:w-6 pb-0.5">
          <span
            className={`w-1 rounded-full transition-all duration-300 ${
              isBarActive ? 'bg-gold-400' : 'bg-gold-400/30'
            }`}
            style={{
              animation: isBarActive ? 'soundbar1 0.7s ease-in-out 0s infinite' : 'none',
              height: isBarActive ? undefined : '4px',
            }}
          />
          <span
            className={`w-1 rounded-full transition-all duration-300 ${
              isBarActive ? 'bg-amber-300' : 'bg-gold-400/30'
            }`}
            style={{
              animation: isBarActive ? 'soundbar2 0.5s ease-in-out 0.15s infinite' : 'none',
              height: isBarActive ? undefined : '6px',
            }}
          />
          <span
            className={`w-1 rounded-full transition-all duration-300 ${
              isBarActive ? 'bg-gold-500' : 'bg-gold-400/30'
            }`}
            style={{
              animation: isBarActive ? 'soundbar3 0.8s ease-in-out 0.3s infinite' : 'none',
              height: isBarActive ? undefined : '4px',
            }}
          />
          <span
            className={`w-1 rounded-full transition-all duration-300 ${
              isBarActive ? 'bg-roseGold-400' : 'bg-gold-400/30'
            }`}
            style={{
              animation: isBarActive ? 'soundbar4 0.6s ease-in-out 0.45s infinite' : 'none',
              height: isBarActive ? undefined : '5px',
            }}
          />
        </div>

        {/* Track Status Badge */}
        <div className="hidden xs:flex flex-col text-right">
          <span className="text-[11px] sm:text-xs font-semibold text-gold-300 whitespace-nowrap">
            {audioState.isPlaying ? 'لحن عيد الميلاد 🎵' : 'عزف صندوق الموسيقى'}
          </span>
          <span className="text-[9px] text-ivory-lavender/80 hidden md:inline-block">
            {audioState.isPlaying ? 'عزف حي هادئ' : 'انقر للتشغيل'}
          </span>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          onClick={handleToggleMelody}
          className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            audioState.isPlaying
              ? 'bg-gold-500 text-obsidian-950 shadow-glow-gold hover:bg-gold-400'
              : 'bg-gold-400/15 text-gold-400 hover:bg-gold-400/25'
          }`}
          title={audioState.isPlaying ? 'إيقاف اللحن' : 'تشغيل اللحن الموسيقي'}
          aria-label="Toggle Birthday Melody"
        >
          {audioState.isPlaying ? (
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
          )}
        </button>

        {/* Mute / Unmute Toggle Button */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 text-gold-300 hover:text-gold-200 transition-colors cursor-pointer"
          title={audioState.isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
          aria-label="Toggle Mute"
        >
          {audioState.isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-roseGold-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={audioState.isMuted ? 0 : audioState.volume}
          onChange={handleVolumeChange}
          className="w-14 sm:w-20 accent-gold-400 cursor-pointer h-1.5 bg-obsidian-700 rounded-lg"
          aria-label="Volume Slider"
        />

        {/* Percentage Label */}
        <span className="text-[10px] sm:text-[11px] text-gold-300 font-mono min-w-[28px] text-left">
          {audioState.isMuted ? '0%' : `${Math.round(audioState.volume * 100)}%`}
        </span>
      </div>
    </aside>
  );
};

export default AudioPlayer;
