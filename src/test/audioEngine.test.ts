import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioEngine } from '../services/audioEngine';
import { photosData } from '../data/photosData';
import { brotherMessage } from '../data/brotherMessage';
import { sisterReasons, milestoneCounters, keepsakeCertificate } from '../data/sisterWishes';

describe('Procedural Audio Engine', () => {
  beforeEach(() => {
    audioEngine.pauseMelody();
    if (audioEngine.isMuted()) {
      audioEngine.toggleMute();
    }
    audioEngine.setVolume(0.5);
  });

  it('initializes with default state', () => {
    expect(audioEngine.isPlaying()).toBe(false);
    expect(audioEngine.isMuted()).toBe(false);
    expect(audioEngine.getVolume()).toBe(0.5);
  });

  it('allows adjusting volume within [0, 1] range', () => {
    audioEngine.setVolume(0.8);
    expect(audioEngine.getVolume()).toBe(0.8);

    audioEngine.setVolume(1.5); // clamps to 1.0
    expect(audioEngine.getVolume()).toBe(1.0);

    audioEngine.setVolume(-0.2); // clamps to 0.0
    expect(audioEngine.getVolume()).toBe(0.0);
  });

  it('toggles mute state correctly', () => {
    const isMutedNow = audioEngine.toggleMute();
    expect(isMutedNow).toBe(true);
    expect(audioEngine.isMuted()).toBe(true);

    const isUnmutedNow = audioEngine.toggleMute();
    expect(isUnmutedNow).toBe(false);
    expect(audioEngine.isMuted()).toBe(false);
  });

  it('supports subscription notifications on state changes', () => {
    const listener = vi.fn();
    const unsubscribe = audioEngine.subscribe(listener);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        isPlaying: false,
        isMuted: false,
        volume: 0.5,
      })
    );

    audioEngine.setVolume(0.75);
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        volume: 0.75,
      })
    );

    unsubscribe();
    audioEngine.setVolume(0.3);
    // Listener not called after unsubscription
    expect(listener).not.toHaveBeenLastCalledWith(
      expect.objectContaining({
        volume: 0.3,
      })
    );
  });

  it('triggers sound effects without throwing errors', () => {
    expect(() => audioEngine.playCandleBlowoutSFX()).not.toThrow();
    expect(() => audioEngine.playWaxSealBreakSFX()).not.toThrow();
    expect(() => audioEngine.playConfettiFanfareSFX()).not.toThrow();
    expect(() => audioEngine.playBalloonPopSFX()).not.toThrow();
    expect(() => audioEngine.playGiftOpenSFX()).not.toThrow();
  });

  it('does not start playback when pauseMelody is called while init is resolving (race condition protection)', async () => {
    audioEngine.playMelody();
    audioEngine.pauseMelody();
    // Wait for any microtasks and init promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(audioEngine.isPlaying()).toBe(false);
  });
});

describe('Photo and Narrative Data Integrity', () => {
  it('contains all 8 curated photos', () => {
    expect(photosData).toHaveLength(8);
  });

  it('includes the orientation-corrected photo IMG_20200402_185317.jpg', () => {
    const photo185317 = photosData.find((p) => p.originalFilename === 'IMG_20200402_185317.jpg');
    expect(photo185317).toBeDefined();
    expect(photo185317?.webPath).toBe('/photos/IMG_20200402_185317.jpg');
    expect(photo185317?.title).toContain('عطر العائلة');
  });

  it('has valid titles, date badges, and poetic Arabic captions for all photos', () => {
    photosData.forEach((photo) => {
      expect(photo.id).toBeTruthy();
      expect(photo.title).toBeTruthy();
      expect(photo.caption).toBeTruthy();
      expect(photo.dateBadge).toBeTruthy();
      expect(photo.webPath).toMatch(/^\/photos\/.+\.jpg$/);
      expect(photo.aspectRatio).toBe('3/4');
    });
  });

  it('contains heartfelt brother letter addressed to Hadel', () => {
    expect(brotherMessage.recipient).toBe('هديل');
    expect(brotherMessage.salutation).toContain('هديل');
    expect(brotherMessage.paragraphs.length).toBeGreaterThanOrEqual(4);
    expect(brotherMessage.closing).toContain('هديل');
  });

  it('contains sister reasons, counters, and certificate', () => {
    expect(sisterReasons.length).toBeGreaterThanOrEqual(4);
    expect(milestoneCounters.length).toBe(4);
    expect(keepsakeCertificate.recipientName).toBe('هديل');
  });
});
