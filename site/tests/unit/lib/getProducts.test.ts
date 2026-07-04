import { describe, it, expect, vi } from 'vitest';

// Mock server-only
vi.mock('server-only', () => ({}));

// Mock next/cache
vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn) => fn),
}));

// Mock catalogTree
vi.mock('@/lib/catalog/catalogTree', () => ({
  buildCatalogLive: vi.fn().mockResolvedValue([{ id: 'cat1', name: 'Category 1' }]),
}));

// Mock sources
vi.mock('@/lib/catalog/sources', () => ({
  fetchAllProductsLive: vi.fn().mockResolvedValue([{ id: 'prod1', name: 'Product 1' }]),
  fetchCategoryIdsLive: vi.fn().mockResolvedValue(['cat1', 'cat2']),
  fetchProductByUrlKeyLive: vi.fn().mockResolvedValue({ id: 'prod1', name: 'Product 1' }),
  fetchProductsByCategoryLive: vi.fn().mockResolvedValue([{ id: 'prod1', name: 'Product 1' }]),
}));

describe('getProducts', () => {
  it('should export all catalog functions and resolve mocked values', async () => {
    // Import from target file site/lib/getProducts.ts
    const getProductsModule = await import('../../../lib/getProducts');

    expect(getProductsModule.getProducts).toBeDefined();
    expect(getProductsModule.getProductsFresh).toBeDefined();
    expect(getProductsModule.getProductsByCategory).toBeDefined();
    expect(getProductsModule.getProductByUrlKey).toBeDefined();
    expect(getProductsModule.getProductBySlug).toBeDefined();
    expect(getProductsModule.getCatalog).toBeDefined();
    expect(getProductsModule.getCategoryIds).toBeDefined();

    // Call and verify
    await expect(getProductsModule.getProducts()).resolves.toEqual([{ id: 'prod1', name: 'Product 1' }]);
    await expect(getProductsModule.getProductsFresh()).resolves.toEqual([{ id: 'prod1', name: 'Product 1' }]);
    await expect(getProductsModule.getProductsByCategory('cat1')).resolves.toEqual([{ id: 'prod1', name: 'Product 1' }]);
    await expect(getProductsModule.getProductByUrlKey('prod-slug')).resolves.toEqual({ id: 'prod1', name: 'Product 1' });
    await expect(getProductsModule.getProductBySlug('prod-slug')).resolves.toEqual({ id: 'prod1', name: 'Product 1' });
    await expect(getProductsModule.getCatalog()).resolves.toEqual([{ id: 'cat1', name: 'Category 1' }]);
    await expect(getProductsModule.getCategoryIds()).resolves.toEqual(['cat1', 'cat2']);
  });
});
