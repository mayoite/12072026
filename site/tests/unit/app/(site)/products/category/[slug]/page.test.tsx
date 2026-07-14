import { describe, it, expect, vi, beforeEach } from 'vitest';
import LegacyCategorySlugPage from '@/app/(site)/products/category/[slug]/page';
import { notFound } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock categories helpers
vi.mock('@/lib/catalog/site/categories', () => ({
  normalizeRequestedCategoryId: (slug: string) => {
    if (slug === 'valid-slug') return 'seating';
    return null;
  },
  buildRequestedCategoryCatalog: vi.fn(() => []),
  getCatalogCategoryLabel: vi.fn((id, name) => name || id),
  getCatalogCategoryDescription: vi.fn((id, desc) => desc || ''),
}));

// Mock CategoryPageView
vi.mock('@/app/(site)/products/[category]/CategoryPageView', () => ({
  CategoryPageView: ({ categoryId }: any) => (
    <div data-testid="category-page-view" data-id={categoryId}>
      Category Page View
    </div>
  ),
}));

describe('LegacyCategorySlugPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers notFound() if category slug is invalid', async () => {
    await LegacyCategorySlugPage({ params: Promise.resolve({ slug: 'invalid-slug' }) });
    expect(notFound).toHaveBeenCalled();
  });

  it('renders CategoryPageView if category slug is valid', async () => {
    const element = await LegacyCategorySlugPage({ params: Promise.resolve({ slug: 'valid-slug' }) });
    expect(element).toBeDefined();
  });
});
