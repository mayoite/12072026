import { describe, it, expect, vi } from 'vitest';
import sitemap from '@/app/sitemap';
import * as getProducts from '@/lib/catalog/site/getProducts';
import * as categories from '@/lib/catalog/site/categories';
import {
  PLANNER_MARKETING_SITEMAP_PATHS,
  PUBLIC_INDEXABLE_STATIC_PATHS,
  SOLUTION_CATEGORY_SITEMAP_PATHS,
} from '@/features/site/data/routeClassification';
import { SITE_URL } from '@/lib/siteUrl';

vi.mock('@/lib/catalog/site/getProducts', () => ({
  getCatalog: vi.fn(),
}));

vi.mock('@/lib/catalog/site/categories', () => ({
  buildRequestedCategoryCatalog: vi.fn(),
}));

describe('sitemap.ts', () => {
  it('includes indexable static and planner marketing paths, not utility noindex routes', async () => {
    vi.spyOn(getProducts, 'getCatalog').mockRejectedValue(new Error('fail'));

    const result = await sitemap();
    const urls = result.map((entry) => entry.url);

    for (const path of PUBLIC_INDEXABLE_STATIC_PATHS) {
      if (path === '/') {
        expect(urls.some((url) => /^https?:\/\/[^/]+\/$/.test(url))).toBe(true);
      } else {
        expect(urls.some((url) => url.includes(`${path}/`) || url.endsWith(path))).toBe(true);
      }
    }
    for (const path of PLANNER_MARKETING_SITEMAP_PATHS) {
      expect(urls.some((url) => url.includes(`${path}/`) || url.endsWith(path))).toBe(true);
    }
    for (const path of SOLUTION_CATEGORY_SITEMAP_PATHS) {
      expect(urls.some((url) => url.includes(`${path}/`) || url.endsWith(path))).toBe(true);
    }

    expect(urls.some((url) => url.includes('/quote-cart/'))).toBe(false);
    expect(urls.some((url) => url.includes('/tracking/'))).toBe(false);
    expect(urls.some((url) => url.includes('/planner/lib/'))).toBe(false);
  });

  it('returns sitemap when catalog fetch succeeds', async () => {
    vi.spyOn(getProducts, 'getCatalog').mockResolvedValue([]);
    vi.spyOn(categories, 'buildRequestedCategoryCatalog').mockReturnValue([
      { id: 'cat1', series: [{ products: [{ id: 'p1', slug: 'slug1' }, { id: 'p2' }] }] }
    ]);

    const result = await sitemap();
    expect(result.some(r => r.url.includes('slug1'))).toBe(true);
    expect(result.some(r => r.url.includes('p2'))).toBe(true);
  });

  it('prefixes every URL with SITE_URL and never hardcodes localhost', async () => {
    vi.spyOn(getProducts, 'getCatalog').mockRejectedValue(new Error('fail'));
    const result = await sitemap();
    const base = SITE_URL.replace(/\/+$/, '');
    expect(result.length).toBeGreaterThan(0);
    for (const entry of result) {
      expect(entry.url.startsWith(`${base}/`)).toBe(true);
      expect(entry.url).not.toMatch(/localhost|127\.0\.0\.1/i);
    }
  });
});