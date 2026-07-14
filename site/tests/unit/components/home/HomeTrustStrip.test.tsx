import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeTrustStrip } from '@/components/home/HomeTrustStrip';
import { HOMEPAGE_TRUST_CONTENT } from '@/features/site/data/homepage';

describe('HomeTrustStrip Component', () => {
  it('renders logo list marquee correctly', () => {
    render(<HomeTrustStrip />);

    // Verify logoLabel text
    expect(screen.getByText(HOMEPAGE_TRUST_CONTENT.logoLabel)).toBeInTheDocument();

    // Verify projectsCta link
    const cta = screen.getByRole('link', { name: HOMEPAGE_TRUST_CONTENT.projectsCta });
    expect(cta).toHaveAttribute('href', '/trusted-by');

    // Verify all duplicated logos rendered
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(HOMEPAGE_TRUST_CONTENT.logos.length * 2);
  });
});
