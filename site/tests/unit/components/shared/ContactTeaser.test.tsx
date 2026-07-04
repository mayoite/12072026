import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactTeaser } from '@/components/shared/ContactTeaser';
import { trackContactSubmission, trackSiteCtaClick } from '@/lib/analytics/siteEvents';

// Mock window location
const mockPathname = '/test-page';
Object.defineProperty(window, 'location', {
  value: {
    pathname: mockPathname,
  },
  writable: true,
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  ArrowUpRight: () => <span data-testid="arrow-icon" />,
  ChatCircleDots: () => <span data-testid="chat-dots-icon" />,
  ChatText: () => <span data-testid="chat-text-icon" />,
  PhoneCall: () => <span data-testid="phone-call-icon" />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
}));

// Mock motion helper
vi.mock('@/lib/helpers/motion', () => ({
  fadeUp: () => ({}),
}));

// Mock site-data & analytics
vi.mock('@/lib/site-data/contact', () => ({
  buildWhatsAppHref: (msg: string) => `https://wa.me/12345?text=${encodeURIComponent(msg)}`,
  SITE_CONTACT: {
    supportPhone: '+91 99999 99999',
  },
  toTelHref: (num: string) => `tel:${num}`,
}));

vi.mock('@/lib/site-data/homepage', () => ({
  HOMEPAGE_CONTACT_CONTENT: {
    titleLead: 'Quick project',
    titleAccent: 'brief',
    subtitle: 'Send us your details.',
    directActions: [
      { type: 'whatsapp', label: 'WhatsApp' },
      { type: 'phone', label: 'Call support' },
    ],
  },
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackContactSubmission: vi.fn(),
  trackSiteCtaClick: vi.fn(),
}));

describe('ContactTeaser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inputs, labels, and CTA links correctly', () => {
    render(<ContactTeaser />);

    expect(screen.getByRole('heading', { name: /Quick project brief/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Team size, scope, or timeline/i)).toBeInTheDocument();

    const waLink = screen.getByRole('link', { name: /WhatsApp/i });
    expect(waLink).toHaveAttribute('href', 'https://wa.me/12345?text=Need%20a%20direct%20workspace%20response%20for%20my%20project%20brief.');

    const phoneLink = screen.getByRole('link', { name: /Call support/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:+91 99999 99999');
  });

  it('shows error if neither phone nor email is supplied', async () => {
    render(<ContactTeaser />);

    fireEvent.change(screen.getByLabelText(/^Name/i), { target: { value: 'Ayush' } });
    fireEvent.change(screen.getByLabelText(/^City/i), { target: { value: 'Patna' } });
    fireEvent.change(screen.getByPlaceholderText(/Team size, scope, or timeline/i), { target: { value: 'Looking for tables.' } });

    const submitBtn = screen.getByRole('button', { name: /Send Brief/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Please add a phone number or email so we can reach you.')).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('submits form successfully and calls API when fields are valid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<ContactTeaser />);

    fireEvent.change(screen.getByLabelText(/^Name/i), { target: { value: 'Ayush' } });
    fireEvent.change(screen.getByLabelText(/^City/i), { target: { value: 'Patna' } });
    fireEvent.change(screen.getByLabelText(/^Phone/i), { target: { value: '+91 8888888888' } });
    fireEvent.change(screen.getByPlaceholderText(/Team size, scope, or timeline/i), { target: { value: 'Looking for seating.' } });

    const submitBtn = screen.getByRole('button', { name: /Send Brief/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/customer-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ayush',
          email: '',
          phone: '+91 8888888888',
          message: 'Looking for seating.\nCity: Patna',
          requirement: 'Workspace planning',
          preferredContact: 'phone',
          source: 'homepage-quick-brief',
          sourcePath: mockPathname,
        }),
      });
    });

    await waitFor(() => {
      expect(trackContactSubmission).toHaveBeenCalledWith({
        pathname: mockPathname,
        surface: 'contact-teaser',
        source: 'homepage-quick-brief',
        status: 'success',
      });
    });

    expect(screen.getByText('Brief received. Our team will contact you shortly.')).toBeInTheDocument();
  });

  it('handles API error response correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Database offline' }),
    });

    render(<ContactTeaser />);

    fireEvent.change(screen.getByLabelText(/^Name/i), { target: { value: 'Ayush' } });
    fireEvent.change(screen.getByLabelText(/^City/i), { target: { value: 'Patna' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'test@oando.local' } });
    fireEvent.change(screen.getByPlaceholderText(/Team size, scope, or timeline/i), {
      target: { value: 'Need pricing guidance.' },
    });

    const submitBtn = screen.getByRole('button', { name: /Send Brief/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(trackContactSubmission).toHaveBeenCalledWith({
        pathname: mockPathname,
        surface: 'contact-teaser',
        source: 'homepage-quick-brief',
        status: 'error',
      });
    });

    expect(screen.getByText('Database offline')).toBeInTheDocument();
  });

  it('tracks CTA click on external support link', () => {
    render(<ContactTeaser />);

    const waLink = screen.getByRole('link', { name: /WhatsApp/i });
    fireEvent.click(waLink);

    expect(trackSiteCtaClick).toHaveBeenCalledWith({
      href: expect.any(String),
      label: 'WhatsApp',
      pathname: mockPathname,
      surface: 'contact-teaser',
    });
  });
});
