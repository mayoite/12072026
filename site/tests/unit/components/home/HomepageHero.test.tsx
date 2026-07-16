import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomepageHero } from '@/components/home/HomepageHero';
import { HOMEPAGE_HERO_CONTENT, HOMEPAGE_HERO_IMAGES } from '@/features/site/data/homepage';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackSiteCtaClick: vi.fn(),
  handlePlannerEntryNavigation: vi.fn(),
}));

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
  SealCheck: () => <span data-testid="seal-check" />
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: { children?: React.ReactNode }) => <span {...props}>{children}</span>,
    p: ({ children, ...props }: { children?: React.ReactNode }) => <p {...props}>{children}</p>,
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

    const accessibleTitle = HOMEPAGE_HERO_CONTENT.title.join(' ');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: accessibleTitle,
      }),
    ).toBeInTheDocument();

    // Accessible name includes spaces between animated lines (SITE-A11Y)
    expect(accessibleTitle).toBe('Spaces that work as hard as your team');
    expect(accessibleTitle).not.toMatch(/workas|asyour/);

    // Visual line copy still present (aria-hidden decoration)
    HOMEPAGE_HERO_CONTENT.title.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });

    expect(screen.getByText(HOMEPAGE_HERO_CONTENT.kicker)).toBeInTheDocument();

    const primaryBtn = screen.getByRole('link', { name: HOMEPAGE_HERO_CONTENT.primaryCta.label });
    expect(primaryBtn).toHaveAttribute('href', HOMEPAGE_HERO_CONTENT.primaryCta.href);

    const secondaryBtn = screen.getByRole('link', { name: HOMEPAGE_HERO_CONTENT.secondaryCta.label });
    expect(secondaryBtn).toHaveAttribute('href', HOMEPAGE_HERO_CONTENT.secondaryCta.href);

    expect(screen.getByText(HOMEPAGE_HERO_CONTENT.glassProof.badge)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_HERO_CONTENT.glassProof.lead)).toBeInTheDocument();
  });

  it('cycles background images on slide button clicks', () => {
    render(<HomepageHero />);

    const activeImg = screen.getByAltText(HOMEPAGE_HERO_IMAGES[0].alt);
    expect(activeImg).toHaveAttribute('src', HOMEPAGE_HERO_IMAGES[0].src);

    const total = HOMEPAGE_HERO_IMAGES.length;
    const dotBtn = screen.getByRole('button', {
      name: `Show project image 2 of ${total}`,
    });
    fireEvent.click(dotBtn);

    const nextImg = screen.getByAltText(HOMEPAGE_HERO_IMAGES[1].alt);
    expect(nextImg).toHaveAttribute('src', HOMEPAGE_HERO_IMAGES[1].src);
  });

  it('exposes 44px-class slide controls and tracks hero CTAs via links', () => {
    render(<HomepageHero />);

    const firstDot = screen.getByRole('button', {
      name: `Show project image 1 of ${HOMEPAGE_HERO_IMAGES.length}`,
    });
    expect(firstDot.className).toMatch(/h-11/);
    expect(firstDot.className).toMatch(/min-w-11/);

    const primary = screen.getByRole('link', {
      name: HOMEPAGE_HERO_CONTENT.primaryCta.label,
    });
    const secondary = screen.getByRole('link', {
      name: HOMEPAGE_HERO_CONTENT.secondaryCta.label,
    });
    expect(primary).toHaveAttribute('href', HOMEPAGE_HERO_CONTENT.primaryCta.href);
    expect(secondary).toHaveAttribute('href', HOMEPAGE_HERO_CONTENT.secondaryCta.href);
  });
});
