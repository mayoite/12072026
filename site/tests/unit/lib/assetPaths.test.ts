import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type * as assetPathsType0 from "../../../lib/assetPaths";

const mockFs = {
  existsSync: vi.fn((p: string) => {
    if (p.includes('exists.webp')) return true;
    if (p.includes('exists-jpg.jpg')) return true;
    if (p.includes('exists-jpeg.jpeg')) return true;
    if (p.includes('exists-png.png')) return true;
    return false;
  }),
};

const mockPath = {
  sep: '/',
  join: (...args: string[]) => args.join('/'),
};

// Override __non_webpack_require__ to return our mock modules
(globalThis as any).__non_webpack_require__ = (id: string) => {
  if (id === 'node:fs' || id === 'fs') return mockFs;
  if (id === 'node:path' || id === 'path') return mockPath;
  throw new Error(`Unexpected require: ${id}`);
};

describe('assetPaths', () => {
  let assetPaths: typeof assetPathsType0;

  beforeEach(async () => {
    // Force server-side by default
    vi.stubGlobal('window', undefined);
    vi.resetModules();
    // Set environment variables for testing
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = 'https://cdn.example.com/';
    assetPaths = await import('../../../lib/assetPaths');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should handle null/undefined/empty paths', () => {
    expect(assetPaths.normalizeAssetPath(null)).toBe('');
    expect(assetPaths.normalizeAssetPath(undefined)).toBe('');
    expect(assetPaths.normalizeAssetPath('')).toBe('');
    expect(assetPaths.normalizeAssetPath('   ')).toBe('');
  });

  it('should preserve absolute URLs', () => {
    expect(assetPaths.normalizeAssetPath('https://another-cdn.com/img.png')).toBe('https://another-cdn.com/img.png');
    expect(assetPaths.normalizeAssetPath('mailto:info@oando.co.in')).toBe('mailto:info@oando.co.in');
  });

  it('should resolve legacy catalog export paths', () => {
    // Under node (isServer() === true), it will check if file exists.
    // If it does not exist, it falls back to category.svg.
    const legacySeg = String.fromCharCode(97, 102, 99);
    const legacy = `/images/${legacySeg}/chair.webp`;
    expect(assetPaths.normalizeAssetPath(legacy)).toBe('https://cdn.example.com/images/fallback/category.svg');
  });

  it('should resolve legacy products paths', () => {
    expect(assetPaths.normalizeAssetPath('/products/table.webp')).toBe('https://cdn.example.com/images/fallback/category.svg');
  });

  it('should resolve category.webp to category.svg', () => {
    expect(assetPaths.normalizeAssetPath('/images/fallback/category.webp')).toBe('https://cdn.example.com/images/fallback/category.svg');
  });

  it('should resolve phoenix seating webp to jpg', () => {
    expect(assetPaths.normalizeAssetPath('/images/catalog/oando-seating--phoenix/image-1.webp')).toBe(
      'https://cdn.example.com/images/catalog/oando-seating--phoenix/image-1.jpg'
    );
    expect(assetPaths.normalizeAssetPath('/images/catalog/oando-seating--phoenix/image-4.webp')).toBe(
      '/images/fallback/category.svg'
    );
  });

  it('should resolve local variants for webp when server-side', () => {
    // exists.webp exists, so it should return it with cdn base
    expect(assetPaths.normalizeAssetPath('/images/exists.webp')).toBe('https://cdn.example.com/images/exists.webp');

    // exists-jpg.webp does not exist, but exists-jpg.jpg does
    expect(assetPaths.normalizeAssetPath('/images/exists-jpg.webp')).toBe('https://cdn.example.com/images/exists-jpg.jpg');

    // exists-jpeg.webp does not exist, but exists-jpeg.jpeg does
    expect(assetPaths.normalizeAssetPath('/images/exists-jpeg.webp')).toBe('https://cdn.example.com/images/exists-jpeg.jpeg');

    // exists-png.webp does not exist, but exists-png.png does
    expect(assetPaths.normalizeAssetPath('/images/exists-png.webp')).toBe('https://cdn.example.com/images/exists-png.png');

    // non-existing resolves to fallback
    expect(assetPaths.normalizeAssetPath('/images/not-here.webp')).toBe('https://cdn.example.com/images/fallback/category.svg');
  });

  it('should behave differently on client side (window is defined)', async () => {
    vi.stubGlobal('window', {});
    vi.resetModules();
    const clientAssetPaths = await import('../../../lib/assetPaths');
    // On client side, resolves directly without local variant check:
    expect(clientAssetPaths.normalizeAssetPath('/images/anything.webp')).toBe('https://cdn.example.com/images/anything.webp');
  });

  it('should normalize asset list', () => {
    expect(assetPaths.normalizeAssetList(null)).toEqual(['/images/fallback/category.svg']);
    expect(assetPaths.normalizeAssetList([])).toEqual(['/images/fallback/category.svg']);
    expect(assetPaths.normalizeAssetList(['/images/exists.webp', null, ''])).toEqual(['https://cdn.example.com/images/exists.webp']);
  });
});
