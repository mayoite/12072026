import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { trackSiteCtaClick } from '@/lib/analytics/siteEvents';

vi.mock('next/navigation', () => ({
  usePathname: () => '/current-path',
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackSiteCtaClick: vi.fn(),
}));

describe('TrackedLink Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders internal link and tracks click', () => {
    render(
      <TrackedLink href="/products/chairs" label="View Chairs" surface="test-page">
        Go to Chairs
      </TrackedLink>
    );

    const link = screen.getByTestId('next-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products/chairs');
    expect(link).toHaveTextContent('Go to Chairs');

    // Click link
    fireEvent.click(link);

    expect(trackSiteCtaClick).toHaveBeenCalledWith({
      href: '/products/chairs',
      label: 'View Chairs',
      pathname: '/current-path',
      surface: 'test-page',
    });
  });

  it('renders external link and tracks click', () => {
    render(
      <TrackedLink
        href="https://google.com"
        label="Google"
        surface="test-page"
        target="_blank"
        rel="noopener noreferrer"
        className="external-class"
      >
        Search Google
      </TrackedLink>
    );

    // Should render external normal link (not Next.js Link)
    const link = screen.getByRole('link', { name: 'Search Google' });
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveAttribute('data-testid', 'next-link');
    expect(link).toHaveAttribute('href', 'https://google.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('external-class');

    // Click link
    fireEvent.click(link);

    expect(trackSiteCtaClick).toHaveBeenCalledWith({
      href: 'https://google.com',
      label: 'Google',
      pathname: '/current-path',
      surface: 'test-page',
    });
  });

  it('handles mailto and tel links as external', () => {
    const { rerender } = render(
      <TrackedLink href="mailto:info@oando.co.in" label="Email" surface="footer">
        Email Us
      </TrackedLink>
    );
    expect(screen.queryByTestId('next-link')).toBeNull();

    rerender(
      <TrackedLink href="tel:+9112345678" label="Call" surface="footer">
        Call Us
      </TrackedLink>
    );
    expect(screen.queryByTestId('next-link')).toBeNull();
  });
});
