import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';
import { sisterReasons, milestoneCounters, keepsakeCertificate } from '../../data/sisterWishes';

describe('Tier 2: Feature 6 - Wishes & Gift Box Boundaries & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('F6-T2-01: Rapid clicking gift open button (10 rapid clicks) handles concurrency without throwing', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playGiftOpenSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireGiftOpenConfetti');
    render(<App />);
    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });

    for (let i = 0; i < 10; i++) {
      expect(() => fireEvent.click(giftBtn)).not.toThrow();
    }

    expect(sfxSpy).toHaveBeenCalledTimes(10);
    expect(confettiSpy).toHaveBeenCalledTimes(10);

    sfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });

  it('F6-T2-02: Milestone counter with infinity symbol "∞" renders cleanly as text', () => {
    render(<App />);
    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });
    fireEvent.click(overviewTabBtn);

    const infinityCounter = milestoneCounters.find((c) => c.number === '∞');
    expect(infinityCounter).toBeDefined();
    expect(screen.getByText('∞')).toBeInTheDocument();
  });

  it('F6-T2-03: Sister reasons cards handle long Arabic descriptions without throwing', () => {
    render(<App />);
    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    fireEvent.click(reasonsTabBtn);

    sisterReasons.forEach((item) => {
      expect(item.description.length).toBeGreaterThan(15);
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  it('F6-T2-04: Keepsake certificate renders all metadata on 320px mobile viewport', () => {
    window.innerWidth = 320;
    render(<App />);
    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    fireEvent.click(reasonsTabBtn);

    expect(screen.getByText(keepsakeCertificate.title)).toBeInTheDocument();
    expect(screen.getByText(keepsakeCertificate.sealText)).toBeInTheDocument();
  });

  it('F6-T2-05: Confetti boundary with edge coordinates does not throw error', () => {
    expect(() => {
      confettiModule.fireBalloonPopConfetti(0, 0);
      confettiModule.fireBalloonPopConfetti(window.innerWidth, window.innerHeight);
      confettiModule.fireBalloonPopConfetti(-50, -50);
      confettiModule.fireCelebrationConfetti();
    }).not.toThrow();
  });
});
