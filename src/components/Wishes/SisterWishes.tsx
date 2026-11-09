import React, { useState } from 'react';
import { Sparkles, Heart, Award, Crown } from 'lucide-react';
import { ReasonCard } from './ReasonCard';
import { MilestoneCounters } from './MilestoneCounters';
import { GiftBox } from './GiftBox';
import {
  KeepsakeCertificateCard,
  KeepsakeCertificateModal,
} from './KeepsakeCertificate';
import { sisterReasons } from '../../data/sisterWishes';

export interface SisterWishesProps {
  id?: string;
  className?: string;
}

export const SisterWishes: React.FC<SisterWishesProps> = ({
  id = 'sister-wishes',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <section
      id={id}
      className={`space-y-12 sm:space-y-16 scroll-mt-20 py-8 sm:py-12 animate-fade-in ${className}`}
    >
      {/* Royal Amiri Header Bar */}
      <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>أسباب تجعلكِ الأخت الأفضل في الدنيا ✨</span>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-amiri font-bold gold-gradient-text">
          أمنيات ودعوات من القلب للأخت الغالية 💖
        </h3>

        <p className="text-sm sm:text-base text-ivory-lavender leading-relaxed max-w-2xl mx-auto">
          لأنكِ لستِ مجرد أخت، بل أنتِ بهجة البيت ونبض أمانه، نحتفي بكِ اليوم وبكل اللحظات التي جعلتِ فيها حياتنا أجمل وأبهى.
        </p>
      </div>

      {/* Part 1: Animated Milestone Counters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-sm uppercase tracking-widest text-gold-300 font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-gold-400" />
            <span>محطات المحبة والاعتزاز بالأخت الغالية</span>
          </h4>
          <span className="text-xs text-ivory-lavender">أرقام تنبض بالمحبة</span>
        </div>
        <MilestoneCounters />
      </div>

      {/* Part 2: "Why Hadel is the Best Sister" 6 Reason Cards */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h4 className="text-2xl sm:text-3xl font-amiri font-bold text-gold-200 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-roseGold-400 fill-roseGold-400" />
            <span>ستة أسباب تجعلكِ الأخت الأروع في الكون</span>
          </h4>
          <p className="text-xs sm:text-sm text-ivory-muted">
            كل صفة فيكِ هي قصة محبة ووفاء نعتز بها كل يوم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sisterReasons.map((reason, index) => (
            <ReasonCard key={reason.id} reason={reason} index={index} />
          ))}
        </div>
      </div>

      {/* Part 3: Interactive 3D Surprise Gift Box */}
      <div className="pt-4">
        <GiftBox onOpenCertificate={() => setIsModalOpen(true)} />
      </div>

      {/* Part 4: Honorary Keepsake Certificate Card (Inline) */}
      <div className="space-y-4 pt-6">
        <div className="text-center space-y-2">
          <h4 className="text-2xl sm:text-3xl font-amiri font-bold text-gold-200 flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-gold-400" />
            <span>وثيقة التكريم الأخوية والمحبة الخالدة</span>
          </h4>
          <p className="text-xs sm:text-sm text-ivory-muted">
            وسام فخر واعتزاز دائم بمكانتكِ التي لا يضاهيها أحد
          </p>
        </div>

        <KeepsakeCertificateCard onOpenModal={() => setIsModalOpen(true)} />
      </div>

      {/* Part 5: Fullscreen Accessible Keepsake Certificate Modal */}
      <KeepsakeCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default SisterWishes;
