import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from '@/components/site/Footer';

// Mock components
vi.mock('@/components/ui/Logo', () => ({
  OneAndOnlyLogo: ({ variant, className }: any) => (
    <div data-testid="logo" data-variant={variant} className={className}>
      Logo
    </div>
  ),
}));

vi.mock('@/components/site/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

// Mock contact site-data
vi.mock('@/features/site/data/contact', () => ({
  buildMailtoHref: () => 'mailto:sales@oando.local',
  formatSitePostalAddress: () => 'Patna office address',
  SITE_CONTACT: {
    supportPhone: '+91 99999 99999',
    salesEmail: 'sales@oando.local',
  },
  toTelHref: (num: string) => `tel:${num}`,
}));

// Mock site navigation
vi.mock('@/features/site/data/navigation', () => ({
  SITE_SOCIAL_LINKS: [
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
  ],
  SITE_FOOTER_NAV: [
    {
      heading: 'Category A',
      links: [{ href: '/a', label: 'Link A' }],
    },
    {
      heading: 'Category B',
      links: [{ href: '/b', label: 'Link B' }],
    },
  ],
}));

// Mock productSuite route
vi.mock('@/features/site/data/productSuite', () => ({
  PRODUCT_SUITE: {
    admin: {
      routes: {
        landing: '/admin-route',
      },
    },
  },
}));

describe('SiteFooter Component', () => {
  it('renders logo, address details, and custom lists correctly', () => {
    render(<SiteFooter />);

    // Logo check
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-variant', 'orange');
    expect(screen.getByRole('link', { name: /One&Only - home/i })).toHaveAttribute('href', '/');

    // Contact details check
    expect(screen.getByText('Patna office address')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '9031022875' })).toHaveAttribute('href', 'tel:+91 99999 99999');
    expect(screen.getByRole('link', { name: 'sales@oando.local' })).toHaveAttribute('href', 'mailto:sales@oando.local');

    // Language switcher
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();

    // Social links checks
    const facebookLink = screen.getByRole('link', { name: 'Facebook' });
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    const youtubeLink = screen.getByRole('link', { name: 'YouTube' });
    expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com');

    // Nav columns checks
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link A' })).toHaveAttribute('href', '/a');
    expect(screen.getByText('Category B')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link B' })).toHaveAttribute('href', '/b');

    // Legal bar checks
    expect(screen.getByRole('link', { name: 'Refund Policy' })).toHaveAttribute('href', '/refund-and-return-policy');
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    expect(screen.queryByRole('link', { name: 'Imprint' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin-route');

    // Current Year copy
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} One&Only. All rights reserved.`))).toBeInTheDocument();
  });
});
