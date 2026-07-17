import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompareDock } from '@/components/products/CompareDock';
import { trackSiteCtaClick } from '@/lib/analytics/siteEvents';

// Mock @phosphor-icons/react
vi.mock('@phosphor-icons/react', () => ({
  GitDiff: () => <div data-testid="compare-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
}));

// Mock navigation path
let mockPathname = '/products/seating';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// Mock analytics
vi.mock('@/lib/analytics/siteEvents', () => ({
  trackSiteCtaClick: vi.fn(),
}));

// Mock productCompare store
let mockItems: any[] = [];
const mockClear = vi.fn();
vi.mock('@/lib/store/productCompare', () => ({
  MAX_COMPARE_ITEMS: 3,
  useProductCompare: (selector: any) =>
    selector({
      items: mockItems,
      clear: mockClear,
    }),
}));

describe('CompareDock Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/products/seating';
    mockItems = [];
  });

  it('returns null if there are no items in compare store', () => {
    mockItems = [];
    const { container } = render(<CompareDock />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null if the current pathname is /compare', () => {
    mockPathname = '/compare';
    mockItems = [
      { productUrlKey: 'chair-a', name: 'Chair A' },
      { productUrlKey: 'chair-b', name: 'Chair B' },
    ];
    const { container } = render(<CompareDock />);
    expect(container.firstChild).toBeNull();
  });

  it('renders dock correctly when items exist and not on /compare path', () => {
    mockItems = [
      { productUrlKey: 'chair-a', name: 'Chair A' },
      { productUrlKey: 'chair-b', name: 'Chair B' },
    ];

    render(<CompareDock />);

    // Verify copy
    expect(screen.getByText('Compare products (2/3)')).toBeInTheDocument();
    expect(screen.getByText('Chair A | Chair B')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Product comparison shortlist' }),
    ).toBeInTheDocument();

    // Verify buttons (aria-labels preferred for accessible names)
    expect(
      screen.getByRole('button', { name: /Clear comparison shortlist/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Compare 2 selected office furniture products/i }),
    ).toBeInTheDocument();
  });

  it('calls clear when clear button is clicked', () => {
    mockItems = [{ productUrlKey: 'chair-a', name: 'Chair A' }];

    render(<CompareDock />);

    const clearButton = screen.getByRole('button', {
      name: /Clear comparison shortlist/i,
    });
    fireEvent.click(clearButton);

    expect(mockClear).toHaveBeenCalled();
  });

  it('tracks CTA click and contains correct compare query link', () => {
    mockItems = [
      { productUrlKey: 'chair-a', name: 'Chair A' },
      { productUrlKey: 'chair-b', name: 'Chair B' },
    ];

    render(<CompareDock />);

    const compareLink = screen.getByRole('link', {
      name: /Compare 2 selected office furniture products/i,
    });
    expect(compareLink).toHaveAttribute('href', '/compare?items=chair-a%2Cchair-b');

    fireEvent.click(compareLink);

    expect(trackSiteCtaClick).toHaveBeenCalledWith({
      href: '/compare?items=chair-a%2Cchair-b',
      label: 'Compare now',
      pathname: '/products/seating',
      surface: 'compare-dock',
    });
  });

  it('handles empty/falsy url keys gracefully when building the query string', () => {
    mockItems = [
      { productUrlKey: '', name: 'Chair A' },
      { productUrlKey: 'chair-b', name: 'Chair B' },
    ];

    render(<CompareDock />);

    const compareLink = screen.getByRole('link', {
      name: /Compare 2 selected office furniture products/i,
    });
    expect(compareLink).toHaveAttribute('href', '/compare?items=chair-b');
  });
});

