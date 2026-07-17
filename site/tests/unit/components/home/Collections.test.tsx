import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Collections } from '@/components/home/Collections';
import { HOMEPAGE_COLLECTIONS_CONTENT } from '@/features/site/data/homepage';

// Mock Swiper
vi.mock('swiper/react', () => ({
  Swiper: ({ children }: any) => <div data-testid="mock-swiper">{children}</div>,
  SwiperSlide: ({ children }: any) => <div data-testid="mock-swiper-slide">{children}</div>
}));

vi.mock('swiper/modules', () => ({
  Navigation: {},
  Autoplay: {}
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }
}));

// Mock CollectionsSectionHeading
vi.mock('@/components/home/CollectionsSectionHeading', () => ({
  CollectionsSectionHeading: () => <div data-testid="mock-heading">Collections Heading</div>
}));

// Mock helpers/motion
vi.mock('@/lib/helpers/motion', () => ({
  fadeUp: () => ({}),
  useMotionSafeHover: () => ({})
}));

vi.mock('@phosphor-icons/react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left" />,
  ArrowRight: () => <span data-testid="arrow-right" />
}));

describe('Collections Component', () => {
  it('renders section structure and slides correctly', () => {
    render(<Collections />);

    // Verify heading is present
    expect(screen.getByTestId('mock-heading')).toBeInTheDocument();

    // Verify catalog CTA Link
    const cta = screen.getByRole('link', { name: HOMEPAGE_COLLECTIONS_CONTENT.catalogCta.label });
    expect(cta).toHaveAttribute('href', HOMEPAGE_COLLECTIONS_CONTENT.catalogCta.href);

    // Verify Swiper rendering
    expect(screen.getByTestId('mock-swiper')).toBeInTheDocument();

    // Verify Swiper slides have been created
    const slides = screen.getAllByTestId('mock-swiper-slide');
    expect(slides.length).toBe(HOMEPAGE_COLLECTIONS_CONTENT.items.length);

    // Link accessible name comes from visible h3; image is decorative (alt="").
    const firstItem = HOMEPAGE_COLLECTIONS_CONTENT.items[0];
    const firstLink = screen.getByRole('link', { name: firstItem.name });
    expect(firstLink).toHaveAttribute('href', firstItem.href);
    const firstSlideImg = firstLink.querySelector('img');
    expect(firstSlideImg).toHaveAttribute('alt', '');
    expect(firstSlideImg).toHaveAttribute('src', firstItem.image);
  });
});
