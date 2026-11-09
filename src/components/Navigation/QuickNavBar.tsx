import React from 'react';
import {
  Sparkles,
  Flame,
  Camera,
  Mail,
  Gift,
} from 'lucide-react';

export interface QuickNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface QuickNavBarProps {
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
  className?: string;
}

export const NAV_ITEMS: QuickNavItem[] = [
  {
    id: 'hero',
    label: 'الرئيسية',
    icon: Sparkles,
  },
  {
    id: 'birthday-cake',
    label: 'كعكة الميلاد',
    icon: Flame,
  },
  {
    id: 'memory-lane',
    label: 'شريط الذكريات',
    icon: Camera,
  },
  {
    id: 'brother-letter',
    label: 'رسالة أخوية',
    icon: Mail,
  },
  {
    id: 'sister-wishes',
    label: 'أمنيات وهدية',
    icon: Gift,
  },
];

export const QuickNavBar: React.FC<QuickNavBarProps> = ({
  activeSection = 'hero',
  onNavigate,
  className = '',
}) => {
  return (
    <nav
      role="navigation"
      aria-label="شريط التنقل السريع"
      className={`fixed bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] px-1.5 py-1 sm:px-3 sm:py-2 rounded-full glass-panel border border-gold-400/30 backdrop-blur-xl shadow-glow-gold flex items-center gap-0.5 sm:gap-1.5 transition-all duration-300 select-none ${className}`}
    >
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold shadow-md scale-105'
                : 'text-ivory-lavender hover:text-gold-200 hover:bg-gold-400/10'
            }`}
          >
            <IconComponent
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                isActive ? 'text-obsidian-950' : 'text-gold-400'
              }`}
            />
            <span className={`${isActive ? 'inline' : 'hidden md:inline'}`}>
              {item.label}
            </span>

            {/* Subtle active indicator dot for mobile when label is hidden */}
            {isActive && (
              <span className="md:hidden w-1.5 h-1.5 rounded-full bg-obsidian-950 inline-block -mr-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default QuickNavBar;
