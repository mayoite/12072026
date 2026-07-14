import { describe, it, expect, vi } from 'vitest';
import {
  buildImageCandidates,
  toInlineSpec,
  getDisplayDimensions,
  getDisplayMaterials,
  getDisplayUseCase,
  getProductSignals,
  fallbackAltText,
  getProductRouteKey,
  flattenCategoryProducts,
  buildFallbackFacets,
} from '@/app/(site)/products/[category]/FilterGrid.helpers';

vi.mock('@/lib/catalog/site/filters', () => ({
  PRICE_RANGES: ['Under 5,000', '5,000-10,000', '10,000-20,000', '20,000+'],
}));

vi.mock('@/lib/catalog/site/traits', () => ({
  hasVerifiedHeadrest: vi.fn(() => false),
  hasVerifiedHeightAdjustable: vi.fn(() => false),
}));

vi.mock('@/lib/displayText', () => ({
  sanitizeDisplayText: vi.fn((val) => String(val)),
  filterMeaningfulDimensionText: vi.fn((val) => String(val)),
  filterMeaningfulMaterialList: vi.fn((list) => list),
}));

vi.mock('@/lib/assetPaths', () => ({
  normalizeAssetPath: vi.fn((val) => val ? `/${val}` : val),
}));

describe('FilterGrid.helpers', () => {
  describe('buildImageCandidates', () => {
    it('filters out placeholders and uniqueifies paths', () => {
      const product = {
        flagshipImage: 'assets_placeholder.jpg',
        images: ['valid.jpg', 'fallback/category.webp', 'valid.jpg', 'test.svg'],
      };
      const result = buildImageCandidates(product as any);
      // Valid should be the only one passing isUsableImagePath
      expect(result).toEqual(['/valid.jpg']);
    });
    
    it('returns unique if all are unusable', () => {
      const product = {
        flagshipImage: 'assets_placeholder.jpg',
        images: ['fallback/category.webp'],
      };
      const result = buildImageCandidates(product as any);
      expect(result.length).toBe(2);
    });
  });

  describe('toInlineSpec', () => {
    it('truncates long text', () => {
      const longText = 'a'.repeat(80);
      expect(toInlineSpec(longText)).toBe('a'.repeat(72) + '...');
    });
  });

  describe('getDisplayDimensions', () => {
    it('returns dimension string from specs', () => {
      const p = { specs: { dimensions: '100x100x100' } } as any;
      expect(getDisplayDimensions(p)).toBe('100x100x100');
    });

    it('falls back to detailed info dimensions', () => {
      const p = { detailedInfo: { dimensions: '20 x 30 x 40' } } as any;
      expect(getDisplayDimensions(p)).toBe('20 x 30 x 40');
    });
  });

  describe('getDisplayMaterials', () => {
    it('returns materials from specs', () => {
      const p = { specs: { materials: ['Wood', 'Metal'] } } as any;
      expect(getDisplayMaterials(p)).toBe('Wood, Metal');
    });
  });

  describe('getDisplayUseCase', () => {
    it('returns use case from metadata', () => {
      const p = { metadata: { useCase: ['Office', 'Home'] } } as any;
      expect(getDisplayUseCase(p)).toBe('Office, Home');
    });
  });

  describe('getProductSignals', () => {
    it('returns appropriate signals based on metadata', () => {
      const p = { metadata: { isHeightAdjustable: true, isStackable: true } } as any;
      expect(getProductSignals(p)).toEqual(['Height adjustable', 'Stackable']);
    });
  });

  describe('fallbackAltText', () => {
    it('generates alt text', () => {
      expect(fallbackAltText('Chair', 'Seating')).toBe('Product image of Chair in Seating category');
    });
  });

  describe('getProductRouteKey', () => {
    it('returns slug over id', () => {
      expect(getProductRouteKey({ slug: 'test-slug', id: 'test-id' } as any)).toBe('test-slug');
    });
    it('returns id if no slug', () => {
      expect(getProductRouteKey({ id: 'test-id' } as any)).toBe('test-id');
    });
  });

  describe('flattenCategoryProducts', () => {
    it('flattens and dedupes', () => {
      const cat = {
        name: 'Seating',
        series: [
          { id: 's1', name: 'Series 1', products: [{ id: 'p1', name: 'P1', slug: 'p1', metadata: { subcategory: 'sc1' } }] }
        ]
      } as any;
      const res = flattenCategoryProducts(cat);
      expect(res.length).toBe(1);
      expect(res[0].seriesId).toBe('s1');
      expect(res[0].altText).toBe('Product image of P1 in Seating category');
    });
  });

  describe('buildFallbackFacets', () => {
    it('builds facets', () => {
      const products = [
        { seriesName: 'S1', metadata: { subcategory: 'SC1', isStackable: true }, price: 15000, specs: { materials: ['Metal'] } },
        { seriesName: 'S2', metadata: { subcategory: 'SC1', bifmaCertified: true }, price: 25000 }
      ] as any[];
      const facets = buildFallbackFacets('desks', products);
      
      expect(facets.series).toEqual(['S1', 'S2']);
      expect(facets.subcategory).toEqual(['SC1']);
      expect(facets.material).toEqual(['Metal']);
      expect(facets.priceRange).toContain('10,000-20,000');
      expect(facets.priceRange).toContain('20,000+');
      expect(facets.featureAvailability.isStackable).toBe(true);
      expect(facets.featureAvailability.bifmaCertified).toBe(true);
    });

    it('omits series facets for seating', () => {
      const facets = buildFallbackFacets('seating', [] as any[]);
      expect(facets.series).toEqual([]);
    });
  });
});
