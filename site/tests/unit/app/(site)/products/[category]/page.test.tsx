import { describe, it, expect, vi, beforeEach } from 'vitest';
import CategoryPage, { generateMetadata, generateStaticParams } from '@/app/(site)/products/[category]/page';
import { notFound, redirect } from 'next/navigation';
import { fetchCategoryIdsLive } from '@/lib/catalog/sources';
import { getCatalog } from '@/lib/catalog/site/getProducts';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

// Mock seo builder
vi.mock('@/features/site/data/seo', () => ({
  buildPageMetadata: (_base: string, opts: any) => ({
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
  }),
}));

// Mock category helpers
vi.mock('@/lib/catalog/site/categories', () => ({
  Catalog_CATEGORY_ORDER: ['seating', 'desks'],
  normalizeRequestedCategoryId: (id: string) => {
    if (id === 'SEATING') return 'seating';
    if (id === 'invalid') return null;
    return id;
  },
  buildRequestedCategoryCatalog: (catalog: any) => catalog,
  getCatalogCategoryLabel: (id: string, def: string) => `Label for ${id} (${def})`,
  getCatalogCategoryDescription: (id: string, def: string) => `Desc for ${id} (${def})`,
}));

// Mock getCatalog
vi.mock('@/lib/catalog/site/getProducts', () => ({
  getCatalog: vi.fn(async () => [
    { id: 'seating', name: 'Chairs', description: 'Comfortable chairs' },
  ]),
}));

// Mock supabase retry and db
vi.mock('@/lib/catalog/sources', () => ({
  fetchCategoryIdsLive: vi.fn(),
}));

// Mock siteUrl
vi.mock('@/lib/siteUrl', () => ({
  SITE_URL: 'http://localhost:3000',
}));

// Mock CategoryPageView
vi.mock('@/app/(site)/products/[category]/CategoryPageView', () => ({
  CategoryPageView: ({ categoryId }: any) => (
    <div data-testid="category-page-view" data-id={categoryId}>
      Category Page View
    </div>
  ),
}));

describe('Category Page Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMetadata', () => {
    it('hard-404s unknown categories instead of soft empty metadata', async () => {
      await expect(
        generateMetadata({ params: Promise.resolve({ category: 'non-existent' }) }),
      ).rejects.toThrow('NOT_FOUND');
      expect(notFound).toHaveBeenCalled();
    });

    it('returns noindex robots when catalog is offline/empty', async () => {
      vi.mocked(getCatalog).mockResolvedValueOnce([]);
      const meta = await generateMetadata({ params: Promise.resolve({ category: 'seating' }) });
      expect(meta).toEqual({ robots: { index: false, follow: false } });
      expect(notFound).not.toHaveBeenCalled();
    });

    it('returns built page metadata if category exists', async () => {
      const meta = await generateMetadata({ params: Promise.resolve({ category: 'seating' }) });
      expect(meta).toEqual({
        title: 'Label for seating (Chairs)',
        description: 'Desc for seating (Comfortable chairs) Browse our full range of label for seating (chairs) for practical office planning and delivery.',
        alternates: { canonical: '/products/seating' },
      });
    });
  });

  describe('generateStaticParams', () => {
    it('returns combined static categories', async () => {
      (fetchCategoryIdsLive as any).mockResolvedValue(['oando-tables']);

      const params = await generateStaticParams();
      expect(params).toContainEqual({ category: 'seating' });
      expect(params).toContainEqual({ category: 'desks' });
      expect(params).toContainEqual({ category: 'oando-tables' });
    });
  });

  describe('CategoryPage default component', () => {
    it('triggers notFound() if category is invalid', async () => {
      await expect(
        CategoryPage({ params: Promise.resolve({ category: 'invalid' }) }),
      ).rejects.toThrow('NOT_FOUND');
      expect(notFound).toHaveBeenCalled();
    });

    it('redirects if requested categoryId needs normalization', async () => {
      await expect(
        CategoryPage({ params: Promise.resolve({ category: 'SEATING' }) }),
      ).rejects.toThrow('REDIRECT:/products/seating');
      expect(redirect).toHaveBeenCalledWith('/products/seating');
    });

    it('renders CategoryPageView if category is valid', async () => {
      const element = await CategoryPage({ params: Promise.resolve({ category: 'seating' }) });
      expect(element).toBeDefined();
    });
  });
});
