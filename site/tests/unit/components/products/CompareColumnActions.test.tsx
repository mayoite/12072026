import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompareColumnActions } from '@/components/products/CompareColumnActions';
import { trackQuoteCartAdded } from '@/lib/analytics/siteEvents';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
}));

// Mock navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/products/compare',
}));

// Mock analytics
vi.mock('@/lib/analytics/siteEvents', () => ({
  trackQuoteCartAdded: vi.fn(),
}));

// Mock QuoteCart store
const mockAddItem = vi.fn();
vi.mock('@/lib/store/quoteCart', () => ({
  useQuoteCart: (selector: any) => selector({ addItem: mockAddItem }),
}));

describe('CompareColumnActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const props = {
    productId: '123',
    productName: 'Super Ergonomic Chair',
    productHref: '/products/seating/super-chair',
    image: '/images/super-chair.webp',
    viewLabel: 'View Details',
    addLabel: 'Add to Quote',
  };

  it('renders action links and buttons correctly', () => {
    render(<CompareColumnActions {...props} />);

    // View Details link
    const viewLink = screen.getByRole('link', { name: 'View Details' });
    expect(viewLink).toHaveAttribute('href', '/products/seating/super-chair');

    // Add to Quote button
    const addButton = screen.getByRole('button', { name: /Add to Quote Super Ergonomic Chair/i });
    expect(addButton).toBeInTheDocument();
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
  });

  it('calls trackQuoteCartAdded and addItem when Add button is clicked', () => {
    render(<CompareColumnActions {...props} />);

    const addButton = screen.getByRole('button', { name: /Add to Quote Super Ergonomic/i });
    fireEvent.click(addButton);

    // Verify analytics tracking
    expect(trackQuoteCartAdded).toHaveBeenCalledWith({
      pathname: '/products/compare',
      surface: 'compare-column-actions',
      productId: '123',
    });

    // Verify item was added to the cart
    expect(mockAddItem).toHaveBeenCalledWith({
      id: 'quote-123',
      name: 'Super Ergonomic Chair',
      image: '/images/super-chair.webp',
      href: '/products/seating/super-chair',
      qty: 1,
    });
  });
});
