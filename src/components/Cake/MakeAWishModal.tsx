import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Crown, Send, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import { fireCelebrationConfetti } from '../../services/confetti';

interface MakeAWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelight: () => void;
}

const PREMADE_WISHES = [
  'صحة وعافية وسعادة أبدية لا تفارق قلبكِ 🤍',
  'سنة مليئة بالنجاحات وتحقيق جميع الأحلام 🎓✨',
  'راحة بال وطمأنينة وسلام يغمر روحكِ 🕊️',
  'بركة وفرح وضحكة تدوم في كل أيامكِ 🌟',
  'حياة مشرقة تليق بجمال قلبكِ الأبيض 🌸',
];

export const MakeAWishModal: React.FC<MakeAWishModalProps> = ({
  isOpen,
  onClose,
  onRelight,
}) => {
  const [wishText, setWishText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPremade = (wish: string) => {
    setWishText((prev) => (prev ? `${prev} • ${wish}` : wish));
  };

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    audioEngine.playConfettiFanfareSFX();
    fireCelebrationConfetti();
  };

  const handleResetAndRelight = () => {
    setIsSubmitted(false);
    setWishText('');
    onRelight();
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wish-modal-title"
    >
      <div
        className="glass-panel border-2 border-gold-400/40 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-glow-gold relative bg-obsidian-900/98 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 w-8 h-8 rounded-full bg-obsidian-800 border border-gold-400/30 flex items-center justify-center text-ivory-lavender hover:text-gold-300 hover:border-gold-400/60 transition-colors cursor-pointer z-20"
          aria-label="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 space-y-3 sm:space-y-4 pr-1 pl-1">
          {/* Top Decorative Badge */}
          <div className="flex items-center justify-center pt-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold-400/10 border-2 border-gold-400/40 flex items-center justify-center text-gold-400 shadow-glow-gold">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center space-y-1">
                <h3
                  id="wish-modal-title"
                  className="text-xl sm:text-2xl font-amiri font-bold gold-gradient-text"
                >
                  تمنّي أمنية يا هديل ✨
                </h3>
                <p className="text-xs text-ivory-lavender leading-relaxed max-w-md mx-auto">
                  أغمضي عينيكِ يا أختي الغالية، استودعي الله أمنياتك، وثقي أن دعوات أخيكِ شهاب ترافقكِ دائماً في كل خطوة.
                </p>
              </div>

              {/* Premade Wish Tags / Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-gold-300 font-semibold block text-center sm:text-right">
                  أمنيات ودعوات مقترحة من القلب (انقري للإضافة):
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {PREMADE_WISHES.map((wish, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPremade(wish)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gold-400/10 border border-gold-400/25 text-gold-200 hover:bg-gold-400/20 hover:text-white transition-all text-right cursor-pointer"
                    >
                      + {wish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wish Input Form */}
              <form id="wish-form" onSubmit={handleSubmitWish} className="space-y-2 pt-1">
                <div className="relative">
                  <textarea
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="اكتبي أمنيتك الخاصة أو دعواتك لهذا العام من أعماق قلبكِ..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-850 border border-gold-400/30 text-ivory text-xs sm:text-sm placeholder-ivory-lavender/50 focus:outline-hidden focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-none transition-all"
                  />
                </div>
              </form>
            </>
          ) : (
            /* Confirmation Screen */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xl font-amiri font-bold gold-gradient-text">
                  حُفظت أمنيتك في القلب يا هديل 🤍
                </h4>
                <p className="text-xs text-ivory-muted leading-relaxed max-w-md mx-auto">
                  عسى الله أن يستجيب لدعواتكِ ويحقق لكِ أضعاف ما تتمنين، ويجعل عامكِ كله فرحاً وسروراً.
                </p>
              </div>
              {wishText && (
                <div className="p-3 rounded-2xl bg-obsidian-850 border border-gold-400/30 text-xs text-gold-200 italic font-amiri leading-relaxed max-h-28 overflow-y-auto">
                  &ldquo;{wishText}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* ALWAYS VISIBLE PINNED BOTTOM ACTION BAR */}
        <div className="pt-3 border-t border-gold-400/25 flex flex-col sm:flex-row items-center gap-2 mt-2">
          {!isSubmitted ? (
            <>
              <button
                type="submit"
                form="wish-form"
                className="w-full sm:flex-1 py-2.5 px-5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs sm:text-sm shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>سجّلي أمنيتك ✨</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-4 rounded-full glass-panel text-xs text-ivory-lavender hover:text-gold-200 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResetAndRelight}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs shadow-glow-gold hover:scale-105 transition-all cursor-pointer"
              >
                إشعال الشمعة مجدداً 🕯️
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full glass-panel text-xs text-ivory-lavender hover:text-white transition-colors cursor-pointer"
              >
                تم، شكراً لك 🤍
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default MakeAWishModal;
