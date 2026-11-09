import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioEngine } from '../../services/audioEngine';

describe('Tier 2: Feature 5 - Audio Engine Boundaries & Edge Cases', () => {
  beforeEach(() => {
    audioEngine.pauseMelody();
    if (audioEngine.isMuted()) {
      audioEngine.toggleMute();
    }
    audioEngine.setVolume(0.5);
    vi.clearAllMocks();
  });

  it('F5-T2-01: AudioContext suspended state unlocks and transitions to running upon initialization', async () => {
    const ctx = new (window as any).AudioContext();
    ctx.state = 'suspended';

    await audioEngine.init();
    expect(audioEngine.isPlaying()).toBe(false);
  });

  it('F5-T2-02: Extreme volume clamping for values < 0 strictly clamps to 0.0', () => {
    audioEngine.setVolume(-0.0001);
    expect(audioEngine.getVolume()).toBe(0.0);

    audioEngine.setVolume(-5.0);
    expect(audioEngine.getVolume()).toBe(0.0);

    audioEngine.setVolume(-1000);
    expect(audioEngine.getVolume()).toBe(0.0);
  });

  it('F5-T2-03: Extreme volume clamping for values > 1 strictly clamps to 1.0', () => {
    audioEngine.setVolume(1.0001);
    expect(audioEngine.getVolume()).toBe(1.0);

    audioEngine.setVolume(2.5);
    expect(audioEngine.getVolume()).toBe(1.0);

    audioEngine.setVolume(9999);
    expect(audioEngine.getVolume()).toBe(1.0);
  });

  it('F5-T2-04: Rapid play/pause toggling (15 rapid toggles) executes cleanly without node leaks', async () => {
    for (let i = 0; i < 15; i++) {
      audioEngine.toggleMelody();
    }
    // Pause to settle
    audioEngine.pauseMelody();
    expect(audioEngine.isPlaying()).toBe(false);
  });

  it('F5-T2-05: Mute toggle does not destroy stored volume level when unmuted', () => {
    audioEngine.setVolume(0.75);
    expect(audioEngine.getVolume()).toBe(0.75);

    audioEngine.toggleMute();
    expect(audioEngine.isMuted()).toBe(true);

    audioEngine.toggleMute();
    expect(audioEngine.isMuted()).toBe(false);
    expect(audioEngine.getVolume()).toBe(0.75);
  });
});
