import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Newsletter } from '@/components/shared/Newsletter';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
}));

// Mock Button
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('Newsletter Component', () => {
  it('renders all headings, inputs, and buttons correctly', () => {
    render(<Newsletter />);

    // Verify main headings
    expect(screen.getByText('Stay inspired.')).toBeInTheDocument();
    expect(screen.getByText('Subscribe to our newsletter.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Subscribe to receive updates on modern office concepts, product launches, and inspiring workspaces.'
      )
    ).toBeInTheDocument();

    // Verify form element
    const emailInput = screen.getByPlaceholderText('Your email address');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();

    const subscribeBtn = screen.getByRole('button', { name: /Subscribe/i });
    expect(subscribeBtn).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();

    // Privacy text
    expect(
      screen.getByText(/By subscribing, you agree to our Privacy Policy./i)
    ).toBeInTheDocument();
  });
});
