import { describe, it, expect, vi } from 'vitest';
import sitemap from '@/app/(site)/sitemap';
import * as getProducts from '@/features/catalog/getProducts';
import * as categories from '@/features/catalog/categories';

vi.mock('@/features/catalog/getProducts', () => ({
  getCatalog: vi.fn(),
}));

vi.mock('@/features/catalog/categories', () => ({
  buildRequestedCategoryCatalog: vi.fn(),
}));

describe('sitemap.ts', () => {
  it('returns sitemap when catalog fetch succeeds', async () => {
    vi.spyOn(getProducts, 'getCatalog').mockResolvedValue([]);
    vi.spyOn(categories, 'buildRequestedCategoryCatalog').mockReturnValue([
      { id: 'cat1', series: [{ products: [{ id: 'p1', slug: 'slug1' }, { id: 'p2' }] }] }
    ]);
    
    const result = await sitemap();
    expect(result.some(r => r.url.includes('slug1'))).toBe(true);
    expect(result.some(r => r.url.includes('p2'))).toBe(true);
  });

  it('returns basic sitemap when catalog fetch fails', async () => {
    vi.spyOn(getProducts, 'getCatalog').mockRejectedValue(new Error('fail'));
    
    const result = await sitemap();
    expect(result.length).toBeGreaterThan(0);
  });
});