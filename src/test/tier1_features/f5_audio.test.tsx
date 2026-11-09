import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { audioEngine } from '../../services/audioEngine';

describe('Tier 1: Feature 5 - Background Celebration Music Player', () => {
  beforeEach(() => {
    audioEngine.pauseMelody();
    if (audioEngine.isMuted()) {
      audioEngine.toggleMute();
    }
    audioEngine.setVolume(0.5);
    vi.clearAllMocks();
  });

  it('F5-T1-01: Audio player starts in paused/idle state initially', () => {
    render(<App />);
    expect(audioEngine.isPlaying()).toBe(false);
    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });
    expect(playBtn).toHaveAttribute('title', 'تشغيل اللحن الموسيقي');
  });

  it('F5-T1-02: Play/pause button toggles melody playback state and updates icon/title', async () => {
    render(<App />);
    const playBtn = screen.getByRole('button', { name: /Toggle Birthday Melody/i });

    // Click to start
    fireEvent.click(playBtn);
    await waitFor(() => {
      expect(audioEngine.isPlaying()).toBe(true);
      expect(playBtn).toHaveAttribute('title', 'إيقاف اللحن');
    });

    // Click to pause
    fireEvent.click(playBtn);
    await waitFor(() => {
      expect(audioEngine.isPlaying()).toBe(false);
      expect(playBtn).toHaveAttribute('title', 'تشغيل اللحن الموسيقي');
    });
  });

  it('F5-T1-03: Mute button toggles mute state and updates icon', () => {
    render(<App />);
    const muteBtn = screen.getByRole('button', { name: /Toggle Mute/i });

    expect(audioEngine.isMuted()).toBe(false);
    expect(muteBtn).toHaveAttribute('title', 'كتم الصوت');

    // Mute
    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(true);
    expect(muteBtn).toHaveAttribute('title', 'إلغاء الكتم');

    // Unmute
    fireEvent.click(muteBtn);
    expect(audioEngine.isMuted()).toBe(false);
    expect(muteBtn).toHaveAttribute('title', 'كتم الصوت');
  });

  it('F5-T1-04: Volume slider updates volume level and percentage label', () => {
    render(<App />);
    const slider = screen.getByRole('slider', { name: /Volume Slider/i }) as HTMLInputElement;

    fireEvent.change(slider, { target: { value: '0.8' } });
    expect(audioEngine.getVolume()).toBe(0.8);
    expect(screen.getByText('80%')).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '0.2' } });
    expect(audioEngine.getVolume()).toBe(0.2);
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('F5-T1-05: Overview tab displays live audio engine status box', () => {
    render(<App />);
    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });
    fireEvent.click(overviewTabBtn);

    expect(screen.getByText(/حالة المحرك الصوتي الموسيقي/)).toBeInTheDocument();
    expect(screen.getByText(/متوقف مؤقتاً ⏸️/)).toBeInTheDocument();
    expect(screen.getByText(/مسموع 🔊/)).toBeInTheDocument();
    expect(screen.getByText(/مستوى الصوت: 50%/)).toBeInTheDocument();
  });
});
