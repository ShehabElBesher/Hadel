import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { photosData } from '../../data/photosData';

describe('Tier 1: Feature 2 - Interactive Memory Lane & 8 Photos Gallery', () => {
  it('F2-T1-01: Navigating to photos tab renders exactly 8 curated photos', () => {
    render(<App />);
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(8);
  });

  it('F2-T1-02: Includes orientation-corrected photo IMG_20200402_185317.jpg with title and date', () => {
    render(<App />);
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);

    const filenameText = screen.getByText('IMG_20200402_185317.jpg');
    expect(filenameText).toBeInTheDocument();

    const title = screen.getByText(/سكينة المساء وعطر العائلة/);
    expect(title).toBeInTheDocument();

    const dateBadges = screen.getAllByText(/أبريل 2020/);
    expect(dateBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('F2-T1-03: Displays heartwarming Arabic titles and captions for all 8 photos', () => {
    render(<App />);
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);

    photosData.forEach((photo) => {
      expect(screen.getByText(photo.title)).toBeInTheDocument();
      expect(screen.getByText(photo.caption)).toBeInTheDocument();
    });
  });

  it('F2-T1-04: Displays date badges for milestone years 2020, 2023, and 2024', () => {
    render(<App />);
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);

    // Badges from photosData: مايو 2023, نوفمبر 2023, مارس 2024, أبريل 2020
    expect(screen.getByText(/مايو 2023/)).toBeInTheDocument();
    expect(screen.getByText(/نوفمبر 2023/)).toBeInTheDocument();
    expect(screen.getByText(/مارس 2024/)).toBeInTheDocument();
    expect(screen.getAllByText(/أبريل 2020/).length).toBeGreaterThanOrEqual(1);
  });

  it('F2-T1-05: Photos have accessible alt text and responsive image containers', () => {
    const { container } = render(<App />);
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).toBeTruthy();
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img.className).toContain('object-cover');
    });

    const photoCards = container.querySelectorAll('.aspect-\\[3\\/4\\]');
    expect(photoCards).toHaveLength(8);
  });
});
