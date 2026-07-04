import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerQueryForm } from '@/components/contact/CustomerQueryForm';
import { trackContactSubmission } from '@/lib/analytics/siteEvents';

vi.mock('next/navigation', () => ({
  usePathname: () => '/contact'
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackContactSubmission: vi.fn()
}));

describe('CustomerQueryForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders form elements with initial empty state', () => {
    render(<CustomerQueryForm />);
    
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Company/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Message/i)).toHaveValue('');
  });

  it('validates required fields before submitting', () => {
    render(<CustomerQueryForm />);
    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();

    // Fill Name
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    expect(submitBtn).toBeDisabled();

    // Fill Message
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello workspace' } });
    expect(submitBtn).toBeDisabled(); // Still disabled because neither email nor phone is filled

    // Fill Email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    expect(submitBtn).toBeEnabled();
  });

  it('submits correctly on success', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        queryId: 'Q-12345',
        followUp: { email: 'mailto:ops@oando.co.in', whatsapp: 'https://wa.me/xyz' }
      })
    } as any);

    render(<CustomerQueryForm />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'I need a workstation' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

    const submitBtn = screen.getByRole('button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Query submitted/i)).toBeInTheDocument();
      expect(screen.getByText('Q-12345')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/customer-queries', expect.any(Object));
    expect(trackContactSubmission).toHaveBeenCalledWith({
      pathname: '/contact',
      surface: 'contact-page-form',
      source: 'website-contact',
      status: 'success'
    });

    // Check action links
    expect(screen.getByRole('link', { name: 'Reply by Email' })).toHaveAttribute('href', 'mailto:ops@oando.co.in');
    expect(screen.getByRole('link', { name: 'Reply on WhatsApp' })).toHaveAttribute('href', 'https://wa.me/xyz');
  });

  it('seeds context message when intent is quote and source is compare', async () => {
    render(<CustomerQueryForm intent="quote" source="compare" />);

    // Wait for seeding promise to resolve
    await waitFor(() => {
      expect(screen.getByLabelText(/Message/i)).not.toHaveValue('');
    });

    expect(screen.getByLabelText(/Message/i).value).toContain('compare');
  });

  it('handles response errors', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Form validation failed' })
    } as any);

    render(<CustomerQueryForm />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'I need a workstation' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Form validation failed');
    });

    expect(trackContactSubmission).toHaveBeenCalledWith({
      pathname: '/contact',
      surface: 'contact-page-form',
      source: 'website-contact',
      status: 'error'
    });
  });

  it('handles network errors', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockRejectedValue(new Error('Network error'));

    render(<CustomerQueryForm />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'I need a workstation' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error. Please try again.');
    });

    expect(trackContactSubmission).toHaveBeenCalledWith({
      pathname: '/contact',
      surface: 'contact-page-form',
      source: 'website-contact',
      status: 'error'
    });
  });
});
