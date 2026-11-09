import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';

describe('Tier 1: Feature 1 - Celebratory Hero Section', () => {
  beforeEach(() => {
    audioEngine.pauseMelody();
    if (audioEngine.isMuted()) {
      audioEngine.toggleMute();
    }
    audioEngine.setVolume(0.5);
    vi.clearAllMocks();
  });

  it('F1-T1-01: Displays royal headline celebrating Hadel with Amiri styling', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('هديل');
    expect(heading.textContent).toContain('كل عام وأنتِ الخير لكل عام');
    expect(heading.className).toContain('font-amiri');
  });

  it('F1-T1-02: Displays luxury edition badge and crown royal icon', () => {
    const { container } = render(<App />);
    const badge = screen.getByText(/نظام الاحتفال الفاخر • الإصدار المخصص لهديل/);
    expect(badge).toBeInTheDocument();

    const titleH1 = screen.getByRole('heading', { level: 1 });
    expect(titleH1.textContent).toContain('عيد ميلاد هديل');

    // Crown SVG icon exists in header
    const crownSvg = container.querySelector('header svg.lucide-crown');
    expect(crownSvg).toBeInTheDocument();
  });

  it('F1-T1-03: Displays celebration sound FX triggers in hero section', () => {
    render(<App />);
    const candleBtn = screen.getByText(/نفخ الشمعة/);
    const waxBtn = screen.getByText(/كسر ختم الشمع/);
    const fanfareBtn = screen.getByText(/فرحة الكنفيتي/);
    const balloonBtn = screen.getByText(/فرقعة البالون/);
    const giftBtn = screen.getByText(/فتح الهدية/);

    expect(candleBtn).toBeInTheDocument();
    expect(waxBtn).toBeInTheDocument();
    expect(fanfareBtn).toBeInTheDocument();
    expect(balloonBtn).toBeInTheDocument();
    expect(giftBtn).toBeInTheDocument();
  });

  it('F1-T1-04: Audio player widget is rendered in the sticky header bar with controls', () => {
    render(<App />);
    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    const muteBtn = screen.getByRole('button', { name: /Toggle Mute/i });
    const slider = screen.getByRole('slider', { name: /Volume Slider/i });

    expect(playBtn).toBeInTheDocument();
    expect(muteBtn).toBeInTheDocument();
    expect(slider).toBeInTheDocument();
  });

  it('F1-T1-05: Hero section layout features responsive container classes and luxury dark styling', () => {
    const { container } = render(<App />);
    const mainWrapper = container.querySelector('.min-h-screen');
    expect(mainWrapper).toBeInTheDocument();
    expect(mainWrapper?.className).toContain('bg-obsidian-900');
    expect(mainWrapper?.className).toContain('text-ivory');

    const heroSection = container.querySelector('section');
    expect(heroSection).toBeInTheDocument();
    expect(heroSection?.className).toContain('text-center');
  });
});
