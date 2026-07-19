import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Collections } from '@/components/home/Collections';
import { HOMEPAGE_COLLECTIONS_CONTENT } from '@/features/site/data/homepage';

// Mock embla-carousel (the carousel lib Collections migrated onto).
// useEmblaCarousel returns [ref, api]; api is used for scrollPrev/Next + events.
vi.mock('embla-carousel-react', () => ({
  default: () => [
    vi.fn(),
    {
      canScrollPrev: () => false,
      canScrollNext: () => true,
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn()
    }
  ]
}));

vi.mock('embla-carousel-autoplay', () => ({
  default: () => ({ play: vi.fn(), stop: vi.fn() })
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

    // Verify carousel section renders
    expect(screen.getByTestId('home-collections')).toBeInTheDocument();

    // One card link per collection item (accessible name from the visible h3).
    for (const item of HOMEPAGE_COLLECTIONS_CONTENT.items) {
      expect(screen.getByRole('link', { name: item.name })).toBeInTheDocument();
    }

    // Nav controls present.
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();

    // Link accessible name comes from visible h3; image is decorative (alt="").
    const firstItem = HOMEPAGE_COLLECTIONS_CONTENT.items[0];
    const firstLink = screen.getByRole('link', { name: firstItem.name });
    expect(firstLink).toHaveAttribute('href', firstItem.href);
    const firstSlideImg = firstLink.querySelector('img');
    expect(firstSlideImg).toHaveAttribute('alt', '');
    expect(firstSlideImg).toHaveAttribute('src', firstItem.image);
  });
});
