import { AudioEngineState, IAudioEngine } from '../types';

class ProceduralAudioEngine implements IAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private playing = false;
  private shouldPlayMelody = false;
  private muted = false;
  private volumeLevel = 0.5;

  private loopTimeoutId: number | null = null;
  private activeMusicOscillators: OscillatorNode[] = [];
  private listeners: Set<(state: AudioEngineState) => void> = new Set();

  constructor() {
    // Lazy initialized on first user gesture
  }

  public async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volumeLevel, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume was prevented:', err);
      }
    }
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public setVolume(level: number): void {
    const clamped = Math.max(0, Math.min(1, level));
    this.volumeLevel = clamped;
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
    this.notifyListeners();
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.muted ? 0 : this.volumeLevel;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    this.notifyListeners();
    return this.muted;
  }

  public toggleMelody(): boolean {
    if (this.playing || this.shouldPlayMelody) {
      this.pauseMelody();
    } else {
      this.playMelody();
    }
    return this.playing;
  }

  public playMelody(): void {
    this.shouldPlayMelody = true;
    this.init().then(() => {
      if (!this.shouldPlayMelody || !this.ctx) return;
      this.playing = true;
      this.notifyListeners();
      this.stopCurrentMelodyNodes();
      this.scheduleMelodyLoop();
    });
  }

  public pauseMelody(): void {
    this.shouldPlayMelody = false;
    this.playing = false;
    this.stopCurrentMelodyNodes();
    if (this.loopTimeoutId !== null) {
      window.clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }
    this.notifyListeners();
  }

  private stopCurrentMelodyNodes(): void {
    if (this.activeMusicOscillators.length > 0 && this.ctx) {
      this.activeMusicOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Already stopped
        }
      });
      this.activeMusicOscillators = [];
    }
  }

  /**
   * Synthesizes an authentic celesta / music box chime.
   * Uses fundamental sine + 2.756x inharmonic bell ratio + 5.404x high harmonic shimmer.
   */
  private playChimeNote(
    freq: number,
    startTime: number,
    duration = 1.6,
    noteVolume = 0.28,
    isBass = false
  ): void {
    if (!this.ctx || !this.musicGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Inharmonic bell overtone
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * (isBass ? 2.0 : 2.756), startTime);

    // Envelope
    const peakGain = noteVolume * (isBass ? 0.35 : 0.5);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);

    this.activeMusicOscillators.push(osc1, osc2);

    // High shimmer for higher notes
    if (!isBass && freq > 400) {
      const osc3 = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 5.404, startTime);

      shimmerGain.gain.setValueAtTime(peakGain * 0.15, startTime);
      shimmerGain.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.5);

      osc3.connect(shimmerGain);
      shimmerGain.connect(this.musicGain);

      osc3.start(startTime);
      osc3.stop(startTime + 0.55);
      this.activeMusicOscillators.push(osc3);
    }
  }

  /**
   * Complete soothing celesta / music box arrangement of "Happy Birthday" (سنة حلوة يا جميل)
   */
  private scheduleMelodyLoop(): void {
    if (!this.playing || !this.ctx) return;

    const now = this.ctx.currentTime + 0.05;

    // Frequencies (Key of F Major):
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const Bb4 = 466.16;
    const C5 = 523.25;
    const D5 = 587.33;
    const Eb5 = 622.25;
    const F5 = 698.46;

    // Bass notes for gentle music box resonance:
    const F3 = 174.61;
    const Bb3 = 233.08;
    const C4 = 261.63;

    // Sequence: [freq, duration, delaySeconds, isBass]
    const notes: [number, number, number, boolean?][] = [
      // Phrase 1: Happy Birthday to You
      [F4, 0.45, 0.0],
      [F4, 0.45, 0.55],
      [G4, 0.8, 1.05],
      [F4, 0.8, 1.9],
      [Bb4, 0.85, 2.75],
      [A4, 1.8, 3.65],
      [F3, 2.5, 0.0, true], // Gentle bass anchor

      // Phrase 2: Happy Birthday to You
      [F4, 0.45, 5.5],
      [F4, 0.45, 6.05],
      [G4, 0.8, 6.55],
      [F4, 0.8, 7.4],
      [C5, 0.85, 8.25],
      [Bb4, 1.8, 9.15],
      [C4, 2.5, 5.5, true], // Bass anchor

      // Phrase 3: Happy Birthday Dear Hadel
      [F4, 0.45, 11.0],
      [F4, 0.45, 11.55],
      [F5, 0.95, 12.05],
      [D5, 0.8, 13.05],
      [Bb4, 0.8, 13.9],
      [A4, 0.8, 14.75],
      [G4, 1.5, 15.6],
      [Bb3, 2.5, 11.0, true], // Bass anchor

      // Phrase 4: Happy Birthday to You
      [Eb5, 0.45, 17.15],
      [Eb5, 0.45, 17.7],
      [D5, 0.8, 18.2],
      [Bb4, 0.8, 19.05],
      [C5, 0.85, 19.9],
      [Bb4, 2.8, 20.8],
      [F3, 3.2, 17.15, true], // Final gentle bass
    ];

    const totalMelodyDuration = 24.0; // seconds

    notes.forEach(([freq, dur, delay, isBass]) => {
      this.playChimeNote(freq, now + delay, dur + 1.2, isBass ? 0.22 : 0.28, isBass);
    });

    // Clean up finished oscillators
    setTimeout(() => {
      this.activeMusicOscillators = [];
    }, totalMelodyDuration * 1000);

    // Schedule next seamless loop
    this.loopTimeoutId = window.setTimeout(() => {
      if (this.playing) {
        this.scheduleMelodyLoop();
      }
    }, (totalMelodyDuration + 2.0) * 1000);
  }

  // ==========================================
  // PROCEDURAL SOUND EFFECTS (SFX)
  // ==========================================

  /**
   * Candle blowout SFX: Realistic whoosh / air puff + gentle extinguishing chime
   */
  public playCandleBlowoutSFX(): void {
    this.init().then(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      // 1. Noise buffer for gentle breath/puff
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.55);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (this.ctx.sampleRate * 0.16));
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, t);
      filter.frequency.exponentialRampToValueAtTime(160, t + 0.5);

      const breathGain = this.ctx.createGain();
      breathGain.gain.setValueAtTime(0.45, t);
      breathGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);

      noiseSource.connect(filter);
      filter.connect(breathGain);
      breathGain.connect(this.sfxGain);

      noiseSource.start(t);

      // 2. Gentle magical harmonic chime right after extinguish
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const chimeT = this.ctx.currentTime;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(880, chimeT); // A5

        chimeGain.gain.setValueAtTime(0.18, chimeT);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeT + 1.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.sfxGain);

        chimeOsc.start(chimeT);
        chimeOsc.stop(chimeT + 1.25);
      }, 180);
    });
  }

  /**
   * Wax seal break SFX: Crisp snap/crack + unfolding letter chime
   */
  public playWaxSealBreakSFX(): void {
    this.init().then(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      // 1. Crisp wax snap (fast pitch drop)
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();

      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(540, t);
      snapOsc.frequency.exponentialRampToValueAtTime(65, t + 0.08);

      snapGain.gain.setValueAtTime(0.5, t);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

      snapOsc.connect(snapGain);
      snapGain.connect(this.sfxGain);

      snapOsc.start(t);
      snapOsc.stop(t + 0.1);

      // 2. Tiny paper rustle
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, t);
      const rustleGain = this.ctx.createGain();
      rustleGain.gain.setValueAtTime(0.2, t);
      rustleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      noise.connect(filter);
      filter.connect(rustleGain);
      rustleGain.connect(this.sfxGain);
      noise.start(t);

      // 3. Resonant unfolding chime
      const unfoldOsc = this.ctx.createOscillator();
      const unfoldGain = this.ctx.createGain();
      unfoldOsc.type = 'sine';
      unfoldOsc.frequency.setValueAtTime(523.25, t + 0.07); // C5
      unfoldGain.gain.setValueAtTime(0.25, t + 0.07);
      unfoldGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);

      unfoldOsc.connect(unfoldGain);
      unfoldGain.connect(this.sfxGain);
      unfoldOsc.start(t + 0.07);
      unfoldOsc.stop(t + 1.45);
    });
  }

  /**
   * Confetti fanfare SFX: Joyful celebratory chime burst
   */
  public playConfettiFanfareSFX(): void {
    this.init().then(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;
      // Arpeggiated joyful chord: C5, E5, G5, C6
      const chord = [523.25, 659.25, 783.99, 1046.5];

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteT = t + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteT);

        gain.gain.setValueAtTime(0.3, noteT);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteT + 1.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + 1.25);
      });
    });
  }

  /**
   * Balloon pop SFX: Subtle cute pop
   */
  public playBalloonPopSFX(): void {
    this.init().then(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.07);
    });
  }

  /**
   * Gift open SFX: Magical sparkle / shimmer cascade
   */
  public playGiftOpenSFX(): void {
    this.init().then(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;
      // Cascade of high chime sparkles
      const shimmerPitches = [1046.5, 1318.51, 1567.98, 2093.0, 2637.02];

      shimmerPitches.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteT = t + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteT);

        gain.gain.setValueAtTime(0.2, noteT);
        gain.gain.exponentialRampToValueAtTime(0.00001, noteT + 0.9);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + 0.95);
      });
    });
  }

  /**
   * Subscribe to audio state changes
   */
  public subscribe(listener: (state: AudioEngineState) => void): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  private getState(): AudioEngineState {
    return {
      isPlaying: this.playing,
      isMuted: this.muted,
      volume: this.volumeLevel,
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in audio listener:', err);
      }
    });
  }
}

export const audioEngine = new ProceduralAudioEngine();
