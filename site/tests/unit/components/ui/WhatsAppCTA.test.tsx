import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA';
import { hasConsentChoice } from '@/lib/consent';
import { routeSuppressesFloatingQuickContact } from '@/features/crm/contactSurfaces';
import { trackSiteCtaClick } from '@/lib/analytics/siteEvents';

vi.mock('@/lib/consent', () => ({
  hasConsentChoice: vi.fn(() => false),
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackSiteCtaClick: vi.fn(),
}));

vi.mock('@/lib/site-data/contact', () => ({
  buildWhatsAppHref: vi.fn((text) => `https://wa.me/mock?text=${encodeURIComponent(text)}`),
  buildMailtoHref: vi.fn((subject) => `mailto:mock@example.com?subject=${encodeURIComponent(subject)}`),
  toTelHref: vi.fn((phone) => `tel:${phone}`),
  SITE_CONTACT: {
    supportPhone: '+9111111111',
  },
}));

vi.mock('@/features/crm/contactSurfaces', () => ({
  routeSuppressesFloatingQuickContact: vi.fn(() => false),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test-path'),
}));

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => {
      const { initial: _initial, animate: _animate, transition: _transition, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
    div: ({ children, ...props }: any) => {
      const { initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('WhatsAppCTA Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null when the route suppresses the CTA', () => {
    vi.mocked(routeSuppressesFloatingQuickContact).mockReturnValue(true);
    const { container } = render(<WhatsAppCTA />);
    expect(container.firstChild).toBeNull();
  });

  it('renders floating action button with raised style when consent is not settled', () => {
    vi.mocked(routeSuppressesFloatingQuickContact).mockReturnValue(false);
    vi.mocked(hasConsentChoice).mockReturnValue(false);

    render(<WhatsAppCTA />);

    const fab = screen.getByRole('button', { name: 'Open WhatsApp quick contact' });
    expect(fab).toBeInTheDocument();
    expect(fab.className).toContain('site-fab-anchor--bottom-raised');
  });

  it('renders floating action button with standard style when consent is settled', () => {
    vi.mocked(routeSuppressesFloatingQuickContact).mockReturnValue(false);
    vi.mocked(hasConsentChoice).mockReturnValue(true);

    render(<WhatsAppCTA />);

    const fab = screen.getByRole('button', { name: 'Open WhatsApp quick contact' });
    expect(fab).toBeInTheDocument();
    expect(fab.className).toContain('site-fab-anchor--bottom');
  });

  it('opens panel, clicks a quick action (tracking check), and closes', () => {
    vi.mocked(routeSuppressesFloatingQuickContact).mockReturnValue(false);
    vi.mocked(hasConsentChoice).mockReturnValue(true);

    render(<WhatsAppCTA />);

    const fab = screen.getByRole('button', { name: 'Open WhatsApp quick contact' });
    
    // Panel should not be visible initially
    expect(screen.queryByText('Quick contact')).not.toBeInTheDocument();

    // Click FAB to open
    fireEvent.click(fab);
    expect(screen.getByText('Quick contact')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp now')).toBeInTheDocument();
    expect(screen.getByText('Call team')).toBeInTheDocument();
    expect(screen.getByText('Email us')).toBeInTheDocument();

    // Click WhatsApp action
    const whatsappLink = screen.getByRole('link', { name: /WhatsApp now/i });
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/mock?text=Hi%2C%20I%20need%20help%20with%20my%20workspace%20requirement.');
    expect(whatsappLink).toHaveAttribute('target', '_blank');
    fireEvent.click(whatsappLink);

    expect(trackSiteCtaClick).toHaveBeenCalledWith({
      href: 'https://wa.me/mock?text=Hi%2C%20I%20need%20help%20with%20my%20workspace%20requirement.',
      label: 'WhatsApp now',
      pathname: '/test-path',
      surface: 'quick-contact-panel',
    });

    // Click on footer link
    const footerLink = screen.getByTestId('next-link');
    expect(footerLink).toHaveAttribute('href', '/contact');
    fireEvent.click(footerLink);

    expect(trackSiteCtaClick).toHaveBeenCalledWith({
      href: '/contact',
      label: 'Open full contact page',
      pathname: '/test-path',
      surface: 'quick-contact-panel',
    });

    // Verify it closed on footer link click
    expect(screen.queryByText('Quick contact')).not.toBeInTheDocument();
  });

  it('handles window events for consent change', () => {
    let storedCallback: (() => void) | null = null;
    
    // Spy on window.addEventListener to check subscription
    const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
      if (event === 'oando-cookie-consent') {
        storedCallback = cb as () => void;
      }
    });

    vi.mocked(routeSuppressesFloatingQuickContact).mockReturnValue(false);
    vi.mocked(hasConsentChoice).mockReturnValue(false);

    const { rerender } = render(<WhatsAppCTA />);

    const fab = screen.getByRole('button', { name: 'Open WhatsApp quick contact' });
    expect(fab.className).toContain('site-fab-anchor--bottom-raised');

    // Trigger state change simulation
    vi.mocked(hasConsentChoice).mockReturnValue(true);
    if (storedCallback) {
      act(() => storedCallback?.());
    }

    rerender(<WhatsAppCTA />);
    expect(fab.className).toContain('site-fab-anchor--bottom');
    
    addSpy.mockRestore();
  });
});
