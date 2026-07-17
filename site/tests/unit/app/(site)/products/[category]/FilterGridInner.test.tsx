import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedFilterGridInner } from '@/app/(site)/products/[category]/FilterGridInner';
import { useQuery } from '@tanstack/react-query';

// Mock router/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams('');

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/products/office-chairs',
  useSearchParams: () => mockSearchParams,
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// Mock Compare Store
vi.mock('@/lib/store/productCompare', () => ({
  useProductCompare: (selector: any) => selector({ items: [] }),
}));

// Mock Analytics
vi.mock('@/lib/analytics/siteEvents', () => ({
  trackSiteCtaClick: vi.fn(),
}));

// Mock icons
vi.mock('@phosphor-icons/react', () => ({
  Filter: () => <span data-testid="icon-filter" />,
  Funnel: () => <span data-testid="icon-filter" />,
  Search: () => <span data-testid="icon-search" />,
  MagnifyingGlass: () => <span data-testid="icon-search" />,
  SlidersHorizontal: () => <span data-testid="icon-sliders" />,
  FadersHorizontal: () => <span data-testid="icon-sliders" />,
  X: () => <span data-testid="icon-x" />,
}));

// Mock Next Link/Image
// Mock site components
vi.mock('@/components/products/CompareDock', () => ({
  CompareDock: () => <div data-testid="compare-dock">Compare Dock</div>,
}));

vi.mock('@/app/(site)/products/[category]/FilterGrid.components', () => ({
  AccordionSection: ({ title, children }: any) => (
    <div data-testid={`accordion-${title.toLowerCase()}`}>
      <h3>{title}</h3>
      {children}
    </div>
  ),
  CheckList: ({ options, selected, onToggle }: any) => (
    <div data-testid="mock-checklist">
      {options.map((opt: string) => (
        <button key={opt} data-testid={`toggle-${opt}`} onClick={() => onToggle(opt)}>
          {opt} {selected.includes(opt) ? '[selected]' : ''}
        </button>
      ))}
    </div>
  ),
  SustainabilityButtons: ({ _selected, onSelect }: any) => (
    <div data-testid="mock-sustainability">
      <button data-testid="eco-any" onClick={() => onSelect(null)}>Any</button>
      <button data-testid="eco-8" onClick={() => onSelect(8)}>8</button>
    </div>
  ),
  Toggle: ({ label, checked, onChange }: any) => (
    <button data-testid={`toggle-bool-${label.toLowerCase()}`} onClick={() => onChange(!checked)}>
      {label} {checked ? 'ON' : 'OFF'}
    </button>
  ),
  ProductCard: ({ product }: any) => (
    <div data-testid={`product-card-${product.id}`}>{product.name}</div>
  ),
  ActiveChips: ({ total, onClearAll }: any) => (
    <div data-testid="mock-chips">
      Total active: {total}
      <button data-testid="clear-all-chips" onClick={onClearAll}>Clear all</button>
    </div>
  ),
}));

vi.mock('@/app/(site)/products/[category]/FilterGrid.helpers', () => ({
  buildFallbackFacets: () => ({
    series: ['Aero', 'Zephyr'],
    subcategory: ['Task', 'Executive'],
    material: ['Mesh', 'Leather'],
    priceRange: ['budget', 'mid'],
    ecoMin: { min: 0, max: 10 },
    featureAvailability: {
      hasHeadrest: true,
      isHeightAdjustable: true,
      bifmaCertified: true,
      isStackable: true,
    },
  }),
  flattenCategoryProducts: (cat: any) => cat.products || [],
  getProductRouteKey: (p: any) => p.slug || p.id || '',
  useDebouncedValue: (val: any) => val,
}));

vi.mock('@/features/site/data/routeCopy', () => ({
  CATEGORY_ROUTE_COPY: {
    categoryKicker: 'Product category',
    browseAllCta: 'Browse all categories',
    resourceDeskCta: 'Open Resource Desk',
    compareIdleLabel: 'Select up to 4 products to compare',
    compareIdleLabelShort: 'Compare',
    compareActiveLabelShort: 'Compare ({count})',
    compareActiveLabel: 'Compare {count} selected',
    filterSummaryTitle: 'Filter the current category',
    filterSummaryDescription: 'Use filters',
    resultsSummaryLabel: '{shown} of {total} products',
    drawerResultsCta: 'View {count} results',
    drawerResultsHint: 'Filters update the current category only.',
    filterFallbackMessage: 'Live filter sync is temporarily unavailable.',
    emptyTitle: 'No products match this filter set',
    emptyDescription: 'Clear filters, adjust your search, or return to the full category list.',
    emptyCategoryTitle: 'No products are published in this category yet',
    emptyCategoryDescription:
      'This category has no published products right now. Browse other categories or contact us for current availability.',
    errorTitle: "We couldn't load this category",
    errorDescription: 'Something went wrong loading these products.',
    clearFiltersCta: 'Clear all',
  },
}));

