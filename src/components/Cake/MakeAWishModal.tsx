import React, { useState, useEffect } from 'react';
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wish-modal-title"
    >
      <div
        className="glass-panel border-2 border-gold-400/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-glow-gold relative bg-obsidian-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-obsidian-800 border border-gold-400/30 flex items-center justify-center text-ivory-lavender hover:text-gold-300 hover:border-gold-400/60 transition-colors cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Decorative Badge */}
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gold-400/10 border-2 border-gold-400/40 flex items-center justify-center text-gold-400 shadow-glow-gold">
            <Crown className="w-7 h-7" />
          </div>
        </div>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <h3
                id="wish-modal-title"
                className="text-2xl sm:text-3xl font-amiri font-bold gold-gradient-text"
              >
                تمنّي أمنية يا هديل ✨
              </h3>
              <p className="text-xs sm:text-sm text-ivory-lavender leading-relaxed max-w-md mx-auto">
                أغمضي عينيكِ يا أختي الغالية، استودعي الله أمنياتك في هذا العام الجديد، وثقي أن دعوات أخيكِ ترافقكِ وتحرسكِ دائماً في كل خطوة.
              </p>
            </div>

            {/* Premade Wish Tags / Chips */}
            <div className="space-y-2">
              <span className="text-xs text-gold-300 font-semibold block text-center sm:text-right">
                أمنيات ودعوات مقترحة من القلب (انقري للإضافة):
              </span>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {PREMADE_WISHES.map((wish, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPremade(wish)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gold-400/10 border border-gold-400/25 text-gold-200 hover:bg-gold-400/20 hover:text-white transition-all duration-200 text-right cursor-pointer"
                  >
                    + {wish}
                  </button>
                ))}
              </div>
            </div>

            {/* Wish Input Form */}
            <form onSubmit={handleSubmitWish} className="space-y-4">
              <div className="relative">
                <textarea
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="اكتبي أمنيتك الخاصة أو دعواتك لهذا العام من أعماق قلبكِ..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-obsidian-850 border border-gold-400/30 text-ivory text-sm placeholder-ivory-lavender/50 focus:outline-hidden focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>سجّلي أمنيتك ✨</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto py-3 px-5 rounded-full glass-panel text-xs text-ivory-lavender hover:text-gold-200 transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Wish Submitted Confirmation Screen */
          <div className="text-center space-y-5 animate-fade-in py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-amiri font-bold gold-gradient-text">
                حُفظت أمنيتك في القلب يا هديل 🤍
              </h4>
              <p className="text-sm text-ivory-muted leading-relaxed max-w-md mx-auto">
                عسى الله أن يستجيب لدعواتكِ ويحقق لكِ أضعاف ما تتمنين، وأن يجعل كل أيامكِ نوراً وسروراً وتوفيقاً لا ينقطع.
              </p>
            </div>

            {wishText && (
              <div className="p-4 rounded-2xl bg-obsidian-850 border border-gold-400/30 text-sm text-gold-200 italic font-amiri leading-relaxed max-h-36 overflow-y-auto">
                &ldquo;{wishText}&rdquo;
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleResetAndRelight}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs shadow-glow-gold hover:scale-105 transition-all cursor-pointer"
              >
                إشعال الشمعة مجدداً 🕯️
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full glass-panel text-xs text-ivory-lavender hover:text-white transition-colors cursor-pointer"
              >
                تم، شكراً لك 🤍
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeAWishModal;
