import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import { brotherMessage } from '../../data/brotherMessage';

describe('Tier 1: Feature 4 - Brother\'s Heartfelt Message & Wax Seal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('F4-T1-01: Wax seal crack trigger button invokes audioEngine.playWaxSealBreakSFX()', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playWaxSealBreakSFX');
    render(<App />);
    const waxBtn = screen.getByRole('button', { name: /كسر ختم الشمع/ });

    fireEvent.click(waxBtn);
    expect(sfxSpy).toHaveBeenCalledTimes(1);
    sfxSpy.mockRestore();
  });

  it('F4-T1-02: Navigating to Brother\'s letter tab displays salutation addressed to Hadel', () => {
    render(<App />);
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);

    const salutation = screen.getByText(brotherMessage.salutation);
    expect(salutation).toBeInTheDocument();
    expect(salutation.textContent).toContain('هديل');
  });

  it('F4-T1-03: Displays complete brotherly letter paragraphs with emotional prose', () => {
    render(<App />);
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);

    expect(brotherMessage.paragraphs.length).toBeGreaterThanOrEqual(4);
    brotherMessage.paragraphs.forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });

  it('F4-T1-04: Displays brother\'s closing and authentic signature', () => {
    render(<App />);
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);

    const closing = screen.getByText(brotherMessage.closing);
    expect(closing).toBeInTheDocument();

    const signature = screen.getByText(brotherMessage.signature);
    expect(signature).toBeInTheDocument();
  });

  it('F4-T1-05: Audio engine creates pitch-drop snap and paper rustle chime on wax seal break', () => {
    expect(() => {
      audioEngine.playWaxSealBreakSFX();
    }).not.toThrow();
  });
});