describe('AdvancedFilterGridInner', () => {
  const dummyCategory = {
    name: 'Office Chairs',
    products: [
      { id: '1', slug: 'chair-1', name: 'Chair One', metadata: {} },
      { id: '2', slug: 'chair-2', name: 'Chair Two', metadata: {} },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams('');
    window.history.replaceState = vi.fn();
  });

  it('renders without error under loading state', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
      error: null,
    });

    render(<AdvancedFilterGridInner category={dummyCategory as any} categoryId="office-chairs" />);
    expect(screen.getByRole('heading', { name: 'Office Chairs' })).toBeInTheDocument();
  });

  it('renders fallback products if no query API data is loaded', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
    });

    render(<AdvancedFilterGridInner category={dummyCategory as any} categoryId="office-chairs" />);

    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
  });

  it('renders products returned from query API', () => {
    (useQuery as any).mockReturnValue({
      data: {
        products: [
          { id: '10', slug: 'api-chair', name: 'API Chair', metadata: {} },
        ],
        facets: {
          series: ['Aero'],
          subcategory: ['Task'],
          material: ['Mesh'],
          priceRange: ['mid'],
          ecoMin: { min: 0, max: 10 },
          featureAvailability: {
            hasHeadrest: true,
            isHeightAdjustable: true,
            bifmaCertified: true,
            isStackable: true,
          },
        },
        meta: {
          catalogTotal: 1,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
    });

    render(<AdvancedFilterGridInner category={dummyCategory as any} categoryId="office-chairs" />);

    expect(screen.getByTestId('product-card-10')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument();
  });

  it('shows honest empty-category state when no products are published', () => {
    (useQuery as any).mockReturnValue({
      data: {
        products: [],
        facets: {
          series: [],
          subcategory: [],
          material: [],
          priceRange: [],
          ecoMin: { min: 0, max: 10 },
          featureAvailability: {
            hasHeadrest: false,
            isHeightAdjustable: false,
            bifmaCertified: false,
            isStackable: false,
          },
        },
        meta: { catalogTotal: 0 },
      },
      isLoading: false,
      isFetching: false,
      error: null,
    });

    const emptyCategory = { name: 'Empty Series', products: [] };
    render(
      <AdvancedFilterGridInner
        category={emptyCategory as any}
        categoryId="empty-series"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'No products are published in this category yet' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no published products right now/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument();
  });

  it('shows honest filter-empty state with clear action when filters exclude all products', () => {
    mockSearchParams = new URLSearchParams('q=zzz-no-match');
    (useQuery as any).mockReturnValue({
      data: {
        products: [],
        facets: {
          series: [],
          subcategory: [],
          material: [],
          priceRange: [],
          ecoMin: { min: 0, max: 10 },
          featureAvailability: {
            hasHeadrest: false,
            isHeightAdjustable: false,
            bifmaCertified: false,
            isStackable: false,
          },
        },
        meta: { catalogTotal: 2 },
      },
      isLoading: false,
      isFetching: false,
      error: null,
    });

    render(
      <AdvancedFilterGridInner
        category={dummyCategory as any}
        categoryId="office-chairs"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'No products match this filter set' }),
    ).toBeInTheDocument();
    // Chip bar and empty-state both expose clear actions.
    expect(screen.getAllByRole('button', { name: 'Clear all' }).length).toBeGreaterThanOrEqual(1);
  });

  it('shows honest error state when the filter request fails and no products remain', () => {
    mockSearchParams = new URLSearchParams('q=fail');
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: new Error('Filter request failed: 500'),
    });

    const emptyCategory = { name: 'Broken', products: [] };
    render(
      <AdvancedFilterGridInner
        category={emptyCategory as any}
        categoryId="broken"
      />,
    );

    expect(
      screen.getByRole('heading', { name: "We couldn't load this category" }),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('handles search input change and triggers navigation updates', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
    });

    render(<AdvancedFilterGridInner category={dummyCategory as any} categoryId="office-chairs" />);

    const searchInput = screen.getByPlaceholderText('Search products, materials, or series');
    fireEvent.change(searchInput, { target: { value: 'ergonomic' } });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('q=ergonomic'),
      expect.any(Object)
    );
  });

  it('handles toggle of boolean attributes', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
    });

    render(<AdvancedFilterGridInner category={dummyCategory as any} categoryId="office-chairs" />);

    const headrestToggle = screen.getByTestId('toggle-bool-with headrest');
    fireEvent.click(headrestToggle);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('headrest=1'),
      expect.any(Object)
    );
  });
});
