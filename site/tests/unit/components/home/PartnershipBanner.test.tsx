import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PartnershipBanner } from '@/components/home/PartnershipBanner';
import { HOMEPAGE_PARTNERSHIP_CONTENT } from '@/features/site/data/homepage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

vi.mock('@/lib/helpers/motion', () => ({
  fadeUp: () => ({})
}));

describe('PartnershipBanner and PartnershipPanel Components', () => {
  it('renders title and logo correctly', () => {
    render(<PartnershipBanner />);

    // Verify PartnershipPanel elements
    const element = screen.getByTestId('home-partnership');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-label', HOMEPAGE_PARTNERSHIP_CONTENT.image.alt);

    // Verify image src (decorative alt="" — not exposed as role img)
    const logo = screen
      .getByTestId('home-partnership')
      .querySelector('img.home-partnership-ribbon__logo-img');
    expect(logo).toHaveAttribute('src', HOMEPAGE_PARTNERSHIP_CONTENT.image.src);

    // Verify text parts
    expect(screen.getByText(HOMEPAGE_PARTNERSHIP_CONTENT.title[0])).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_PARTNERSHIP_CONTENT.title[1])).toBeInTheDocument();
  });
});
