import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';
import { brotherMessage } from '../../data/brotherMessage';
import { keepsakeCertificate } from '../../data/sisterWishes';

describe('Tier 4: Real-World E2E Scenarios (Sister Hadel\'s Celebration Journeys)', () => {
  beforeEach(() => {
    audioEngine.pauseMelody();
    if (audioEngine.isMuted()) {
      audioEngine.toggleMute();
    }
    audioEngine.setVolume(0.5);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
  });

  it('SCENARIO-01: Sister Hadel\'s Grand Birthday Tour (Primary Climax Journey)', async () => {
    const candleSfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    const waxSfxSpy = vi.spyOn(audioEngine, 'playWaxSealBreakSFX');
    const giftSfxSpy = vi.spyOn(audioEngine, 'playGiftOpenSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');
    const giftConfettiSpy = vi.spyOn(confettiModule, 'fireGiftOpenConfetti');

    render(<App />);

    // 1. Landing & Royal Greeting
    const heroHeading = screen.getByRole('heading', { level: 2 });
    expect(heroHeading).toHaveTextContent(/كل عام وأنتِ الخير لكل عام يا هديل/);

    // 2. Starting Background Celebration Music
    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    // 3. Adjusting Volume to 75%
    const slider = screen.getByRole('slider', { name: /Volume Slider/i });
    fireEvent.change(slider, { target: { value: '0.75' } });
    expect(audioEngine.getVolume()).toBe(0.75);

    // 4. Memory Lane Exploration (All 8 Photos)
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);
    const photos = screen.getAllByRole('img');
    expect(photos).toHaveLength(8);

    // 5. Virtual Cake Candle Blowout
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });
    fireEvent.click(candleBtn);
    expect(candleSfxSpy).toHaveBeenCalledTimes(1);
    expect(confettiSpy).toHaveBeenCalledTimes(1);

    // 6. Brother's Heartfelt Letter & Wax Seal
    const waxBtn = screen.getByRole('button', { name: /كسر ختم الشمع/ });
    fireEvent.click(waxBtn);
    expect(waxSfxSpy).toHaveBeenCalledTimes(1);

    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);
    expect(screen.getByText(brotherMessage.salutation)).toBeInTheDocument();
    expect(screen.getByText(brotherMessage.closing)).toBeInTheDocument();

    // 7. Sister Reasons & Keepsake Certificate
    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    fireEvent.click(reasonsTabBtn);
    expect(screen.getByText(keepsakeCertificate.title)).toBeInTheDocument();
    expect(screen.getByText(/الممنوح لها:\s*هديل/)).toBeInTheDocument();

    // 8. Opening Surprise Gift Box
    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });
    fireEvent.click(giftBtn);
    expect(giftSfxSpy).toHaveBeenCalledTimes(1);
    expect(giftConfettiSpy).toHaveBeenCalledTimes(1);

    // Music is still playing peacefully in the background!
    expect(audioEngine.isPlaying()).toBe(true);

    candleSfxSpy.mockRestore();
    waxSfxSpy.mockRestore();
    giftSfxSpy.mockRestore();
    confettiSpy.mockRestore();
    giftConfettiSpy.mockRestore();
  });

  it('SCENARIO-02: Mobile Safari / iOS Strict Autoplay & Touch Journey', async () => {
    // Set mobile viewport (iPhone 13 dimensions: 375x812)
    window.innerWidth = 375;
    window.innerHeight = 812;

    render(<App />);

    // Autoplay policy: starts paused
    expect(audioEngine.isPlaying()).toBe(false);

    // First user gesture triggers audio playback
    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    // Navigating tabs with mobile viewport
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);
    expect(screen.getAllByRole('img')).toHaveLength(8);

    // Mute toggle on mobile
    const muteBtn = screen.getByRole('button', { name: /Toggle Mute/i });
    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(true);

    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(false);
  });

  it('SCENARIO-03: Quick Explorer & Non-Linear Jump Journey', () => {
    render(<App />);

    // Direct jump straight to brother's message first
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    fireEvent.click(messageTabBtn);
    expect(screen.getByText(brotherMessage.salutation)).toBeInTheDocument();

    // Crack wax seal
    const waxBtn = screen.getByRole('button', { name: /كسر ختم الشمع/ });
    expect(() => fireEvent.click(waxBtn)).not.toThrow();

    // Jump to photos tab
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);
    expect(screen.getAllByRole('img')).toHaveLength(8);

    // Return to overview tab
    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });
    fireEvent.click(overviewTabBtn);
    expect(screen.getByText(/365/)).toBeInTheDocument();
  });

  it('SCENARIO-04: Replay & Family Sharing Celebration Cycle', () => {
    const candleSfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');

    render(<App />);

    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    // Round 1
    fireEvent.click(candleBtn);
    expect(candleSfxSpy).toHaveBeenCalledTimes(1);
    expect(confettiSpy).toHaveBeenCalledTimes(1);

    // Round 2 (showing mother)
    fireEvent.click(candleBtn);
    expect(candleSfxSpy).toHaveBeenCalledTimes(2);
    expect(confettiSpy).toHaveBeenCalledTimes(2);

    // Round 3 (showing brother)
    fireEvent.click(candleBtn);
    expect(candleSfxSpy).toHaveBeenCalledTimes(3);
    expect(confettiSpy).toHaveBeenCalledTimes(3);

    // Mute while talking, then unmute
    const muteBtn = screen.getByRole('button', { name: /Toggle Mute/i });
    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(true);
    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(false);

    candleSfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });
});
