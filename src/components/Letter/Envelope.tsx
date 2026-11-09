import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Sparkles, MailOpen } from 'lucide-react';
import { WaxSeal } from './WaxSeal';
import { brotherMessage } from '../../data/brotherMessage';
import { audioEngine } from '../../services/audioEngine';

interface EnvelopeProps {
  className?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleBreakSeal = () => {
    audioEngine.playWaxSealBreakSFX();
    setIsOpen(true);
  };

  const handleFoldEnvelope = () => {
    setIsOpen(false);
  };

  const handleCopyLetter = async () => {
    const fullLetter = [
      brotherMessage.salutation,
      '',
      ...brotherMessage.paragraphs,
      '',
      brotherMessage.closing,
      '',
      brotherMessage.signature,
    ].join('\n\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullLetter);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullLetter;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={`relative max-w-3xl mx-auto w-full select-none ${className}`}>
      {/* 3D Envelope Container with Perspective */}
      <div className="relative [perspective:1200px] flex flex-col items-center">
        {/* Envelope Shell Backdrop & Pocket */}
        <div className="relative w-full rounded-3xl glass-panel border border-gold-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-700 bg-obsidian-900/90">
          {/* Top Flap (3D Unfolding Transform) */}
          <div
            className={`w-full h-24 sm:h-32 bg-gradient-to-b from-obsidian-750 to-obsidian-850 border-b-2 border-gold-400/40 relative z-30 transition-transform duration-700 origin-top [transform-style:preserve-3d] flex items-center justify-center ${
              isOpen
                ? '[transform:rotateX(180deg)] shadow-inner opacity-40 pointer-events-none'
                : '[transform:rotateX(0deg)]'
            }`}
          >
            {/* Flap Triangular Cutout Illusion */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,207,117,0.15),_transparent_70%)]" />

            {/* Wax Seal Positioned Centered on the Flap */}
            {!isOpen && (
              <div className="absolute -bottom-8 sm:-bottom-10 z-40">
                <WaxSeal isBroken={isOpen} onBreak={handleBreakSeal} />
              </div>
            )}
          </div>

          {/* Unsealed Interactive Notice / Open Button (If user hasn't clicked seal yet) */}
          {!isOpen && (
            <div className="pt-14 pb-8 px-6 text-center space-y-4 relative z-20">
              <p className="text-sm sm:text-base text-gold-200 font-amiri font-bold">
                رسالة مغلقة بالشمع الذهبي الممهور بحرف &ldquo;هـ&rdquo; 💌
              </p>
              <button
                type="button"
                onClick={handleBreakSeal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs sm:text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <MailOpen className="w-4 h-4" />
                <span>فضّ الختم وقراءة الرسالة ✉️</span>
              </button>
            </div>
          )}

          {/* Parchment Letter Body Container */}
          <div
            className={`w-full transition-all duration-700 ease-out relative z-20 p-4 sm:p-8 ${
              isOpen
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-90 -translate-y-2'
            }`}
          >
            {/* Parchment Sheet */}
            <article className="relative bg-[#fcfaf5] text-obsidian-950 rounded-2xl p-6 sm:p-10 shadow-2xl border-2 border-gold-400/40 overflow-hidden font-amiri">
              {/* Parchment Luxury Corner Accents */}
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold-500/60 pointer-events-none" />
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold-500/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold-500/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold-500/60 pointer-events-none" />

              {/* Watermark Monogram "هـ" in Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                <span className="text-[240px] font-amiri font-black text-amber-900">هـ</span>
              </div>

              {/* Letter Header & Salutation */}
              <div className="text-center space-y-3 pb-6 border-b border-amber-900/15 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300/60 text-amber-900 text-[11px] font-sans font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>رسالة فخر ومحبة أخوية خاصة</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-amiri font-bold text-amber-950 leading-tight">
                  {brotherMessage.salutation}
                </h3>
              </div>

              {/* Letter Paragraphs (RTL, Justified, Generous Line Height) */}
              <div className="space-y-4 sm:space-y-5 text-base sm:text-lg leading-loose text-stone-900 text-justify pt-6 pb-6 relative z-10">
                {brotherMessage.paragraphs.map((paragraph, index) => (
                  <p key={index} className="indent-6 sm:indent-8 font-amiri">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Letter Closing & Signature */}
              <div className="pt-6 border-t border-amber-900/15 text-center space-y-2 relative z-10">
                <p className="text-lg sm:text-xl font-amiri font-bold text-amber-900">
                  {brotherMessage.closing}
                </p>
                <p className="text-sm sm:text-base font-sans text-stone-700 font-medium pt-1">
                  {brotherMessage.signature}
                </p>
              </div>
            </article>

            {/* Letter Interactive Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 px-2">
              {/* Copy Letter Button */}
              <button
                type="button"
                onClick={handleCopyLetter}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-obsidian-800 border border-gold-400/30 text-xs sm:text-sm text-gold-200 hover:text-white hover:border-gold-400/60 transition-all cursor-pointer shadow-sm"
                aria-label="نسخ الرسالة 📋"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">تم نسخ الرسالة بنجاح 🤍</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gold-400" />
                    <span>نسخ الرسالة 📋</span>
                  </>
                )}
              </button>

              {/* Fold / Re-Seal Envelope Button */}
              <button
                type="button"
                onClick={handleFoldEnvelope}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-obsidian-800 border border-gold-400/30 text-xs sm:text-sm text-ivory-lavender hover:text-gold-200 hover:border-gold-400/60 transition-all cursor-pointer"
                aria-label="طي الرسالة 🔄"
              >
                <RotateCcw className="w-4 h-4" />
                <span>طي الرسالة 🔄</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Envelope;
