import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';

const mockEmblaApi = {
  on: vi.fn(),
  off: vi.fn(),
  selectedScrollSnap: vi.fn().mockReturnValue(0),
  canScrollPrev: vi.fn().mockReturnValue(false),
  canScrollNext: vi.fn().mockReturnValue(true),
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
  scrollTo: vi.fn()
};

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), mockEmblaApi]
}));

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="left-icon" />,
  ChevronRight: () => <span data-testid="right-icon" />
}));

describe('FeaturedCarousel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmblaApi.canScrollPrev.mockReturnValue(false);
    mockEmblaApi.canScrollNext.mockReturnValue(true);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders product items and registers Embla listeners', () => {
    render(<FeaturedCarousel />);

    // Verify Title
    expect(screen.getByText('Built for active work floors.')).toBeInTheDocument();

    // Verify items
    expect(screen.getByText('Fluid X')).toBeInTheDocument();
    expect(screen.getByText('DeskPro')).toBeInTheDocument();

    // Verify Embla listeners registered on mount
    expect(mockEmblaApi.on).toHaveBeenCalledWith('select', expect.any(Function));
    expect(mockEmblaApi.on).toHaveBeenCalledWith('reInit', expect.any(Function));
  });

  it('triggers scrollPrev and scrollNext on button clicks', () => {
    // Make canScrollPrev and canScrollNext true
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    mockEmblaApi.canScrollNext.mockReturnValue(true);

    render(<FeaturedCarousel />);

    const prevBtn = screen.getByTestId('featured-prev');
    const nextBtn = screen.getByTestId('featured-next');

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(prevBtn);
    expect(mockEmblaApi.scrollPrev).toHaveBeenCalled();

    fireEvent.click(nextBtn);
    expect(mockEmblaApi.scrollNext).toHaveBeenCalled();
  });

  it('triggers keydown navigation', () => {
    render(<FeaturedCarousel />);
    const region = screen.getByLabelText('Featured products');

    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(mockEmblaApi.scrollPrev).toHaveBeenCalled();

    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(mockEmblaApi.scrollNext).toHaveBeenCalled();
  });

  it('triggers scrollTo on mobile dot clicks', () => {
    render(<FeaturedCarousel />);
    const dotBtn = screen.getByTestId('featured-dot-1');
    fireEvent.click(dotBtn);

    expect(mockEmblaApi.scrollTo).toHaveBeenCalledWith(1);
  });
});
