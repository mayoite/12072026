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
  readdirSync: vi.fn((): string[] => []),
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
    // Reset FS mock (other tests override implementation).
    mockFs.existsSync.mockImplementation((p: string) => {
      if (p.includes('exists.webp')) return true;
      if (p.includes('exists-jpg.jpg')) return true;
      if (p.includes('exists-jpeg.jpeg')) return true;
      if (p.includes('exists-png.png')) return true;
      return false;
    });
    mockFs.readdirSync.mockImplementation((): string[] => []);
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
    expect(assetPaths.normalizeAssetPath(legacy)).toBe(
      'https://cdn.example.com/images/fallback/product-placeholder.webp',
    );
  });

  it('should resolve legacy products paths', () => {
    expect(assetPaths.normalizeAssetPath('/products/table.webp')).toBe(
      'https://cdn.example.com/images/fallback/product-placeholder.webp',
    );
  });

  it('should resolve category placeholders to raster product fallback', () => {
    expect(assetPaths.normalizeAssetPath('/images/fallback/category.webp')).toBe(
      'https://cdn.example.com/images/fallback/product-placeholder.webp',
    );
    expect(assetPaths.normalizeAssetPath('/images/fallback/category.svg')).toBe(
      'https://cdn.example.com/images/fallback/product-placeholder.webp',
    );
  });

  it('should resolve phoenix seating webp to jpg', () => {
    expect(assetPaths.normalizeAssetPath('/images/catalog/oando-seating--phoenix/image-1.webp')).toBe(
      'https://cdn.example.com/images/catalog/oando-seating--phoenix/image-1.jpg'
    );
    expect(assetPaths.normalizeAssetPath('/images/catalog/oando-seating--phoenix/image-4.webp')).toBe(
      'https://cdn.example.com/images/fallback/product-placeholder.webp'
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

    // non-existing resolves to raster fallback (next/image rejects SVG)
    expect(assetPaths.normalizeAssetPath('/images/not-here.webp')).toBe(
      'https://cdn.example.com/images/fallback/product-placeholder.webp',
    );
  });

  it('should strip zero-padded catalog image numbers when unpadded file exists', () => {
    mockFs.existsSync.mockImplementation((p: string) => {
      if (String(p).includes('/images/catalog/oando-seating--fluid-x/image-1.webp')) return true;
      if (String(p).includes('/images/catalog/oando-seating--canaret/image-1.jpg')) return true;
      return false;
    });
    expect(
      assetPaths.normalizeAssetPath('/images/catalog/oando-seating--fluid-x/image-01.webp'),
    ).toBe('https://cdn.example.com/images/catalog/oando-seating--fluid-x/image-1.webp');
    expect(
      assetPaths.normalizeAssetPath('/images/catalog/oando-seating--canaret/image-01.webp'),
    ).toBe('https://cdn.example.com/images/catalog/oando-seating--canaret/image-1.jpg');
  });

  it('should keep zero-padded path when padded file exists on disk', () => {
    mockFs.existsSync.mockImplementation((p: string) => {
      if (String(p).includes('/images/catalog/oando-seating--arvo/image-01.webp')) return true;
      return false;
    });
    expect(
      assetPaths.normalizeAssetPath('/images/catalog/oando-seating--arvo/image-01.webp'),
    ).toBe('https://cdn.example.com/images/catalog/oando-seating--arvo/image-01.webp');
  });

  it('should resolve nearest sibling image when exact index is missing', () => {
    mockFs.existsSync.mockImplementation((p: string) => {
      const s = String(p).replace(/\\/g, '/');
      // directory exists for readdir; only image-2.jpg present
      if (s.endsWith('/images/catalog/oando-seating--casca')) return true;
      if (s.includes('/images/catalog/oando-seating--casca/image-2.jpg')) return true;
      return false;
    });
    mockFs.readdirSync = vi.fn(() => ['image-2.jpg', 'image-3.jpg']);
    expect(
      assetPaths.normalizeAssetPath('/images/catalog/oando-seating--casca/image-1.jpg'),
    ).toBe('https://cdn.example.com/images/catalog/oando-seating--casca/image-2.jpg');
  });

  it('should preserve original path on client (no destructive unpad)', async () => {
    vi.stubGlobal('window', {});
    vi.resetModules();
    const clientAssetPaths = await import('../../../lib/assetPaths');
    expect(clientAssetPaths.normalizeAssetPath('/images/anything.webp')).toBe(
      'https://cdn.example.com/images/anything.webp',
    );
    // Client must not rewrite image-01 → image-1 (destroys SSR-resolved padded paths).
    expect(
      clientAssetPaths.normalizeAssetPath('/images/catalog/oando-seating--arvo/image-01.webp'),
    ).toBe('https://cdn.example.com/images/catalog/oando-seating--arvo/image-01.webp');
    expect(
      clientAssetPaths.normalizeAssetPath('/images/catalog/oando-seating--fluid-x/image-01.webp'),
    ).toBe('https://cdn.example.com/images/catalog/oando-seating--fluid-x/image-01.webp');
  });

  it('should normalize asset list', () => {
    expect(assetPaths.normalizeAssetList(null)).toEqual([
      '/images/fallback/product-placeholder.webp',
    ]);
    expect(assetPaths.normalizeAssetList([])).toEqual([
      '/images/fallback/product-placeholder.webp',
    ]);
    expect(assetPaths.normalizeAssetList(['/images/exists.webp', null, ''])).toEqual(['https://cdn.example.com/images/exists.webp']);
  });

  it('detects product image fallback paths', () => {
    expect(assetPaths.isProductImageFallback('')).toBe(true);
    expect(assetPaths.isProductImageFallback('/images/fallback/product-placeholder.webp')).toBe(true);
    expect(
      assetPaths.isProductImageFallback('https://cdn.example.com/images/fallback/product-placeholder.webp'),
    ).toBe(true);
    expect(assetPaths.isProductImageFallback('/images/catalog/oando-tables--crest/image-1.jpg')).toBe(false);
  });

  it('lists catalog slug images and resolves CMS-hash miss via slug folder', () => {
    mockFs.existsSync.mockImplementation((p: string) => {
      const s = String(p).replace(/\\/g, '/');
      if (s.endsWith('/images/catalog')) return true;
      if (s.endsWith('/images/catalog/oando-tables--crest')) return true;
      if (s.includes('/images/catalog/oando-tables--crest/image-1.jpg')) return true;
      if (s.includes('/images/catalog/oando-tables--crest/image-2.jpg')) return true;
      return false;
    });
    mockFs.readdirSync.mockImplementation((p: string) => {
      const s = String(p).replace(/\\/g, '/');
      if (s.endsWith('/images/catalog')) return ['oando-tables--crest', 'oando-seating--arvo'];
      if (s.endsWith('/images/catalog/oando-tables--crest')) return ['image-1.jpg', 'image-2.jpg', 'readme.txt'];
      return [];
    });

    expect(assetPaths.listCatalogSlugImages('oando-tables--crest')).toEqual([
      '/images/catalog/oando-tables--crest/image-1.jpg',
      '/images/catalog/oando-tables--crest/image-2.jpg',
    ]);

    // Short slug unique --suffix match (fluid-x → oando-seating--fluid-x style).
    mockFs.existsSync.mockImplementation((p: string) => {
      const s = String(p).replace(/\\/g, '/');
      if (s.endsWith('/images/catalog')) return true;
      if (s.endsWith('/images/catalog/oando-seating--fluid-x')) return true;
      if (s.includes('/images/catalog/oando-seating--fluid-x/image-1.webp')) return true;
      return false;
    });
    mockFs.readdirSync.mockImplementation((p: string) => {
      const s = String(p).replace(/\\/g, '/');
      if (s.endsWith('/images/catalog')) return ['oando-seating--fluid-x'];
      if (s.endsWith('/images/catalog/oando-seating--fluid-x')) return ['image-1.webp'];
      return [];
    });
    const short = assetPaths.resolveProductCatalogAssets(
      'fluid-x',
      '/images/products/fluid-x-chair-1.webp',
      ['/images/products/fluid-x-chair-1.webp'],
    );
    expect(short.flagship_image).toBe(
      'https://cdn.example.com/images/catalog/oando-seating--fluid-x/image-1.webp',
    );
    expect(short.images[0]).toBe(
      'https://cdn.example.com/images/catalog/oando-seating--fluid-x/image-1.webp',
    );

    // Prefer real preferred path when it exists.
    mockFs.existsSync.mockImplementation((p: string) => String(p).includes('exists.webp'));
    const keep = assetPaths.resolveProductCatalogAssets(
      'anything',
      '/images/exists.webp',
      ['/images/exists.webp'],
    );
    expect(keep.flagship_image).toBe('https://cdn.example.com/images/exists.webp');
    expect(keep.images).toEqual(['https://cdn.example.com/images/exists.webp']);
  });
});
