import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Calendar,
  Heart,
  Tag,
} from 'lucide-react';
import { PhotoMemory } from '../../types';
import { HeartParticles } from './HeartParticles';

interface LightboxModalProps {
  photos: PhotoMemory[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  likes: Record<string, number>;
  onLike: (photoId: string, e: React.MouseEvent) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  likes,
  onLike,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [likeTrigger, setLikeTrigger] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const totalPhotos = photos.length;
  // Boundary safety check (satisfies F2-T2-02)
  const safeIndex =
    currentIndex >= 0 && currentIndex < totalPhotos ? currentIndex : 0;
  const currentPhoto = photos[safeIndex];

  // Mathematical wrap-around navigation
  const handleNext = useCallback(() => {
    setIsZoomed(false);
    onNavigate((safeIndex + 1) % totalPhotos);
  }, [safeIndex, totalPhotos, onNavigate]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    onNavigate((safeIndex - 1 + totalPhotos) % totalPhotos);
  }, [safeIndex, totalPhotos, onNavigate]);

  // Body scroll locking when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Keyboard navigation: Escape closes, ArrowRight moves next (RTL), ArrowLeft moves prev (RTL)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // In Arabic RTL context, ArrowRight moves to next
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // In Arabic RTL context, ArrowLeft moves to previous
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch Swipe Handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Only handle horizontal swipes if horizontal motion dominates
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        // Swiped left -> next
        handleNext();
      } else {
        // Swiped right -> prev
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeTrigger((prev) => prev + 1);
    onLike(currentPhoto.id, e);
  };

  const toggleZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsZoomed((prev) => !prev);
  };

  if (!isOpen || !currentPhoto) return null;

  const currentLikes = likes[currentPhoto.id] || 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة مكبرة: ${currentPhoto.title}`}
      onClick={onClose}
      className="fixed inset-0 z-50 backdrop-blur-2xl bg-black/85 flex flex-col justify-between items-center p-2 sm:p-6 select-none animate-fade-in"
    >
      {/* Top Glassmorphism Control Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl flex items-center justify-between px-4 py-3 rounded-2xl glass-panel border-gold-400/25 z-20 shadow-glow-gold"
      >
        {/* Photo Index Counter */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-amiri font-bold bg-gold-400/15 text-gold-300 border border-gold-400/30">
            صورة {safeIndex + 1} من {totalPhotos}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-obsidian-850 text-gold-200 border border-gold-400/20">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>{currentPhoto.dateBadge}</span>
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom Toggle Button */}
          <button
            type="button"
            onClick={toggleZoom}
            aria-label={isZoomed ? 'تصغير الصورة' : 'تكبير الصورة'}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-obsidian-850 hover:bg-gold-500/20 text-gold-300 border border-gold-400/20 hover:border-gold-400/50 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
          >
            {isZoomed ? (
              <>
                <ZoomOut className="w-4 h-4 text-gold-400" />
                <span className="hidden md:inline">تصغير</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-4 h-4 text-gold-400" />
                <span className="hidden md:inline">تكبير</span>
              </>
            )}
          </button>

          {/* Heart Like in Lightbox */}
          <div className="relative">
            <HeartParticles triggerCount={likeTrigger} />
            <button
              type="button"
              onClick={handleHeartClick}
              aria-label={`إعجاب (${currentLikes})`}
              className="px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-gold-500/20 text-roseGold-400 hover:text-roseGold-300 border border-gold-400/20 hover:border-gold-400/50 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${currentLikes > 0 ? 'fill-roseGold-400' : ''}`} />
              <span className="font-mono font-bold text-gold-300">{currentLikes}</span>
            </button>
          </div>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق المعرض"
            className="p-2 rounded-xl bg-obsidian-850 hover:bg-red-500/20 text-gold-300 hover:text-white border border-gold-400/20 hover:border-red-400/40 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Stage: Image and Nav Chevrons */}
      <div
        className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Next / Previous Navigation Buttons */}
        {/* Next Button (ArrowRight / ChevronRight in RTL) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="الصورة التالية"
          className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full glass-panel border border-gold-400/30 hover:border-gold-400/70 text-gold-300 hover:text-white flex items-center justify-center shadow-glow-gold hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Previous Button (ArrowLeft / ChevronLeft in RTL) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="الصورة السابقة"
          className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full glass-panel border border-gold-400/30 hover:border-gold-400/70 text-gold-300 hover:text-white flex items-center justify-center shadow-glow-gold hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Image Container with Zoom Toggle & Smooth Transitions */}
        <div
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={toggleZoom}
          className={`relative max-h-[68vh] sm:max-h-[72vh] max-w-[88vw] sm:max-w-[78vw] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
            isZoomed ? 'overflow-auto cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        >
          <picture>
            {currentPhoto.webpPath && <source srcSet={currentPhoto.webpPath} type="image/webp" />}
            <img
              src={currentPhoto.webPath}
              alt={currentPhoto.title}
              className={`max-h-[68vh] sm:max-h-[72vh] w-auto object-contain rounded-2xl transition-transform duration-500 ease-out ${
                isZoomed ? 'scale-150 sm:scale-175' : 'scale-100'
              }`}
            />
          </picture>
        </div>
      </div>

      {/* Bottom Glassmorphism Caption Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl glass-panel rounded-2xl p-3.5 sm:p-5 border-gold-400/25 z-20 space-y-2 text-center shadow-glow-gold"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h3 className="text-lg sm:text-2xl font-bold font-amiri gold-gradient-text">
            {currentPhoto.title}
          </h3>
          <span className="sm:hidden text-xs text-gold-300 bg-obsidian-850 px-2 py-0.5 rounded-full border border-gold-400/20">
            {currentPhoto.dateBadge}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-ivory-muted max-w-2xl mx-auto leading-relaxed">
          {currentPhoto.caption}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {currentPhoto.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[10px] text-ivory-lavender bg-obsidian-850/80 px-2 py-0.5 rounded-full border border-gold-400/15"
            >
              <Tag className="w-2.5 h-2.5 text-gold-400/70" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
