import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SisterWishes } from './SisterWishes';
import { ReasonCard } from './ReasonCard';
import { MilestoneCounters } from './MilestoneCounters';
import { GiftBox } from './GiftBox';
import {
  KeepsakeCertificateCard,
  KeepsakeCertificateModal,
} from './KeepsakeCertificate';
import { QuickNavBar, NAV_ITEMS } from '../Navigation/QuickNavBar';
import { sisterReasons, milestoneCounters, keepsakeCertificate } from '../../data/sisterWishes';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';

describe('Milestone 5: SisterWishes & QuickNavBar Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SisterWishes Master Component', () => {
    it('M5-01: renders section container with id sister-wishes, royal header, and subtitle', () => {
      render(<SisterWishes />);
      const section = document.getElementById('sister-wishes');
      expect(section).toBeInTheDocument();

      expect(screen.getByText(/أسباب تجعلكِ الأخت الأفضل في الدنيا ✨/)).toBeInTheDocument();
      expect(screen.getByText(/أمنيات ودعوات من القلب للأخت الغالية 💖/)).toBeInTheDocument();
      expect(screen.getByText(/لأنكِ لستِ مجرد أخت، بل أنتِ بهجة البيت ونبض أمانه/)).toBeInTheDocument();
    });

    it('M5-02: renders all 4 celebratory milestone counters with Arabic labels', () => {
      render(<SisterWishes />);
      milestoneCounters.forEach((counter) => {
        expect(screen.getByText(counter.number)).toBeInTheDocument();
        expect(screen.getByText(counter.label)).toBeInTheDocument();
        expect(screen.getByText(counter.sublabel)).toBeInTheDocument();
      });
    });

    it('M5-03: renders all 6 reason cards with badges, titles, and descriptions', () => {
      render(<SisterWishes />);
      expect(sisterReasons).toHaveLength(6);
      sisterReasons.forEach((reason) => {
        expect(screen.getByText(reason.title)).toBeInTheDocument();
        expect(screen.getByText(reason.badge)).toBeInTheDocument();
        expect(screen.getByText(reason.description)).toBeInTheDocument();
      });
    });

    it('M5-04: renders keepsake certificate card inline with all metadata and declaration', () => {
      render(<SisterWishes />);
      expect(screen.getByText(keepsakeCertificate.title)).toBeInTheDocument();
      expect(screen.getByText(keepsakeCertificate.subtitle)).toBeInTheDocument();
      expect(screen.getByText(keepsakeCertificate.declaration)).toBeInTheDocument();
      expect(screen.getByText(/الممنوح لها:\s*هديل/)).toBeInTheDocument();
      expect(screen.getByText(keepsakeCertificate.sealText)).toBeInTheDocument();
    });

    it('M5-05: opening the surprise gift box triggers sound FX, confetti, and opens certificate modal', () => {
      const sfxSpy = vi.spyOn(audioEngine, 'playGiftOpenSFX');
      const confettiSpy = vi.spyOn(confettiModule, 'fireGiftOpenConfetti');

      render(<SisterWishes />);

      // Certificate modal is initially not in DOM
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Click gift box open button
      const openGiftBtn = screen.getByRole('button', { name: /افتحي صندوق المفاجأة/ });
      fireEvent.click(openGiftBtn);

      expect(sfxSpy).toHaveBeenCalledTimes(1);
      expect(confettiSpy).toHaveBeenCalledTimes(1);

      // Certificate modal dialog is now open
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByText(/شهادة فخر ومحبة: أروع وأغلى أخت لعام 2026 👑/)).toBeInTheDocument();

      sfxSpy.mockRestore();
      confettiSpy.mockRestore();
    });

    it('M5-06: closing keepsake certificate modal via close button removes modal from DOM', () => {
      render(<SisterWishes />);

      const openGiftBtn = screen.getByRole('button', { name: /افتحي صندوق المفاجأة/ });
      fireEvent.click(openGiftBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click close button inside modal
      const closeBtn = screen.getByRole('button', { name: /إغلاق الشهادة/ });
      fireEvent.click(closeBtn);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('M5-07: closing keepsake certificate modal via Escape key removes modal from DOM', () => {
      render(<SisterWishes />);

      const openGiftBtn = screen.getByRole('button', { name: /افتحي صندوق المفاجأة/ });
      fireEvent.click(openGiftBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('ReasonCard Component', () => {
    it('M5-08: heart reaction button increments like counter and triggers heart animation', () => {
      render(<ReasonCard reason={sisterReasons[0]} index={0} />);
      const heartBtn = screen.getByRole('button', { name: new RegExp(`تفاعل محبة لـ ${sisterReasons[0].title}`) });
      expect(heartBtn).toHaveTextContent('10');

      fireEvent.click(heartBtn);
      expect(heartBtn).toHaveTextContent('11');

      fireEvent.click(heartBtn);
      expect(heartBtn).toHaveTextContent('12');
    });
  });

  describe('GiftBox Component', () => {
    it('M5-09: supports keyboard navigation (Enter key opens gift box)', () => {
      const onOpenMock = vi.fn();
      render(<GiftBox onOpenCertificate={onOpenMock} />);

      const box = screen.getByRole('button', { name: /افتحي صندوق المفاجأة/ });
      fireEvent.keyDown(box, { key: 'Enter' });

      expect(onOpenMock).toHaveBeenCalledTimes(1);
    });

    it('M5-10: reset button allows re-tying and closing the gift box', () => {
      render(<GiftBox />);
      const box = screen.getByRole('button', { name: /افتحي صندوق المفاجأة/ });
      fireEvent.click(box);

      expect(screen.getByText(/مرات فتح المفاجأة والاحتفال:\s*1/)).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: /إعادة إغلاق الصندوق/ });
      fireEvent.click(resetBtn);

      expect(screen.getByRole('button', { name: /افتحي صندوق المفاجأة/ })).toBeInTheDocument();
    });
  });

  describe('KeepsakeCertificateCard & Modal Components', () => {
    it('M5-11: copy certificate button copies text to clipboard and gives feedback', async () => {
      render(<KeepsakeCertificateCard />);
      const copyBtn = screen.getByRole('button', { name: /نسخ نص الشهادة/ });
      fireEvent.click(copyBtn);

      expect(await screen.findByText(/تم نسخ نص الشهادة!/)).toBeInTheDocument();
    });

    it('M5-12: modal copy button copies text and displays feedback', async () => {
      render(<KeepsakeCertificateModal isOpen={true} onClose={() => {}} />);
      const modalCopyBtn = screen.getByRole('button', { name: /نسخ نص الشهادة/ });
      fireEvent.click(modalCopyBtn);

      expect(await screen.findByText(/تم النسخ بنجاح!/)).toBeInTheDocument();
    });
  });

  describe('QuickNavBar Component', () => {
    it('M5-13: renders all 5 quick navigation buttons with Arabic labels and icons', () => {
      render(<QuickNavBar activeSection="hero" onNavigate={() => {}} />);
      const nav = screen.getByRole('navigation', { name: /شريط التنقل السريع/ });
      expect(nav).toBeInTheDocument();

      NAV_ITEMS.forEach((item) => {
        expect(screen.getByRole('button', { name: item.label })).toBeInTheDocument();
      });
    });

    it('M5-14: highlights active section correctly with aria-current="page"', () => {
      const { rerender } = render(<QuickNavBar activeSection="hero" onNavigate={() => {}} />);
      const heroBtn = screen.getByRole('button', { name: 'الرئيسية' });
      expect(heroBtn).toHaveAttribute('aria-current', 'page');

      rerender(<QuickNavBar activeSection="sister-wishes" onNavigate={() => {}} />);
      const wishesBtn = screen.getByRole('button', { name: 'أمنيات وهدية' });
      expect(wishesBtn).toHaveAttribute('aria-current', 'page');
      expect(heroBtn).not.toHaveAttribute('aria-current');
    });

    it('M5-15: clicking a navigation item calls onNavigate with matching section id', () => {
      const onNavigateMock = vi.fn();
      render(<QuickNavBar activeSection="hero" onNavigate={onNavigateMock} />);

      fireEvent.click(screen.getByRole('button', { name: 'كعكة الميلاد' }));
      expect(onNavigateMock).toHaveBeenCalledWith('birthday-cake');

      fireEvent.click(screen.getByRole('button', { name: 'شريط الذكريات' }));
      expect(onNavigateMock).toHaveBeenCalledWith('memory-lane');

      fireEvent.click(screen.getByRole('button', { name: 'رسالة أخوية' }));
      expect(onNavigateMock).toHaveBeenCalledWith('brother-letter');

      fireEvent.click(screen.getByRole('button', { name: 'أمنيات وهدية' }));
      expect(onNavigateMock).toHaveBeenCalledWith('sister-wishes');
    });
  });
});
