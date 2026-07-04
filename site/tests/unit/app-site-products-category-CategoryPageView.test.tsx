import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryPageView } from '@/app/(site)/products/[category]/CategoryPageView';
import { notFound } from 'next/navigation';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NOT_FOUND'); }),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/products/cat1'),
  redirect: vi.fn(),
}));

vi.mock('@/features/catalog/categories', () => ({
  buildRequestedCategoryCatalog: vi.fn(),
  getCatalogCategoryDescription: vi.fn((id, desc) => desc || 'mock desc'),
  getCatalogCategoryLabel: vi.fn((id, name) => name || 'mock name'),
}));

vi.mock('@/features/catalog/getProducts', () => ({
  getCatalog: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/site-data/seo', () => ({
  buildPageJsonLd: vi.fn(() => ({ '@type': 'CollectionPage' })),
  buildBreadcrumbJsonLd: vi.fn(() => ({ '@type': 'BreadcrumbList' })),
}));

vi.mock('@/lib/security/sanitize', () => ({
  sanitizeJsonForScript: vi.fn((data) => JSON.stringify(data)),
}));

vi.mock('@/app/(site)/products/[category]/FilterGrid', () => ({
  FilterGrid: () => <div data-testid="filter-grid" />,
}));

vi.mock('@/lib/site-data/routeCopy', () => ({
  CATEGORY_ROUTE_COPY: {
    offlineTitle: 'Offline',
    offlineDescription: 'Offline description',
    metadataSuffix: 'Suffix',
  },
}));

import { buildRequestedCategoryCatalog } from '@/features/catalog/categories';

describe('CategoryPageView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders offline state if catalog is empty', async () => {
    vi.mocked(buildRequestedCategoryCatalog).mockReturnValue([]);

    const jsx = await CategoryPageView({ categoryId: 'cat1' });
    render(jsx);

    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.getByText('Offline description')).toBeInTheDocument();
  });

  it('calls notFound if category is not found in catalog', async () => {
    vi.mocked(buildRequestedCategoryCatalog).mockReturnValue([{ id: 'other-cat' } as any]);

    await expect(CategoryPageView({ categoryId: 'cat1' })).rejects.toThrow('NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('renders FilterGrid and scripts if category is found', async () => {
    vi.mocked(buildRequestedCategoryCatalog).mockReturnValue([
      { id: 'cat1', name: 'Cat 1', description: 'Desc 1' } as any,
    ]);

    const jsx = await CategoryPageView({ categoryId: 'cat1' });
    const { container } = render(jsx);

    expect(screen.getByTestId('filter-grid')).toBeInTheDocument();

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);
  });
});
