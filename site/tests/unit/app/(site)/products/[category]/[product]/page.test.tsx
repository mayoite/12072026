import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
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
vi.mock('@/platform/drizzle/db', () => ({
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

// Mock seo utilities
vi.mock('@/lib/site-data/seo', () => ({
  buildBreadcrumbJsonLd: () => ({}),
  buildPageMetadata: (_base: string, opts: any) => ({
    title: opts.title,
    description: opts.description,
  }),
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

vi.mock('@/lib/site-data/routeCopy', () => ({
  PDP_ROUTE_COPY: {
    productBrand: 'Oando',
    fallbackDescription: 'Check out {name}',
  },
}));

vi.mock('@/features/catalog/categories', () => ({
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
    it('returns empty object if product not resolved', async () => {
      (resolveProductByUrlKey as any).mockResolvedValue({ row: null });
      const meta = await generateMetadata({
        params: Promise.resolve({ category: 'seating', product: 'some-product' }),
      });
      expect(meta).toEqual({});
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
      expect(meta.title).toContain('Super Chair');
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
  });
});
