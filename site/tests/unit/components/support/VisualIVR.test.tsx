import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VisualIVR } from '@/components/support/VisualIVR';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Remove framer-motion specific props to avoid React warnings in logs
      const { initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@phosphor-icons/react', () => ({
  ArrowRight: () => <span data-testid="ArrowRight" />,
  ArrowLeft: () => <span data-testid="ArrowLeft" />,
  Phone: () => <span data-testid="Phone" />,
  User: () => <span data-testid="User" />,
  Info: () => <span data-testid="Info" />,
}));

describe('VisualIVR Component', () => {
  it('renders main menu initially', () => {
    render(<VisualIVR />);

    expect(screen.getByRole('heading', { level: 2, name: 'Main Menu' })).toBeInTheDocument();
    expect(screen.getByText('Sales & Product Requests')).toBeInTheDocument();
    expect(screen.getByText('Customer Support')).toBeInTheDocument();
    expect(screen.getByText('General Inquiry')).toBeInTheDocument();
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('navigates to sales options and details, then goes back and resets', () => {
    render(<VisualIVR />);

    // Click on Sales
    fireEvent.click(screen.getByText('Sales & Product Requests'));

    expect(screen.getByRole('heading', { level: 2, name: 'Sales & Product Requests' })).toBeInTheDocument();
    expect(screen.getByText('Domestic (India)')).toBeInTheDocument();
    expect(screen.getByText('International Sales')).toBeInTheDocument();
    expect(screen.getByText('Find a Dealer')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();

    // Click on Domestic (India)
    fireEvent.click(screen.getByText('Domestic (India)'));

    // Verification of the terminal action
    expect(screen.getByText('+91 124 403 1666')).toBeInTheDocument();
    expect(screen.getByText('sales@oando.co.in')).toBeInTheDocument();

    // Go back
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Domestic (India)')).toBeInTheDocument();

    // Start over / Reset
    fireEvent.click(screen.getByText('Start Over'));
    expect(screen.getByText('Sales & Product Requests')).toBeInTheDocument();
    expect(screen.queryByText('Start Over')).not.toBeInTheDocument();
  });

  it('navigates to customer support options and info action', () => {
    render(<VisualIVR />);

    // Click Customer Support
    fireEvent.click(screen.getByText('Customer Support'));

    // Click Order Status
    fireEvent.click(screen.getByText('Order Status'));

    expect(screen.getByText('Please have your order confirmation number ready.')).toBeInTheDocument();
  });

  it('navigates to general inquiry options and link action', () => {
    render(<VisualIVR />);

    // Click General Inquiry
    fireEvent.click(screen.getByText('General Inquiry'));

    // Click Careers
    fireEvent.click(screen.getByText('Careers'));

    expect(screen.getByText('/career')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Go to Page' });
    expect(link).toHaveAttribute('href', '/career');
  });
});
