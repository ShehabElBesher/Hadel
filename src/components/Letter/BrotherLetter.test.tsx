import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrotherLetter } from './BrotherLetter';
import { brotherMessage } from '../../data/brotherMessage';
import { audioEngine } from '../../services/audioEngine';

describe('Milestone 4: BrotherLetter Component Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section container with id brother-letter, royal header, and subtitle', () => {
    const { container } = render(<BrotherLetter />);
    const section = container.querySelector('#brother-letter');
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole('heading', { name: /رسالة من القلب إلى القلب/ });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(/كلمات من أخ فخور بكِ وبكل تفاصيلك الجميلة/)).toBeInTheDocument();
  });

  it('renders sealed envelope initially with monogram هـ and breaks seal on click', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playWaxSealBreakSFX');
    render(<BrotherLetter />);

    // Monogram "هـ" is visible on the wax seal / watermark
    const monograms = screen.getAllByText('هـ');
    expect(monograms.length).toBeGreaterThanOrEqual(1);

    // Wax seal button
    const waxSeal = screen.getByRole('button', { name: /ختم الشمع الملكي/ });
    expect(waxSeal).toBeInTheDocument();

    fireEvent.click(waxSeal);
    expect(sfxSpy).toHaveBeenCalledTimes(1);

    sfxSpy.mockRestore();
  });

  it('displays complete brotherly prose from brotherMessage.ts', () => {
    render(<BrotherLetter />);

    expect(screen.getByText(brotherMessage.salutation)).toBeInTheDocument();

    brotherMessage.paragraphs.forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });

    expect(screen.getByText(brotherMessage.closing)).toBeInTheDocument();
    expect(screen.getByText(brotherMessage.signature)).toBeInTheDocument();
  });

  it('clicking copy button copies full letter text and provides feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<BrotherLetter />);
    const copyBtn = screen.getByRole('button', { name: /نسخ الرسالة/ });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    const copiedText = writeTextMock.mock.calls[0][0];
    expect(copiedText).toContain(brotherMessage.salutation);
    expect(copiedText).toContain(brotherMessage.closing);

    // Feedback message displayed
    await waitFor(() => {
      expect(screen.getByText(/تم نسخ الرسالة بنجاح/)).toBeInTheDocument();
    });
  });

  it('clicking fold envelope button folds envelope back', () => {
    render(<BrotherLetter />);
    const waxSeal = screen.getByRole('button', { name: /ختم الشمع الملكي/ });
    fireEvent.click(waxSeal);

    const foldBtn = screen.getByRole('button', { name: /طي الرسالة/ });
    fireEvent.click(foldBtn);

    // Unseal button is available again
    expect(screen.getByRole('button', { name: /فضّ الختم وقراءة الرسالة/ })).toBeInTheDocument();
  });
});
