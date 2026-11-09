import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 1. Web Audio API Mock for JSDOM
class MockAudioNode {
  connect = vi.fn().mockReturnValue(this);
  disconnect = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = {
    value: 1,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
  };
}

class MockOscillatorNode extends MockAudioNode {
  type = 'sine';
  frequency = {
    value: 440,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
  start = vi.fn();
  stop = vi.fn();
}

class MockBiquadFilterNode extends MockAudioNode {
  type = 'lowpass';
  frequency = {
    value: 350,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
  Q = {
    value: 1,
    setValueAtTime: vi.fn(),
  };
}

class MockAudioBufferSourceNode extends MockAudioNode {
  buffer: unknown = null;
  start = vi.fn();
  stop = vi.fn();
}

export class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = new MockAudioNode();

  createGain = vi.fn().mockImplementation(() => new MockGainNode());
  createOscillator = vi.fn().mockImplementation(() => new MockOscillatorNode());
  createBiquadFilter = vi.fn().mockImplementation(() => new MockBiquadFilterNode());
  createBufferSource = vi.fn().mockImplementation(() => new MockAudioBufferSourceNode());
  createBuffer = vi.fn().mockImplementation((_channels: number, length: number) => ({
    length,
    numberOfChannels: _channels,
    sampleRate: 44100,
    getChannelData: vi.fn().mockReturnValue(new Float32Array(length)),
  }));

  resume = vi.fn().mockImplementation(async () => {
    this.state = 'running';
  });

  suspend = vi.fn().mockImplementation(async () => {
    this.state = 'suspended';
  });

  close = vi.fn().mockImplementation(async () => {
    this.state = 'closed';
  });
}

// Global AudioContext setup
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});

// 2. Canvas-Confetti Mock
vi.mock('canvas-confetti', () => ({
  default: vi.fn().mockImplementation(() => Promise.resolve()),
}));

// 3. Window ScrollTo Mock
window.scrollTo = vi.fn();

// 4. MatchMedia Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 5. IntersectionObserver Mock
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// 6. ResizeObserver Mock
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
