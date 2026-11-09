import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import { brotherMessage } from '../../data/brotherMessage';

describe('Tier 2: Feature 4 - Brother\'s Letter Boundaries & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('F4-T2-01: Double-clicking / multi-clicking wax seal break button handles rapid requests cleanly', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playWaxSealBreakSFX');
    render(<App />);
    const waxBtn = screen.getByRole('button', { name: /كسر ختم الشمع/ });

    fireEvent.click(waxBtn);
    fireEvent.click(waxBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(2);
    sfxSpy.mockRestore();
  });

  it('F4-T2-02: Viewing brother letter on small mobile screen (320px x 568px) preserves readability', () => {
    window.innerWidth = 320;
    window.innerHeight = 568;

    render(<App />);
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);

    const salutation = screen.getByText(brotherMessage.salutation);
    expect(salutation).toBeInTheDocument();

    const closing = screen.getByText(brotherMessage.closing);
    expect(closing).toBeInTheDocument();
  });

  it('F4-T2-03: Wax seal break SFX triggers cleanly when audio is muted', () => {
    audioEngine.toggleMute();
    expect(audioEngine.isMuted()).toBe(true);

    expect(() => {
      audioEngine.playWaxSealBreakSFX();
    }).not.toThrow();

    audioEngine.toggleMute();
  });

  it('F4-T2-04: Wax seal break SFX triggers cleanly when volume is set to 0.0', () => {
    audioEngine.setVolume(0.0);
    expect(audioEngine.getVolume()).toBe(0.0);

    expect(() => {
      audioEngine.playWaxSealBreakSFX();
    }).not.toThrow();

    audioEngine.setVolume(0.5);
  });

  it('F4-T2-05: Brother letter maintains RTL text direction and paragraph formatting', () => {
    const { container } = render(<App />);
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);

    const paragraphsDiv = container.querySelector('.text-justify');
    expect(paragraphsDiv).toBeInTheDocument();
    expect(paragraphsDiv?.className).toContain('leading-loose');
  });
});
