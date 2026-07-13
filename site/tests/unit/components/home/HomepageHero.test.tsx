import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomepageHero } from '@/components/home/HomepageHero';
import { HOMEPAGE_HERO_CONTENT, HOMEPAGE_HERO_IMAGES } from '@/lib/site-data/homepage';

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
  SealCheck: () => <span data-testid="seal-check" />
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  useReducedMotion: vi.fn().mockReturnValue(false)
}));

vi.mock('@/lib/helpers/motion', () => ({
  MOTION_EASE: [0.22, 1, 0.36, 1],
  MOTION_TOKENS: { slow: 1, medium: 0.5, distanceMd: 20 },
  useMotionSafeHover: () => ({})
}));

describe('HomepageHero Component', () => {
  it('renders hero title and details correctly', () => {
    render(<HomepageHero />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: HOMEPAGE_HERO_CONTENT.title.join(' '),
      }),
    ).toBeInTheDocument();

    // Verify Title Lines
    HOMEPAGE_HERO_CONTENT.title.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });

    // Verify kicker
    expect(screen.getByText(HOMEPAGE_HERO_CONTENT.kicker)).toBeInTheDocument();

    // Verify CTAs
    const primaryBtn = screen.getByRole('link', { name: HOMEPAGE_HERO_CONTENT.primaryCta.label });
    expect(primaryBtn).toHaveAttribute('href', HOMEPAGE_HERO_CONTENT.primaryCta.href);

    const secondaryBtn = screen.getByRole('link', { name: HOMEPAGE_HERO_CONTENT.secondaryCta.label });
    expect(secondaryBtn).toHaveAttribute('href', HOMEPAGE_HERO_CONTENT.secondaryCta.href);

    // Verify glass proof panel content
    expect(screen.getByText(HOMEPAGE_HERO_CONTENT.glassProof.badge)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_HERO_CONTENT.glassProof.lead)).toBeInTheDocument();
  });

  it('cycles background images on slide button clicks', () => {
    render(<HomepageHero />);

    // Check first image initially
    const activeImg = screen.getByAltText(HOMEPAGE_HERO_IMAGES[0].alt);
    expect(activeImg).toHaveAttribute('src', HOMEPAGE_HERO_IMAGES[0].src);

    // Click second dot button
    const dotBtn = screen.getByRole('button', { name: 'Show project image 2' });
    fireEvent.click(dotBtn);

    // Check second image active
    const nextImg = screen.getByAltText(HOMEPAGE_HERO_IMAGES[1].alt);
    expect(nextImg).toHaveAttribute('src', HOMEPAGE_HERO_IMAGES[1].src);
  });
});
