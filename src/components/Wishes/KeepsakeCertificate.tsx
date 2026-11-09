import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  Award,
  Copy,
  Check,
  X,
  Heart,
} from 'lucide-react';
import { KeepsakeCertificate as KeepsakeCertificateType } from '../../types';
import { keepsakeCertificate as defaultCertificate } from '../../data/sisterWishes';

export interface KeepsakeCertificateProps {
  certificate?: KeepsakeCertificateType;
  onOpenModal?: () => void;
  className?: string;
}

export interface KeepsakeCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate?: KeepsakeCertificateType;
}

/**
 * Inline Keepsake Certificate Card (Always present in Wishes section)
 */
export const KeepsakeCertificateCard: React.FC<KeepsakeCertificateProps> = ({
  certificate = defaultCertificate,
  onOpenModal,
  className = '',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    const textToCopy = `${certificate.title}\n${certificate.subtitle}\n\n${certificate.declaration}\n\nالممنوح لها: ${certificate.recipientName}\nالجهة المانحة: ${certificate.awardedBy}\n${certificate.sealText}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className={`relative glass-panel rounded-3xl p-6 sm:p-10 border-2 border-gold-400/40 text-center space-y-6 max-w-3xl mx-auto shadow-glow-gold overflow-hidden ${className}`}
    >
      {/* Background Decorative Guilloche / Stardust Aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-roseGold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Ornate Frame Corners */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400/60" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-400/60" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/60" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/60" />

      {/* Royal Crown Crest */}
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400/20 via-gold-400/10 to-transparent border-2 border-gold-400/40 flex items-center justify-center text-gold-400 mx-auto shadow-glow-gold">
          <Crown className="w-8 h-8" />
        </div>
      </div>

      {/* Titles */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-gold-400" />
          <span>شهادة فخر ومحبة أخوية ملكية</span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-amiri gold-gradient-text">
          {certificate.title}
        </h3>
        <p className="text-xs sm:text-sm text-ivory-lavender font-medium">
          {certificate.subtitle}
        </p>
      </div>

      {/* Declaration Parchment Box */}
      <div className="relative z-10 p-5 sm:p-6 bg-obsidian-850/80 rounded-2xl border border-gold-400/25 text-sm sm:text-base leading-relaxed sm:leading-loose text-ivory-muted font-amiri shadow-inner">
        <p className="text-justify">{certificate.declaration}</p>
      </div>

      {/* Certificate Footer Metadata */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gold-300 pt-4 border-t border-gold-400/25">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-roseGold-400 fill-roseGold-400" />
          <span className="font-semibold">الممنوح لها: {certificate.recipientName}</span>
        </div>
        <div className="font-mono text-xs text-gold-400/90 bg-obsidian-900/80 px-3 py-1 rounded-full border border-gold-400/20">
          {certificate.sealText}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel glass-panel-hover text-gold-200 hover:text-white border border-gold-400/30 text-xs sm:text-sm font-medium transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>تم نسخ نص الشهادة!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gold-400" />
              <span>نسخ نص الشهادة 📋</span>
            </>
          )}
        </button>

        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs sm:text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>عرض الشهادة الملكية كاملة 👑</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Accessible Modal Dialog for Surprise Keepsake Certificate
 */
export const KeepsakeCertificateModal: React.FC<KeepsakeCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate = defaultCertificate,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const textToCopy = `${certificate.title}\n${certificate.subtitle}\n\n${certificate.declaration}\n\nالممنوح لها: ${certificate.recipientName}\nالجهة المانحة: ${certificate.awardedBy}\n${certificate.sealText}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-900 rounded-3xl p-6 sm:p-10 border-2 border-gold-400/60 shadow-[0_20px_60px_rgba(245,207,117,0.25)] text-center space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق الشهادة"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-obsidian-800 border border-gold-400/30 flex items-center justify-center text-gold-300 hover:text-white hover:border-gold-400 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ornate Gold Frame Corners */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-400 pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-400 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-400 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-400 pointer-events-none" />

        {/* Crown & Royal Seal */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-amber-500 shadow-glow-gold-lg border-2 border-gold-200 flex items-center justify-center text-obsidian-950 mx-auto">
          <Crown className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md" />
        </div>

        {/* Certificate Titles */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>شهادة فخر ومحبة: أروع وأغلى أخت لعام 2026 👑</span>
          </div>
          <h3
            id="certificate-modal-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold font-amiri gold-gradient-text"
          >
            {certificate.title}
          </h3>
          <p className="text-xs sm:text-sm text-ivory-lavender">
            {certificate.subtitle}
          </p>
        </div>

        {/* Certificate Warm Prose Body */}
        <div className="p-5 sm:p-6 bg-obsidian-950/70 rounded-2xl border border-gold-400/25 text-sm sm:text-base leading-relaxed sm:leading-loose text-ivory font-amiri shadow-inner">
          <p className="text-justify">{certificate.declaration}</p>
        </div>

        {/* Signatures & Seal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gold-400/25 text-xs sm:text-sm text-gold-300">
          <div className="space-y-1">
            <span className="text-ivory-lavender text-[11px]">الممنوح لها:</span>
            <div className="font-bold text-base text-gold-200 font-amiri">
              الأخت الغالية {certificate.recipientName} 💖
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-ivory-lavender text-[11px]">الجهة المانحة:</span>
            <div className="font-bold text-base text-gold-200 font-amiri">
              {certificate.awardedBy} ✍️
            </div>
          </div>
        </div>

        <div className="pt-1">
          <span className="font-mono text-xs text-gold-400/90 bg-obsidian-900 px-4 py-1.5 rounded-full border border-gold-400/30 inline-block">
            {certificate.sealText}
          </span>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-200 hover:text-white hover:bg-gold-400/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ نص الشهادة 📋</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs sm:text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>إغلاق 💖</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const KeepsakeCertificate: React.FC<KeepsakeCertificateProps> = (props) => {
  return <KeepsakeCertificateCard {...props} />;
};

export default KeepsakeCertificate;
