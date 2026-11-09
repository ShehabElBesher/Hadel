import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-panel rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
        hoverEffect ? 'glass-panel-hover hover:-translate-y-0.5' : ''
      } ${glow ? 'shadow-glow-gold' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
