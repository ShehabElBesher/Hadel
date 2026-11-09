import React, { useState } from 'react';
import {
  Heart,
  Smile,
  Shield,
  Sparkles,
  Sun,
  Star,
  Award,
} from 'lucide-react';
import { SisterWishReason } from '../../types';

export interface ReasonCardProps {
  reason: SisterWishReason;
  index?: number;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  Smile,
  Shield,
  Sparkles,
  Sun,
  Star,
};

export const ReasonCard: React.FC<ReasonCardProps> = ({
  reason,
  index = 0,
  className = '',
}) => {
  const [likes, setLikes] = useState<number>(10);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [sparkleAnim, setSparkleAnim] = useState<boolean>(false);

  const IconComponent = ICON_MAP[reason.iconName] || Award;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    setSparkleAnim(true);
    setTimeout(() => setSparkleAnim(false), 700);
  };

  return (
    <div
      className={`group relative glass-panel rounded-2xl p-5 sm:p-6 transition-all duration-300 border border-gold-400/20 hover:border-gold-400/50 hover:shadow-glow-gold hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${className}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Accent Radial Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl group-hover:bg-gold-400/10 transition-colors pointer-events-none" />

      {/* Floating Animated Heart Particles upon click */}
      {sparkleAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-fade-in">
          <Heart className="w-12 h-12 text-roseGold-400 fill-roseGold-400 animate-ping opacity-60" />
        </div>
      )}

      {/* Card Header: Icon Badge & Interactive Heart */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-300 group-hover:scale-110 group-hover:text-gold-200 transition-all duration-300 shadow-xs">
            <IconComponent className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold-400/10 text-gold-300 border border-gold-400/25">
            {reason.badge}
          </span>
        </div>

        {/* Interactive Heart Reaction Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={`تفاعل محبة لـ ${reason.title}`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer ${
            isLiked
              ? 'bg-roseGold-500/20 border-roseGold-400/40 text-roseGold-300 scale-105'
              : 'bg-obsidian-850 border-gold-400/20 text-ivory-lavender hover:text-roseGold-300 hover:border-roseGold-400/30'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isLiked ? 'fill-roseGold-400 text-roseGold-400 scale-110' : 'text-roseGold-400'
            }`}
          />
          <span className="font-mono text-[11px]">{likes}</span>
        </button>
      </div>

      {/* Reason Card Title & Description */}
      <div className="space-y-2 relative z-10 flex-1">
        <h4 className="text-lg font-bold font-amiri text-gold-200 group-hover:text-gold-100 transition-colors">
          {reason.title}
        </h4>
        <p className="text-xs sm:text-sm text-ivory-muted leading-relaxed">
          {reason.description}
        </p>
      </div>

      {/* Decorative Bottom Gold Accent Line */}
      <div className="mt-4 pt-3 border-t border-gold-400/10 flex items-center justify-between text-[11px] text-ivory-lavender">
        <span className="flex items-center gap-1 text-gold-400/70">
          <Sparkles className="w-3 h-3 text-gold-400" />
          صفات أصيلة للأخت الغالية
        </span>
        <span className="font-mono text-gold-300/80">خصلة {index + 1}</span>
      </div>
    </div>
  );
};

export default ReasonCard;
