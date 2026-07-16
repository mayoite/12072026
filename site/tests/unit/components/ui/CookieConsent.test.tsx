import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CookieConsent } from '@/components/ui/CookieConsent';

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe('CookieConsent Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders cookie consent bar when consent is not yet given', () => {
    render(<CookieConsent />);

    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeInTheDocument();
    expect(screen.getByText(/We use cookies to optimize our website/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept All' })).toBeInTheDocument();
  });

  it('does not render if consent has already been given', () => {
    localStorage.setItem('oando-cookie-consent', 'true');
    const { container } = render(<CookieConsent />);
    expect(container.firstChild).toBeNull();
  });

  it('closes the bar and does not set localStorage when Decline is clicked', () => {
    render(<CookieConsent />);

    const declineBtn = screen.getByRole('button', { name: 'Decline' });
    fireEvent.click(declineBtn);

    expect(screen.queryByText(/We use cookies to optimize our website/i)).not.toBeInTheDocument();
    expect(localStorage.getItem('oando-cookie-consent')).toBeNull();
  });

  it('closes the bar and sets localStorage to true when Accept All is clicked', () => {
    render(<CookieConsent />);

    const acceptBtn = screen.getByRole('button', { name: 'Accept All' });
    fireEvent.click(acceptBtn);

    expect(screen.queryByText(/We use cookies to optimize our website/i)).not.toBeInTheDocument();
    expect(localStorage.getItem('oando-cookie-consent')).toBe('true');
  });
});
