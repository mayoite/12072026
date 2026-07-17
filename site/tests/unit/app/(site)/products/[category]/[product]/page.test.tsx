import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProductPage, { generateMetadata, generateStaticParams } from '@/app/(site)/products/[category]/[product]/page';
import { resolveProductByUrlKey } from '@/lib/productSlugResolver';
import { notFound } from 'next/navigation';

// Mock navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

// Mock ProductViewer
vi.mock('@/app/(site)/products/[category]/[product]/ProductViewer', () => ({
  ProductViewer: ({ product, categoryId }: any) => (
    <div data-testid="product-viewer" data-product-id={product.id} data-category-id={categoryId}>
      Product Viewer
    </div>
  ),
}));

// Mock DB/Platform
vi.mock('@/platform/drizzle/productsDb', () => ({
  supabase: {
    from: () => ({
      select: () => Promise.resolve({ data: [] }),
    }),
  },
}));

// Mock product slug resolver
vi.mock('@/lib/productSlugResolver', () => ({
  resolveProductByUrlKey: vi.fn(),
}));

// Mock product data tables
vi.mock('@/lib/productDataTables', () => ({
  fetchProductSpecsMap: vi.fn(async () => new Map()),
  fetchProductImagesMap: vi.fn(async () => new Map()),
}));

// Mock seo utilities — mirror absolute title shape from buildPageMetadata
const buildProductJsonLdMock = vi.fn(
  (_base: string, input: {
    name: string;
    description: string;
    url: string;
    image: string | readonly string[];
    sku?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    ...(input.sku ? { sku: input.sku } : {}),
  }),
);

vi.mock('@/features/site/data/seo', () => ({
  buildBreadcrumbJsonLd: () => ({ '@type': 'BreadcrumbList' }),
  buildPageMetadata: (_base: string, opts: { title: string; description: string }) => ({
    title: { absolute: `${opts.title} | One&Only` },
    description: opts.description,
  }),
  buildProductJsonLd: (...args: unknown[]) =>
    buildProductJsonLdMock(...(args as [string, {
      name: string;
      description: string;
      url: string;
      image: string | readonly string[];
      sku?: string;
    }])),
}));

// Mock helper assets
vi.mock('@/lib/assetPaths', () => ({
  normalizeAssetPath: (x: any) => x,
  normalizeAssetList: (x: any) => x || [],
}));

vi.mock('@/lib/security/sanitize', () => ({
  sanitizeJsonForScript: (x: any) => JSON.stringify(x),
}));

vi.mock('@/lib/siteUrl', () => ({
  SITE_URL: 'http://localhost:3000',
}));

vi.mock('@/features/site/data/routeCopy', () => ({
  PDP_ROUTE_COPY: {
    productBrand: 'Oando',
    fallbackDescription: 'Check out {name}',
  },
}));

vi.mock('@/lib/catalog/site/categories', () => ({
  classifyToRequestedCategory: () => 'seating',
  getCatalogCategoryLabel: (id: string) => id,
  normalizeRequestedCategoryId: (id: string) => id,
}));

vi.mock('@/lib/catalog/productStaticParams', () => ({
  buildProductStaticParams: vi.fn(async () => []),
}));

describe('ProductPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateStaticParams', () => {
    it('calls buildProductStaticParams', async () => {
      await generateStaticParams();
    });
  });

  describe('generateMetadata', () => {
    it('hard-404s unknown products instead of soft empty metadata', async () => {
      (resolveProductByUrlKey as any).mockResolvedValue({ row: null });
      await expect(
        generateMetadata({
          params: Promise.resolve({ category: 'seating', product: 'some-product' }),
        }),
      ).rejects.toThrow('NOT_FOUND');
      expect(notFound).toHaveBeenCalled();
    });

    it('returns structured metadata if product resolved', async () => {
      (resolveProductByUrlKey as any).mockResolvedValue({
        row: {
          id: '1',
          slug: 'some-product',
          name: 'Super Chair',
          description: 'A great chair',
          category_id: 'seating',
        },
      });
      const meta = await generateMetadata({
        params: Promise.resolve({ category: 'seating', product: 'some-product' }),
      });
      expect(meta.title).toEqual({ absolute: 'Super Chair | One&Only' });
      expect(meta.description).toContain('A great chair');
    });
  });

  describe('ProductPage Component', () => {
    it('triggers notFound() if product resolution returns no row', async () => {
      (resolveProductByUrlKey as any).mockResolvedValue({ row: null });

      const pageElement = await ProductPage({
        params: Promise.resolve({ category: 'seating', product: 'some-product' }),
      });

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        render(pageElement);
        await waitFor(() => expect(notFound).toHaveBeenCalled());
      } finally {
        consoleError.mockRestore();
      }
    });

    it('renders ProductViewer if product resolution is successful', async () => {
      const mockProduct = {
        id: 'p-1',
        slug: 'super-chair',
        name: 'Super Chair',
        description: 'Test chair',
        category_id: 'seating',
        images: ['/image.jpg'],
        flagship_image: '/flagship.jpg',
      };
      (resolveProductByUrlKey as any).mockResolvedValue({ row: mockProduct });

      const pageElement = await ProductPage({
        params: Promise.resolve({ category: 'seating', product: 'super-chair' }),
      });

      expect(pageElement).toBeDefined();
      expect(pageElement.props.children.props.categoryId).toBe('seating');
      expect(pageElement.props.children.props.productUrlKey).toBe('super-chair');
    });

    it('emits product JSON-LD from visible fields only — no offers or InStock', async () => {
      const mockProduct = {
        id: 'p-1',
        slug: 'super-chair',
        name: 'Super Chair',
        description: 'Visible product description',
        category_id: 'seating',
        images: ['/image.jpg'],
        flagship_image: '/flagship.jpg',
        // Demo numeric price must never become commercial JSON-LD authority.
        price: 19999,
        metadata: { priceRange: 'mid' },
      };
      (resolveProductByUrlKey as any).mockResolvedValue({ row: mockProduct });

      const pageElement = await ProductPage({
        params: Promise.resolve({ category: 'seating', product: 'super-chair' }),
      });
      const productContent = pageElement.props.children;
      const contentElement = await productContent.type(productContent.props);
      const { container } = render(contentElement);

      expect(buildProductJsonLdMock).toHaveBeenCalled();
      const visibleInput = buildProductJsonLdMock.mock.calls[0]?.[1];
      expect(visibleInput).toMatchObject({
        name: 'Super Chair',
        description: 'Visible product description',
      });
      expect(visibleInput).not.toHaveProperty('price');
      expect(visibleInput).not.toHaveProperty('offers');
      expect(visibleInput).not.toHaveProperty('availability');

      const productScript = Array.from(
        container.querySelectorAll('script[type="application/ld+json"]'),
      )
        .map((node) => node.innerHTML)
        .find((html) => html.includes('"@type":"Product"') || html.includes('"@type": "Product"'));
      expect(productScript).toBeTruthy();
      const parsed = JSON.parse(productScript as string) as Record<string, unknown>;
      expect(parsed['@type']).toBe('Product');
      expect(parsed.name).toBe('Super Chair');
      expect(parsed.description).toBe('Visible product description');
      expect(parsed).not.toHaveProperty('offers');
      expect(JSON.stringify(parsed)).not.toMatch(/InStock|price|19999/i);
      expect(screen.getByTestId('product-viewer')).toBeInTheDocument();
    });
  });
});
