import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Gallery } from './Gallery';
import { LightboxModal } from './LightboxModal';
import { photosData } from '../../data/photosData';

describe('Milestone 3: Gallery & LightboxModal Component Unit Tests', () => {
  it('renders section container with id memory-lane, royal header, and subtitle', () => {
    const { container } = render(<Gallery />);

    const section = container.querySelector('#memory-lane');
    expect(section).toBeInTheDocument();

    const heading = screen.getByText(/شريط الذكريات 📸/);
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('font-amiri');

    const subtitle = screen.getByText(/لحظات لا تُنسى وثّقها الزمان.. محفورة في القلب إلى الأبد/);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders all 8 photos in Bento grid with upright aspect-[3/4] ratio containers', () => {
    const { container } = render(<Gallery />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(8);

    const aspectContainers = container.querySelectorAll('.aspect-\\[3\\/4\\]');
    expect(aspectContainers).toHaveLength(8);
  });

  it('category filter buttons filter photos and can switch back to all 8', () => {
    render(<Gallery />);

    const modernFilterBtn = screen.getByRole('button', { name: /إشراقة الحاضر \(3\)/ });
    fireEvent.click(modernFilterBtn);

    let images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    const vintageFilterBtn = screen.getByRole('button', { name: /أيام الصبا والذكريات \(5\)/ });
    fireEvent.click(vintageFilterBtn);

    images = screen.getAllByRole('img');
    expect(images).toHaveLength(5);

    const allFilterBtn = screen.getByRole('button', { name: /جميع الذكريات \(8\)/ });
    fireEvent.click(allFilterBtn);

    images = screen.getAllByRole('img');
    expect(images).toHaveLength(8);
  });

  it('clicking heart reaction button on a card increments reaction counter without opening modal', () => {
    render(<Gallery />);

    // First card heart button
    const firstPhoto = photosData[0];
    const heartBtn = screen.getByRole('button', {
      name: new RegExp(`إعجاب بصورة ${firstPhoto.title}`),
    });

    const initialText = heartBtn.textContent;
    fireEvent.click(heartBtn);

    // Lightbox modal should NOT be open
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reaction count increased
    expect(heartBtn.textContent).not.toBe(initialText);
  });

  it('clicking a card opens Fullscreen LightboxModal with correct photo active', () => {
    render(<Gallery />);

    // Click on the first card
    const firstCard = screen.getByRole('button', { name: `عرض صورة: ${photosData[0].title}` });
    fireEvent.click(firstCard);

    // Modal dialog should now be open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(`صورة 1 من ${photosData.length}`)).toBeInTheDocument();
    expect(within(dialog).getByText(photosData[0].title)).toBeInTheDocument();
    expect(within(dialog).getByText(photosData[0].caption)).toBeInTheDocument();
  });

  it('Lightbox navigation: Next, Previous and wrap-around work correctly', () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    const onLike = vi.fn();

    const { rerender } = render(
      <LightboxModal
        photos={photosData}
        currentIndex={0}
        isOpen={true}
        onClose={onClose}
        onNavigate={onNavigate}
        likes={{}}
        onLike={onLike}
      />
    );

    // Next button moves index to 1
    const nextBtn = screen.getByRole('button', { name: /الصورة التالية/ });
    fireEvent.click(nextBtn);
    expect(onNavigate).toHaveBeenCalledWith(1);

    // Previous button on first photo wraps around to last photo (index 7)
    const prevBtn = screen.getByRole('button', { name: /الصورة السابقة/ });
    fireEvent.click(prevBtn);
    expect(onNavigate).toHaveBeenCalledWith(7);

    // Re-render at last photo (index 7), Next wraps around to 0
    rerender(
      <LightboxModal
        photos={photosData}
        currentIndex={7}
        isOpen={true}
        onClose={onClose}
        onNavigate={onNavigate}
        likes={{}}
        onLike={onLike}
      />
    );
    fireEvent.click(nextBtn);
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('Lightbox keyboard navigation: ArrowRight advances in RTL, ArrowLeft goes back, Escape closes', () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    const onLike = vi.fn();

    render(
      <LightboxModal
        photos={photosData}
        currentIndex={2}
        isOpen={true}
        onClose={onClose}
        onNavigate={onNavigate}
        likes={{}}
        onLike={onLike}
      />
    );

    // ArrowRight in RTL advances to next photo (index 3)
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigate).toHaveBeenCalledWith(3);

    // ArrowLeft in RTL goes to previous photo (index 1)
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onNavigate).toHaveBeenCalledWith(1);

    // Escape closes modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('Lightbox zoom toggle switches zoom state and double-click toggles zoom', () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    const onLike = vi.fn();

    const { container } = render(
      <LightboxModal
        photos={photosData}
        currentIndex={0}
        isOpen={true}
        onClose={onClose}
        onNavigate={onNavigate}
        likes={{}}
        onLike={onLike}
      />
    );

    const zoomBtn = screen.getByRole('button', { name: 'تكبير الصورة' });
    fireEvent.click(zoomBtn);

    // Should now have ZoomOut option
    expect(screen.getByRole('button', { name: 'تصغير الصورة' })).toBeInTheDocument();

    // Image has scale class
    const modalImg = container.querySelector('img[src="/photos/IMG-20230520-WA0002.jpg"]');
    expect(modalImg?.className).toContain('scale-150');

    // Double clicking toggles back
    const zoomContainer = container.querySelector('.cursor-zoom-out');
    expect(zoomContainer).toBeInTheDocument();
    if (zoomContainer) {
      fireEvent.doubleClick(zoomContainer);
      expect(screen.getByRole('button', { name: 'تكبير الصورة' })).toBeInTheDocument();
    }
  });

  it('Lightbox touch swipe navigation: swiping left advances, swiping right goes back', () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    const onLike = vi.fn();

    const { container } = render(
      <LightboxModal
        photos={photosData}
        currentIndex={3}
        isOpen={true}
        onClose={onClose}
        onNavigate={onNavigate}
        likes={{}}
        onLike={onLike}
      />
    );

    const swipeArea = container.querySelector('.overflow-hidden.my-2');
    expect(swipeArea).toBeInTheDocument();

    if (swipeArea) {
      // Simulate swipe left (deltaX > 40) -> Next (index 4)
      fireEvent.touchStart(swipeArea, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      fireEvent.touchEnd(swipeArea, {
        changedTouches: [{ clientX: 130, clientY: 100 }],
      });
      expect(onNavigate).toHaveBeenCalledWith(4);

      // Simulate swipe right (deltaX < -40) -> Prev (index 2)
      fireEvent.touchStart(swipeArea, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchEnd(swipeArea, {
        changedTouches: [{ clientX: 180, clientY: 100 }],
      });
      expect(onNavigate).toHaveBeenCalledWith(2);
    }
  });

  it('locks body scroll when LightboxModal is open and unlocks on close', () => {
    const { unmount } = render(
      <LightboxModal
        photos={photosData}
        currentIndex={0}
        isOpen={true}
        onClose={() => {}}
        onNavigate={() => {}}
        likes={{}}
        onLike={() => {}}
      />
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
