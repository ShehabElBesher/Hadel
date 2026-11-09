import React from 'react';
import {
  Calendar,
  HeartHandshake,
  Camera,
  Crown,
  Sparkles,
  Award,
} from 'lucide-react';
import { MilestoneCounter } from '../../types';
import { milestoneCounters as defaultCounters } from '../../data/sisterWishes';

export interface MilestoneCountersProps {
  counters?: MilestoneCounter[];
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Calendar,
  HeartHandshake,
  Camera,
  Crown,
  Sparkles,
};

export const MilestoneCounters: React.FC<MilestoneCountersProps> = ({
  counters = defaultCounters,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {counters.map((counter, idx) => {
        const IconComponent = ICON_MAP[counter.iconName] || Award;

        return (
          <div
            key={counter.id}
            className="group relative glass-panel rounded-2xl p-4 sm:p-6 text-center space-y-2.5 transition-all duration-300 border border-gold-400/20 hover:border-gold-400/50 hover:shadow-glow-gold hover:-translate-y-1 overflow-hidden"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Ambient Background Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gold-400/5 blur-xl group-hover:bg-gold-400/15 transition-colors pointer-events-none" />

            {/* Top Icon Badge */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400 mx-auto group-hover:scale-110 group-hover:text-gold-200 transition-all duration-300 shadow-xs relative z-10">
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Metric Number Display */}
            <div className="text-3xl sm:text-4xl lg:text-5xl font-amiri font-bold gold-gradient-text tracking-wide relative z-10 leading-none drop-shadow-[0_2px_10px_rgba(245,207,117,0.3)]">
              {counter.number}
            </div>

            {/* Metric Label */}
            <div className="text-sm sm:text-base font-semibold text-ivory relative z-10">
              {counter.label}
            </div>

            {/* Metric Sublabel */}
            <div className="text-xs text-ivory-lavender leading-relaxed relative z-10">
              {counter.sublabel}
            </div>

            {/* Subtle bottom golden indicator */}
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto pt-1" />
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneCounters;
