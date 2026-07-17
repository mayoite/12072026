import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FooterLogoMarquee } from '@/components/site/FooterLogoMarquee';

vi.mock('@/features/site/data/homepage', () => ({
  HOMEPAGE_TRUST_CONTENT: {
    logos: [
      { name: 'Logo A', src: '/logos/a.png' },
      { name: 'Logo B', src: '/logos/b.png' },
    ],
  },
}));

describe('FooterLogoMarquee Component', () => {
  it('renders duplicated list of logos for infinite scroll track', () => {
    const { container } = render(<FooterLogoMarquee />);

    // Since the original list is duplicated once:
    // logos: 2 elements -> duplicated list: 4 elements.
    // Empty alt makes images presentation-only (no img role) — query DOM.
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(4);

    // Decorative marquee (parent aria-hidden) — empty alts avoid SR noise.
    expect(images[0]).toHaveAttribute('alt', '');
    expect(images[0]).toHaveAttribute('src', '/logos/a.png');

    expect(images[1]).toHaveAttribute('alt', '');
    expect(images[1]).toHaveAttribute('src', '/logos/b.png');

    expect(images[2]).toHaveAttribute('alt', '');
    expect(images[3]).toHaveAttribute('alt', '');
  });
});
