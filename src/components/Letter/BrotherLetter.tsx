import React from 'react';
import { Mail } from 'lucide-react';
import { Envelope } from './Envelope';

export const BrotherLetter: React.FC = () => {
  return (
    <section
      id="brother-letter"
      className="space-y-8 scroll-mt-20 py-8 sm:py-12 animate-fade-in"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-semibold backdrop-blur-md">
          <Mail className="w-3.5 h-3.5 text-gold-400" />
          <span>رسالة أخوية خاصة • من شهاب إلى هديل</span>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-amiri font-bold gold-gradient-text">
          رسالة من القلب إلى القلب 💌
        </h3>

        <p className="text-sm sm:text-base text-ivory-lavender leading-relaxed">
          كلمات من أخ فخور بكِ وبكل تفاصيلك الجميلة • أخوكِ شهاب
        </p>
      </div>

      {/* 3D Wax Sealed Luxury Envelope */}
      <div className="px-2 sm:px-4">
        <Envelope />
      </div>
    </section>
  );
};

export default BrotherLetter;
