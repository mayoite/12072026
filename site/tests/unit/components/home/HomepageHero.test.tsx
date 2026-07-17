import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { HomepageHero } from '@/components/home/HomepageHero';
import {
  DEFAULT_HERO_FALLBACK,
  HOMEPAGE_HERO_IMAGES,
  joinAccessibleTitleLines,
} from '@/features/site/data/homepage';
import enMessages from '@/i18n/messages/en.json';

const hero = enMessages.home.hero;
const heroTitle = hero.title as string[];
const accessibleTitle = joinAccessibleTitleLines(heroTitle);
/** Glued DOM text that block-level line spans produce without an accessible join. */
const gluedTitle = heroTitle.join('');

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
  it('exposes exact accessible h1 name with spaces between animated lines (SF-01 / SITE-HOME-02)', () => {
    render(<HomepageHero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'home-hero-heading');
    expect(heading).toHaveAccessibleName(accessibleTitle);
    expect(accessibleTitle).toBe('Spaces that work as hard as your team');
    expect(accessibleTitle).not.toMatch(/workas|asyour/);
    // Must not collapse to the glued visual-only concatenation.
    expect(accessibleTitle).not.toBe(gluedTitle);
    expect(heading).not.toHaveAccessibleName(gluedTitle);

    const srOnly = heading.querySelector('.sr-only');
    expect(srOnly).not.toBeNull();
    expect(srOnly).toHaveTextContent(accessibleTitle);

    const decorative = heading.querySelector('[aria-hidden="true"]');
    expect(decorative).not.toBeNull();
    for (const line of heroTitle) {
      expect(within(decorative as HTMLElement).getByText(line)).toBeInTheDocument();
    }
  });

  it('renders hero title and details correctly', () => {
    render(<HomepageHero />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: accessibleTitle,
      }),
    ).toBeInTheDocument();

    // Visual line copy still present (aria-hidden decoration)
    heroTitle.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });

    expect(screen.getByText(hero.kicker)).toBeInTheDocument();

    const primaryBtn = screen.getByRole('link', { name: hero.primaryCta.label });
    expect(primaryBtn).toHaveAttribute('href', hero.primaryCta.href);

    const secondaryBtn = screen.getByRole('link', { name: hero.secondaryCta.label });
    expect(secondaryBtn).toHaveAttribute('href', hero.secondaryCta.href);

    expect(screen.getByText(hero.glassProof.badge)).toBeInTheDocument();
    expect(screen.getByText(hero.glassProof.lead)).toBeInTheDocument();
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
      name: hero.primaryCta.label,
    });
    const secondary = screen.getByRole('link', {
      name: hero.secondaryCta.label,
    });
    expect(primary).toHaveAttribute('href', hero.primaryCta.href);
    expect(secondary).toHaveAttribute('href', hero.secondaryCta.href);
  });

  it('falls back hero image to DEFAULT_HERO_FALLBACK on load error (SF-14)', () => {
    // Slide 0 is often the same asset as DEFAULT_HERO_FALLBACK — use a later slide.
    const nonFallback = HOMEPAGE_HERO_IMAGES.find(
      (img) => img.src !== DEFAULT_HERO_FALLBACK,
    );
    expect(nonFallback).toBeDefined();

    render(<HomepageHero />);

    const slideIndex = HOMEPAGE_HERO_IMAGES.findIndex(
      (img) => img.src === nonFallback!.src,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: `Show project image ${slideIndex + 1} of ${HOMEPAGE_HERO_IMAGES.length}`,
      }),
    );

    const img = screen.getByAltText(nonFallback!.alt);
    expect(img).toHaveAttribute('src', nonFallback!.src);
    fireEvent.error(img);
    expect(screen.getByAltText(nonFallback!.alt)).toHaveAttribute(
      'src',
      DEFAULT_HERO_FALLBACK,
    );
  });
});
