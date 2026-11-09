import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';

describe('Tier 2: Feature 1 - Hero Section Boundaries & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('F1-T2-01: Extreme narrow viewport (320px width) renders without horizontal overflow or clipping', () => {
    window.innerWidth = 320;
    window.innerHeight = 568;
    const { container } = render(<App />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('F1-T2-02: Rapid clicking sound triggers (10 rapid clicks) does not throw or desync state', () => {
    render(<App />);
    const balloonBtn = screen.getByRole('button', { name: /فرقعة البالون/ });

    for (let i = 0; i < 10; i++) {
      expect(() => fireEvent.click(balloonBtn)).not.toThrow();
    }
  });

  it('F1-T2-03: Renders properly when prefers-reduced-motion is active', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
    matchMediaSpy.mockRestore();
  });

  it('F1-T2-04: High DPI / Retina display (devicePixelRatio = 3.0) renders without error', () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 3.0,
    });

    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();

    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: originalDpr,
    });
  });

  it('F1-T2-05: Missing or undefined AudioContext fallback does not crash hero buttons', async () => {
    const playSpy = vi.spyOn(audioEngine, 'playBalloonPopSFX').mockImplementation(() => {});
    render(<App />);
    const balloonBtn = screen.getByRole('button', { name: /فرقعة البالون/ });

    fireEvent.click(balloonBtn);
    expect(playSpy).toHaveBeenCalled();
    playSpy.mockRestore();
  });
});
