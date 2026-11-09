import React, { useState } from 'react';
import { Sparkles, Heart, Image as ImageIcon } from 'lucide-react';
import { photosData } from '../../data/photosData';
import { PhotoCard } from './PhotoCard';
import { LightboxModal } from './LightboxModal';

type FilterCategory = 'all' | 'modern' | 'vintage';

export const Gallery: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  // Baseline authentic sibling affection reactions
  const [likes, setLikes] = useState<Record<string, number>>(() => ({
    'photo-1': 28,
    'photo-2': 35,
    'photo-3': 42,
    'photo-4': 24,
    'photo-5': 31,
    'photo-6': 29,
    'photo-7': 45,
    'photo-8': 38,
  }));

  const handleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1,
    }));
  };

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNavigateLightbox = (newIndex: number) => {
    setSelectedPhotoIndex(newIndex);
  };

  const filteredPhotos = photosData.filter((photo) => {
    if (activeFilter === 'all') return true;
    return photo.chapter === activeFilter;
  });

  const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0);

  return (
    <section id="memory-lane" className="space-y-8 animate-fade-in scroll-mt-20">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>المعرض التفاعلي الفاخر • 8 محطات خالدة</span>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-amiri font-bold gold-gradient-text">
          شريط الذكريات 📸
        </h3>

        <p className="text-sm sm:text-base text-ivory-lavender max-w-2xl mx-auto leading-relaxed">
          لحظات لا تُنسى وثّقها الزمان.. محفورة في القلب إلى الأبد
        </p>

        {/* Global Reactions Summary Bar */}
        <div className="flex items-center justify-center gap-4 pt-1 text-xs text-ivory-muted">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-850/80 border border-gold-400/15">
            <Heart className="w-3.5 h-3.5 text-roseGold-400 fill-roseGold-400" />
            <span>إجمالي تفاعلات المحبة: </span>
            <strong className="font-mono text-gold-300 font-bold">{totalLikes}</strong>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-850/80 border border-gold-400/15">
            <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
            <span>عدد الصور: </span>
            <strong className="font-mono text-gold-300 font-bold">{photosData.length}</strong>
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className="inline-flex p-1 rounded-2xl bg-obsidian-850/90 border border-gold-400/20 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold shadow-md'
                : 'text-ivory-lavender hover:text-gold-200'
            }`}
          >
            جميع الذكريات (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('modern')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeFilter === 'modern'
                ? 'bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold shadow-md'
                : 'text-ivory-lavender hover:text-gold-200'
            }`}
          >
            إشراقة الحاضر (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('vintage')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeFilter === 'vintage'
                ? 'bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold shadow-md'
                : 'text-ivory-lavender hover:text-gold-200'
            }`}
          >
            أيام الصبا والذكريات (5)
          </button>
        </div>
      </div>

      {/* Asymmetric Bento / Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredPhotos.map((photo, idx) => {
          // Find original index in full photosData array so Lightbox navigates accurately
          const originalIndex = photosData.findIndex((p) => p.id === photo.id);
          return (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={originalIndex >= 0 ? originalIndex : idx}
              likes={likes[photo.id] || 0}
              onLike={handleLike}
              onClick={() => handleOpenLightbox(originalIndex >= 0 ? originalIndex : idx)}
            />
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        photos={photosData}
        currentIndex={selectedPhotoIndex}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
        likes={likes}
        onLike={handleLike}
      />
    </section>
  );
};

export default Gallery;
