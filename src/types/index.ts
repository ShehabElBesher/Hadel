export interface PhotoMemory {
  id: string;
  originalFilename: string;
  webPath: string;
  webpPath?: string;
  title: string;
  dateBadge: string;
  caption: string;
  orientation: 'portrait' | 'landscape';
  aspectRatio: string;
  tags: string[];
  chapter: 'vintage' | 'modern';
}

export interface AudioEngineState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

export interface IAudioEngine {
  init(): Promise<void>;
  playMelody(): void;
  pauseMelody(): void;
  toggleMelody(): boolean;
  setVolume(level: number): void; // 0.0 to 1.0
  toggleMute(): boolean;
  isPlaying(): boolean;
  isMuted(): boolean;
  getVolume(): number;
  // Sound FX
  playCandleBlowoutSFX(): void;
  playWaxSealBreakSFX(): void;
  playConfettiFanfareSFX(): void;
  playBalloonPopSFX(): void;
  playGiftOpenSFX(): void;
  subscribe(listener: (state: AudioEngineState) => void): () => void;
}

export interface SisterWishReason {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
}

export interface MilestoneCounter {
  id: string;
  number: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface BrotherMessageData {
  recipient: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  audioVoiceoverAvailable?: boolean;
}

export interface KeepsakeCertificate {
  title: string;
  subtitle: string;
  recipientName: string;
  awardedBy: string;
  date: string;
  declaration: string;
  sealText: string;
}
