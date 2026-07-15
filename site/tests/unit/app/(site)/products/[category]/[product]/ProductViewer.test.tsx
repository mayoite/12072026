import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ProductViewer, sanitizeDisplayText, escapeHtmlAttribute } from '@/app/(site)/products/[category]/[product]/ProductViewer';
import type { CompatProduct } from '@/lib/catalog/site/getProducts';

// Mocks
vi.mock('next/navigation', () => ({
  usePathname: () => '/products/seating/super-chair',
  useSearchParams: () => new URLSearchParams(''),
}));

vi.mock('@/components/Reviews', () => ({
  Reviews: ({ productId }: any) => <div data-testid="mock-reviews">Reviews for {productId}</div>,
}));

vi.mock('@/components/ProductGallery', () => ({
  ProductGallery: ({ images, productName }: any) => (
    <div data-testid="mock-gallery">
      Gallery for {productName} - {images.length} images
    </div>
  ),
}));

vi.mock('@/components/products/CompareDock', () => ({
  CompareDock: () => <div data-testid="mock-compare-dock">Compare Dock</div>,
}));

vi.mock('@/lib/ui/loadModelViewer', () => ({
  loadModelViewer: vi.fn(async () => {}),
}));

vi.mock('@/lib/ui/selfHostedAssetUrls', () => ({
  MODEL_VIEWER_DRACO: { localDir: '/draco' },
  MODEL_VIEWER_KTX2: { localDir: '/ktx2' },
  resolveModelViewerDecoderUrls: vi.fn(async () => ({ dracoDir: '/draco', ktx2Dir: '/ktx2' })),
}));

const mockAddItem = vi.fn();
const mockToggleItem = vi.fn();
let mockCompareItems: any[] = [];

vi.mock('@/lib/store/productCompare', () => ({
  useProductCompare: (selector: any) =>
    selector({
      items: mockCompareItems,
      toggleItem: mockToggleItem,
    }),
}));

vi.mock('@/lib/store/quoteCart', () => ({
  useQuoteCart: (selector: any) =>
    selector({
      addItem: mockAddItem,
    }),
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackCompareToggled: vi.fn(),
  trackQuoteCartAdded: vi.fn(),
  trackSiteCtaClick: vi.fn(),
}));

vi.mock('@/features/site/data/routeCopy', () => ({
  PDP_ROUTE_COPY: {
    productBrand: 'Oando',
    fallbackDescription: 'Fallback',
    ctas: {
      addToQuote: 'Add to Quote',
      addToCompare: 'Add to Compare',
      addedToCompare: 'Added to Compare',
      requestQuote: 'Request Quote',
      designInPlanner: 'Design in Planner',
      planning: 'Planning',
      resourceDesk: 'Resource Desk',
      copyLink: 'Copy Link',
      view3d: 'View in 3D',
      viewImage: 'View Image',
      modelUnavailable: 'Model Unavailable',
      modelChecking: 'Checking Model',
      specifications: 'Specifications',
      keyFeatures: 'Key Features',
      technicalDetails: 'Technical Details',
      returnToResults: 'Return to Results',
      returnToCategory: 'Return to Category',
      configuration: 'Configuration',
    },
    summary: {
      bestFor: 'Best For',
      dimensions: 'Dimensions',
      materials: 'Materials',
      useCases: 'Use Cases',
    },
  },
}));

describe('ProductViewer Helper Functions', () => {
  it('sanitizeDisplayText normalizes text', () => {
    expect(sanitizeDisplayText('raw   text')).toBe('raw text');
    expect(sanitizeDisplayText('â€”')).toBe('—');
  });

  it('escapeHtmlAttribute escapes HTML characters', () => {
    expect(escapeHtmlAttribute('<script>')).toBe('&lt;script&gt;');
  });
});

describe('ProductViewer Component', () => {
  const dummyProduct: CompatProduct = {
    id: 'prod-1',
    slug: 'super-chair',
    name: 'Super Chair',
    description: 'A great chair for work.',
    flagshipImage: '/flagship.jpg',
    images: ['/image1.jpg'],
    threeDModelUrl: '/model.glb',
    sceneImages: ['/scene.jpg'],
    variants: [
      {
        id: 'var-1',
        variantName: 'Mesh Red',
        galleryImages: ['/mesh-red.jpg'],
        threeDModelUrl: '/model-red.glb',
      },
    ],
    detailedInfo: {
      overview: 'Full overview detail.',
      features: ['Adjustable Arms', 'Lumbar Support'],
      dimensions: 'W60 H100',
      materials: ['Mesh', 'Nylon'],
    },
    metadata: {
      sustainabilityScore: 9,
      bifmaCertified: true,
      warrantyYears: 5,
    },
    altText: 'Alt Text Super Chair',
    specs: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCompareItems = [];
    global.fetch = vi.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200 }));
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
      writable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
    });
  });

  async function renderSettledViewer() {
    render(
      <ProductViewer
        product={dummyProduct}
        categoryRoute="/products/seating"
        categoryName="Seating"
        productRoute="/products/seating/super-chair"
      />
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/model-red.glb', { method: 'HEAD' });
    });
    await act(async () => {});
  }

  it('renders product details correctly', async () => {
    await renderSettledViewer();

    expect(screen.getByRole('heading', { level: 1, name: 'Super Chair' })).toBeInTheDocument();
    const seatingLinks = screen.getAllByRole('link', { name: 'Seating' });
    expect(seatingLinks).toHaveLength(2);
    seatingLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/products/seating');
    });
    expect(screen.getByTestId('mock-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('mock-reviews')).toBeInTheDocument();
    expect(screen.getByTestId('mock-compare-dock')).toBeInTheDocument();
  });

  it('handles add to quote', async () => {
    await renderSettledViewer();

    const btn = screen.getByRole('button', { name: /Add to Quote/i });
    fireEvent.click(btn);
    expect(mockAddItem).toHaveBeenCalled();
  });

  it('handles compare toggle', async () => {
    await renderSettledViewer();

    const btn = screen.getByRole('button', { name: /Add to Compare/i });
    fireEvent.click(btn);
    expect(mockToggleItem).toHaveBeenCalled();
  });

  it('handles clipboard copy', async () => {
    await renderSettledViewer();

    const btn = screen.getByRole('button', { name: /Copy Link/i });
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('allows switching variant finish option', async () => {
    await renderSettledViewer();

    const variantBtn = screen.getByRole('button', { name: /Select Mesh Red variant/i });
    fireEvent.click(variantBtn);
    expect(screen.getByText('Selected:')).toBeInTheDocument();
    expect(screen.getAllByText('Mesh Red').length).toBeGreaterThan(0);
  });
});
