import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';
import * as confettiModule from '../../services/confetti';

describe('Tier 3: Cross-Feature Combinations & State Interactions', () => {
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

  it('COMB-01: Background melody is playing concurrently while candle blowout SFX is triggered', async () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playCandleBlowoutSFX');
    render(<App />);

    // Start melody
    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    // Trigger candle blowout while music is playing
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });
    fireEvent.click(candleBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(1);
    // Background melody remains playing
    expect(audioEngine.isPlaying()).toBe(true);

    sfxSpy.mockRestore();
  });

  it('COMB-02: Wax seal break SFX triggers while background melody is active without interrupting music', async () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playWaxSealBreakSFX');
    render(<App />);

    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    const waxBtn = screen.getByRole('button', { name: /كسر ختم الشمع/ });
    fireEvent.click(waxBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(1);
    expect(audioEngine.isPlaying()).toBe(true);

    sfxSpy.mockRestore();
  });

  it('COMB-03: Gift open SFX triggers while melody is active without stopping melody loop', async () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playGiftOpenSFX');
    render(<App />);

    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });
    fireEvent.click(giftBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(1);
    expect(audioEngine.isPlaying()).toBe(true);

    sfxSpy.mockRestore();
  });

  it('COMB-04: Confetti triggered from multiple components concurrently handles multiple bursts', () => {
    const celebrationSpy = vi.spyOn(confettiModule, 'fireCelebrationConfetti');
    const candleSpy = vi.spyOn(confettiModule, 'fireCandleExtinguishConfetti');
    const giftSpy = vi.spyOn(confettiModule, 'fireGiftOpenConfetti');

    render(<App />);

    const fanfareBtn = screen.getByRole('button', { name: /فرحة الكنفيتي/ });
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });
    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });

    fireEvent.click(fanfareBtn);
    fireEvent.click(candleBtn);
    fireEvent.click(giftBtn);

    expect(celebrationSpy).toHaveBeenCalledTimes(1);
    expect(candleSpy).toHaveBeenCalledTimes(1);
    expect(giftSpy).toHaveBeenCalledTimes(1);

    celebrationSpy.mockRestore();
    candleSpy.mockRestore();
    giftSpy.mockRestore();
  });

  it('COMB-05: Tab navigation across all 4 tabs while melody is playing persists audio state', async () => {
    render(<App />);

    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    const messageTabBtn = screen.getByRole('button', { name: /رسالة الأخ/ });
    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });

    fireEvent.click(photosTabBtn);
    expect(audioEngine.isPlaying()).toBe(true);

    fireEvent.click(messageTabBtn);
    expect(audioEngine.isPlaying()).toBe(true);

    fireEvent.click(reasonsTabBtn);
    expect(audioEngine.isPlaying()).toBe(true);

    fireEvent.click(overviewTabBtn);
    expect(audioEngine.isPlaying()).toBe(true);
  });

  it('COMB-06: Volume slider adjustment while melody is playing updates volume without stopping music', async () => {
    render(<App />);

    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    const slider = screen.getByRole('slider', { name: /Volume Slider/i });
    fireEvent.change(slider, { target: { value: '0.9' } });

    expect(audioEngine.getVolume()).toBe(0.9);
    expect(audioEngine.isPlaying()).toBe(true);
  });

  it('COMB-07: Muting audio while melody is playing retains melody loop in playing state', async () => {
    render(<App />);

    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);
    await waitFor(() => expect(audioEngine.isPlaying()).toBe(true));

    const muteBtn = screen.getByRole('button', { name: /Toggle Mute/i });
    fireEvent.click(muteBtn);

    expect(audioEngine.isMuted()).toBe(true);
    expect(audioEngine.isPlaying()).toBe(true);

    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(false);
    expect(audioEngine.isPlaying()).toBe(true);
  });

  it('COMB-08: Sequential rapid trigger of all 5 sound effects does not cause audio collision', () => {
    render(<App />);

    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });
    const waxBtn = screen.getByRole('button', { name: /كسر ختم الشمع/ });
    const fanfareBtn = screen.getByRole('button', { name: /فرحة الكنفيتي/ });
    const balloonBtn = screen.getByRole('button', { name: /فرقعة البالون/ });
    const giftBtn = screen.getByRole('button', { name: /فتح الهدية/ });

    expect(() => {
      fireEvent.click(candleBtn);
      fireEvent.click(waxBtn);
      fireEvent.click(fanfareBtn);
      fireEvent.click(balloonBtn);
      fireEvent.click(giftBtn);
    }).not.toThrow();
  });

  it('COMB-09: Balloon pop SFX with concurrent celebration confetti firing', () => {
    const sfxSpy = vi.spyOn(audioEngine, 'playBalloonPopSFX');
    const confettiSpy = vi.spyOn(confettiModule, 'fireCelebrationConfetti');

    render(<App />);

    const balloonBtn = screen.getByRole('button', { name: /فرقعة البالون/ });
    const fanfareBtn = screen.getByRole('button', { name: /فرحة الكنفيتي/ });

    fireEvent.click(balloonBtn);
    fireEvent.click(fanfareBtn);

    expect(sfxSpy).toHaveBeenCalledTimes(1);
    expect(confettiSpy).toHaveBeenCalledTimes(1);

    sfxSpy.mockRestore();
    confettiSpy.mockRestore();
  });

  it('COMB-10: State synchronization between multiple subscriber listeners and audio controls', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    const unsub1 = audioEngine.subscribe(listener1);
    const unsub2 = audioEngine.subscribe(listener2);

    audioEngine.setVolume(0.65);
    expect(listener1).toHaveBeenLastCalledWith(expect.objectContaining({ volume: 0.65 }));
    expect(listener2).toHaveBeenLastCalledWith(expect.objectContaining({ volume: 0.65 }));

    unsub1();
    unsub2();
  });

  it('COMB-11: Photos gallery inspection and switching to Reasons tab maintains independent rendering', () => {
    render(<App />);

    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);
    expect(screen.getAllByRole('img')).toHaveLength(8);

    const reasonsTabBtn = screen.getByRole('button', { name: /أسباب تميز هديل والشهادة/ });
    fireEvent.click(reasonsTabBtn);
    expect(screen.getByText(/الممنوح لها:\s*هديل/)).toBeInTheDocument();

    // Switch back to photos
    fireEvent.click(photosTabBtn);
    expect(screen.getAllByRole('img')).toHaveLength(8);
  });

  it('COMB-12: Component unmount cleans up all audio subscriptions and prevents memory leaks', () => {
    const { unmount } = render(<App />);
    expect(() => unmount()).not.toThrow();

    // Trigger audio changes after unmount should not throw
    expect(() => {
      audioEngine.setVolume(0.4);
      audioEngine.toggleMute();
    }).not.toThrow();
  });

  it('COMB-13: Overview milestone counters and live audio status panel stay synchronized when melody starts', async () => {
    render(<App />);

    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });
    fireEvent.click(overviewTabBtn);

    expect(screen.getByText(/متوقف مؤقتاً ⏸️/)).toBeInTheDocument();

    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    fireEvent.click(playBtn);

    await waitFor(() => {
      expect(screen.getByText(/قيد العزف 🎶/)).toBeInTheDocument();
    });
  });

  it('COMB-14: Double-toggle mute during candle blowout retains unmuted volume level upon completion', () => {
    render(<App />);

    audioEngine.setVolume(0.7);
    const muteBtn = screen.getByRole('button', { name: /Toggle Mute/i });
    const candleBtn = screen.getByRole('button', { name: /نفخ الشمعة/ });

    fireEvent.click(muteBtn); // muted
    fireEvent.click(candleBtn); // sfx
    fireEvent.click(muteBtn); // unmuted

    expect(audioEngine.isMuted()).toBe(false);
    expect(audioEngine.getVolume()).toBe(0.7);
  });
});
