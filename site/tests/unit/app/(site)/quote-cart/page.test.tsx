import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuoteCartPage from '@/app/(site)/quote-cart/page';
import { expectHomeMarketingShell } from '@/tests/unit/app/(site)/_template.homepage.test';

// Mock Router/Link/Image
// Mock Lucide Icons
vi.mock('@phosphor-icons/react', () => ({
  Minus: () => <span data-testid="icon-minus" />,
  Plus: () => <span data-testid="icon-plus" />,
  Trash2: () => <span data-testid="icon-trash" />,
}));

// Mock store
const mockSetQty = vi.fn();
const mockRemoveItem = vi.fn();
const mockClearCart = vi.fn();
let mockItems: any[] = [];
let mockTotalQty = 0;

vi.mock('@/lib/store/quoteCart', () => ({
  useQuoteCart: (selector: any) =>
    selector({
      items: mockItems,
      totalQty: mockTotalQty,
      setQty: mockSetQty,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
    }),
}));

vi.mock('@/lib/site-data/routeCopy', () => ({
  QUOTE_CART_ROUTE_COPY: {
    kicker: 'Your shortlist',
    title: 'Quote Cart',
    description: 'Manage your shortlisted items.',
    browseCta: 'Browse Products',
    compareCta: 'Compare Items',
    resourceDeskCta: 'Resource Desk',
    clearCta: 'Clear Cart',
    emptyTitle: 'Cart is empty',
    emptyDescription: 'Shortlist some products first.',
    emptyPrimaryCta: 'Shop Chairs',
    emptySecondaryCta: 'Downloads',
    removeCta: 'Remove',
    summaryTitle: 'Shortlist Summary',
    summaryDescription: 'Review and request final pricing.',
    summaryQuantityLabel: 'Total Quantity',
    summaryProductsLabel: 'Unique Products',
    summaryCompareHint: 'Compare features side-by-side.',
    summaryDeskHint: 'Need layout or spec help?',
    planningCta: 'Planner Support',
    primaryCta: 'Request Quote',
  },
}));

vi.mock('@/lib/assetPaths', () => ({
  normalizeAssetPath: (x: any) => x,
}));

describe('QuoteCartPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockItems = [];
    mockTotalQty = 0;
  });

  it('renders empty cart view when no items exist', () => {
    const { container } = render(<QuoteCartPage />);

    expectHomeMarketingShell(container);
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Shortlist some products first.')).toBeInTheDocument();
    expect(screen.getByText('Shop Chairs')).toBeInTheDocument();
  });

  it('renders cart items and summary panel when items are present', () => {
    mockItems = [
      { id: '1', name: 'Task Chair', qty: 2, image: '/chair.jpg', href: '/products/seating/task-chair' },
      { id: '2', name: 'Executive Desk', qty: 1, image: '/desk.jpg', href: '/products/desks/exec-desk' },
    ];
    mockTotalQty = 3;

    render(<QuoteCartPage />);

    expect(screen.getByText('Task Chair')).toBeInTheDocument();
    expect(screen.getByText('Executive Desk')).toBeInTheDocument();
    expect(screen.getByText('Unique Products:').closest('p')).toHaveTextContent('Unique Products: 2');
    expect(screen.getByText('Total Quantity:').closest('p')).toHaveTextContent('Total Quantity: 3');
  });

  it('handles item quantity modification and removal', () => {
    mockItems = [
      { id: '1', name: 'Task Chair', qty: 2, image: '/chair.jpg', href: '/products/seating/task-chair' },
    ];
    mockTotalQty = 2;

    render(<QuoteCartPage />);

    const decBtn = screen.getByRole('button', { name: /Decrease quantity for Task Chair/i });
    const incBtn = screen.getByRole('button', { name: /Increase quantity for Task Chair/i });
    const removeBtn = screen.getByRole('button', { name: /Remove/i });

    fireEvent.click(decBtn);
    expect(mockSetQty).toHaveBeenCalledWith('1', 1);

    fireEvent.click(incBtn);
    expect(mockSetQty).toHaveBeenCalledWith('1', 3);

    fireEvent.click(removeBtn);
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });

  it('handles clear cart action', () => {
    mockItems = [
      { id: '1', name: 'Task Chair', qty: 2, image: '/chair.jpg', href: '/products/seating/task-chair' },
    ];
    mockTotalQty = 2;

    render(<QuoteCartPage />);

    const clearBtn = screen.getByRole('button', { name: /Clear Cart/i });
    fireEvent.click(clearBtn);
    expect(mockClearCart).toHaveBeenCalled();
  });
});
