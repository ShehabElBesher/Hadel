import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';
import { sisterReasons, milestoneCounters, keepsakeCertificate } from '../../data/sisterWishes';

describe('Tier 1: Feature 6 - Wishes, Milestone Counters & Surprise Gift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('F6-T1-01: Overview tab renders all 4 milestone counters', () => {
    render(<App />);
    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });
    fireEvent.click(overviewTabBtn);

    milestoneCounters.forEach((counter) => {
      expect(screen.getByText(counter.number)).toBeInTheDocument();
      expect(screen.getByText(counter.label)).toBeInTheDocument();
      expect(screen.getByText(counter.sublabel)).toBeInTheDocument();
    });
  });

  it('F6-T1-02: Reasons tab renders reasons why Hadel is the best sister', () => {
    render(<App />);
    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    fireEvent.click(reasonsTabBtn);

    expect(sisterReasons.length).toBeGreaterThanOrEqual(4);
    sisterReasons.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.badge)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  it('F6-T1-03: Renders keepsake certificate with honorary title and Hadel\'s name', () => {
    render(<App />);
    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    fireEvent.click(reasonsTabBtn);

    expect(screen.getByText(keepsakeCertificate.title)).toBeInTheDocument();
    expect(screen.getByText(keepsakeCertificate.subtitle)).toBeInTheDocument();
    expect(screen.getByText(keepsakeCertificate.declaration)).toBeInTheDocument();
    expect(screen.getByText(/الممنوح لها:\s*هديل/)).toBeInTheDocument();
  });

  it('F6-T1-04: Gift open button invokes audioEngine.playGiftOpenSFX()', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playGiftOpenSFX');
    render(<App />);
    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });

    fireEvent.click(giftBtn);
    expect(sfxSpy).toHaveBeenCalledTimes(1);
    sfxSpy.mockRestore();
  });

  it('F6-T1-05: Gift open triggers golden confetti shower', () => {
    const confettiSpy = vi.spyOn(confettiModule, 'fireGiftOpenConfetti');
    render(<App />);
    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });

    fireEvent.click(giftBtn);
    expect(confettiSpy).toHaveBeenCalledTimes(1);
    confettiSpy.mockRestore();
  });
});
