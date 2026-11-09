import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BirthdayCake } from './BirthdayCake';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';

describe('Milestone 4: BirthdayCake Component Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section container with id birthday-cake and royal header', () => {
    const { container } = render(<BirthdayCake />);
    const section = container.querySelector('#birthday-cake');
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/كعكة يوم الميلاد الافتراضية/);
    expect(screen.getByText(/انقري على شعلة الشمعة لإطفائها/)).toBeInTheDocument();
  });

  it('clicking candle flame extinguishes candle, plays SFX, fires confetti, and opens wish modal', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');

    render(<BirthdayCake />);
    const candle = screen.getByRole('button', { name: /إطفاء شعلة الشمعة/ });
    fireEvent.click(candle);

    expect(sfxSpy).toHaveBeenCalledTimes(1);
    expect(confettiSpy).toHaveBeenCalledTimes(1);

    // Make a Wish modal is displayed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/تمنّي أمنية يا هديل/)).toBeInTheDocument();

    sfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });

  it('clicking the blowout ceremony button also triggers blowout', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');

    render(<BirthdayCake />);
    const blowoutBtn = screen.getByRole('button', { name: /إطفاء شمعة الميلاد والتمني/ });
    fireEvent.click(blowoutBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(1);
    expect(confettiSpy).toHaveBeenCalledTimes(1);

    sfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });

  it('allows relighting candle after it has been extinguished', () => {
    render(<BirthdayCake />);
    const blowoutBtn = screen.getByRole('button', { name: /إطفاء شمعة الميلاد والتمني/ });
    fireEvent.click(blowoutBtn);

    // Close modal first
    const closeBtn = screen.getByRole('button', { name: /إغلاق النافذة/ });
    fireEvent.click(closeBtn);

    // Relight button is now visible
    const relightBtn = screen.getByRole('button', { name: /إشعال الشمعة مجدداً/ });
    expect(relightBtn).toBeInTheDocument();

    fireEvent.click(relightBtn);

    // Blowout button is restored
    expect(screen.getByRole('button', { name: /إطفاء شمعة الميلاد والتمني/ })).toBeInTheDocument();
  });

  it('MakeAWishModal allows typing custom wish, selecting chip, and submitting', () => {
    const fanfareSpy = vi.spyOn(audioEngine, 'playConfettiFanfareSFX');
    const celebrationSpy = vi.spyOn(confettiModule, 'fireCelebrationConfetti');

    render(<BirthdayCake />);
    const blowoutBtn = screen.getByRole('button', { name: /إطفاء شمعة الميلاد والتمني/ });
    fireEvent.click(blowoutBtn);

    // Click premade suggestion chip
    const chipBtn = screen.getByRole('button', { name: /صحة وعافية وسعادة أبدية/ });
    fireEvent.click(chipBtn);

    // Type in textarea
    const textarea = screen.getByPlaceholderText(/اكتبي أمنيتك الخاصة/);
    fireEvent.change(textarea, { target: { value: 'أتمنى عاماً مليئاً بالخير والتوفيق' } });

    // Submit wish
    const submitBtn = screen.getByRole('button', { name: /سجّلي أمنيتك/ });
    fireEvent.click(submitBtn);

    expect(fanfareSpy).toHaveBeenCalledTimes(1);
    expect(celebrationSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/حُفظت أمنيتك في القلب يا هديل/)).toBeInTheDocument();

    fanfareSpy.mockRestore();
    celebrationSpy.mockRestore();
  });
});
