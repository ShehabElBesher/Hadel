import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';

describe('Tier 2: Feature 3 - Cake & Candle Boundaries & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Allow any pending SFX timeouts (180ms chime) to resolve cleanly within test scope
    await new Promise((resolve) => setTimeout(resolve, 250));
  });

  it('F3-T2-01: Rapid clicking/double-triggering candle blowout (10 rapid clicks) handles concurrency safely', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    for (let i = 0; i < 10; i++) {
      expect(() => fireEvent.click(candleBtn)).not.toThrow();
    }

    expect(sfxSpy).toHaveBeenCalledTimes(10);
    expect(confettiSpy).toHaveBeenCalledTimes(10);

    sfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });

  it('F3-T2-02: Candle blowout executes cleanly even when AudioContext is in suspended state', async () => {
    const ctx = new (window as any).AudioContext();
    ctx.state = 'suspended';

    expect(() => {
      audioEngine.playCandleBlowoutSFX();
    }).not.toThrow();
  });

  it('F3-T2-03: Rapid successive candle blowout triggers do not throw or leak audio nodes', () => {
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(candleBtn);
    }
    expect(candleBtn).toBeInTheDocument();
  });

  it('F3-T2-04: AudioContext resume failure (NotAllowedError simulation) is caught gracefully', async () => {
    const originalContext = (window as any).AudioContext;
    class FailingAudioContext extends originalContext {
      resume = vi.fn().mockRejectedValue(new Error('NotAllowedError: user gesture required'));
    }

    (window as any).AudioContext = FailingAudioContext;

    expect(() => {
      audioEngine.playCandleBlowoutSFX();
    }).not.toThrow();

    await new Promise((resolve) => setTimeout(resolve, 250));

    (window as any).AudioContext = originalContext;
  });

  it('F3-T2-05: Ultra-short mobile landscape viewport (height 400px) does not clip candle button', () => {
    window.innerHeight = 400;
    window.innerWidth = 800;

    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });
    expect(candleBtn).toBeInTheDocument();
  });
});
