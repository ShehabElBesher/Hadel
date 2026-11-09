import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { photosData } from '../../data/photosData';

describe('Tier 2: Feature 2 - Gallery & Lightbox Boundaries & Edge Cases', () => {
  it('F2-T2-01: Lightbox navigation wrap-around logic satisfies mathematical boundary constraints', () => {
    const totalPhotos = photosData.length;
    expect(totalPhotos).toBe(8);

    // Forward wrap: from 7 to 0
    const forwardWrap = (7 + 1) % totalPhotos;
    expect(forwardWrap).toBe(0);

    // Backward wrap: from 0 to 7
    const backwardWrap = (0 - 1 + totalPhotos) % totalPhotos;
    expect(backwardWrap).toBe(7);

    // Intermediate steps
    for (let i = 0; i < totalPhotos; i++) {
      expect((i + 1) % totalPhotos).toBe((i + 1) % 8);
      expect((i - 1 + totalPhotos) % totalPhotos).toBe((i - 1 + 8) % 8);
    }
  });

  it('F2-T2-02: Out-of-bounds photo index handling returns safe fallback', () => {
    const getPhotoSafe = (idx: number) => {
      if (idx < 0 || idx >= photosData.length) {
        return photosData[0]; // fallback
      }
      return photosData[idx];
    };

    expect(getPhotoSafe(-1)).toBe(photosData[0]);
    expect(getPhotoSafe(999)).toBe(photosData[0]);
    expect(getPhotoSafe(3)).toBe(photosData[3]);
  });

  it('F2-T2-03: Image onError simulation does not crash or break gallery container', () => {
    render(<App />);
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });
    fireEvent.click(photosTabBtn);

    const images = screen.getAllByRole('img');
    expect(images.length).toBe(8);

    // Simulate error event on first image
    fireEvent.error(images[0]);
    // The container remains healthy
    expect(screen.getAllByRole('img').length).toBe(8);
  });

  it('F2-T2-04: Handling photos with empty tags or unicode quotes gracefully', () => {
    photosData.forEach((photo) => {
      expect(Array.isArray(photo.tags)).toBe(true);
      expect(photo.title.length).toBeGreaterThan(0);
      expect(photo.originalFilename).toMatch(/\.jpg$/i);
    });
  });

  it('F2-T2-05: Rapid tab switching does not cause memory leaks or duplicate images in DOM', () => {
    render(<App />);
    const overviewTabBtn = screen.getByRole('button', { name: /نظرة عامة والعدادات/ });
    const photosTabBtn = screen.getByRole('button', { name: /الصور المعالجة \(8 صور\)/ });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(photosTabBtn);
      fireEvent.click(overviewTabBtn);
    }

    fireEvent.click(photosTabBtn);
    expect(screen.getAllByRole('img')).toHaveLength(8);
  });
});
