import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';

describe('Tier 1: Feature 3 - Virtual Birthday Cake & Interactive Candle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
  });

  it('F3-T1-01: Renders candle blowout interaction trigger button with flame icon', () => {
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });
    expect(candleBtn).toBeInTheDocument();
    expect(candleBtn.textContent).toContain('Air + Chime');
  });

  it('F3-T1-02: Clicking candle blowout triggers audioEngine.playCandleBlowoutSFX()', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    fireEvent.click(candleBtn);
    expect(sfxSpy).toHaveBeenCalledTimes(1);
    sfxSpy.mockRestore();
  });

  it('F3-T1-03: Clicking candle blowout triggers celebratory confetti blast', () => {
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    fireEvent.click(candleBtn);
    expect(confettiSpy).toHaveBeenCalledTimes(1);
    confettiSpy.mockRestore();
  });

  it('F3-T1-04: Audio engine generates procedural filtered noise and chime without errors', () => {
    expect(() => {
      audioEngine.playCandleBlowoutSFX();
    }).not.toThrow();
  });

  it('F3-T1-05: Successive candle blowout triggers execute repeatedly without state corruption', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    fireEvent.click(candleBtn);
    fireEvent.click(candleBtn);
    fireEvent.click(candleBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(3);
    expect(confettiSpy).toHaveBeenCalledTimes(3);

    sfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });
});
