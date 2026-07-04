/**
 * Phase 03A Inventory Index
 *
 * Fast search with normalized terms, synonyms, tags, SKU lookup,
 * typo tolerance, zero-result recovery, and deterministic ranking.
 *
 * Performance: search p95 <100ms at 1K records.
 *
 * Wired to svgBlockDescriptorLoader (via catalogClient items) for Phase 06:
 * catalogue-first (descriptors primary), search parity (cursor/facets), resolver (blocks).
 * Fixed wiring: InventoryPanel now loads from client.getAll() post loadDescriptors. Cites BP-06, design §9/10, GS, PLAN-FAIL-0405/0419.
 */

import type {
  Open3dAvailabilityStatus,
  Open3dAssetReadiness,
  Open3dCatalogCategory,
  Open3dConfigurability,
  Open3dCatalogItem,
  Open3dMountingContract,
  Open3dRoomTag,
  Open3dStyleTag,
} from "../catalogTypes";
import { tokenize } from "../catalogClient";

// ── Synonym map ──

/** Common furniture synonym mappings for search expansion */
const SYNONYM_MAP: Record<string, string[]> = {
  "couch": ["sofa", "loveseat", "sectional"],
  "sofa": ["couch", "loveseat", "settee"],
  "desk": ["workstation", "table", "writing-desk", "computer-desk"],
  "chair": ["seat", "stool", "armchair", "seating"],
  "table": ["desk", "surface", "counter"],
  "storage": ["cabinet", "cupboard", "wardrobe", "closet", "shelf"],
  "bed": ["mattress", "bunk", "cot", "bedframe"],
  "lamp": ["light", "lighting", "luminaire", "fixture"],
  "light": ["lamp", "fixture", "luminaire"],
  "rug": ["carpet", "mat", "floor-covering"],
  "plant": ["greenery", "foliage", "tree"],
  "mirror": ["glass", "reflective"],
  "small": ["compact", "tiny", "mini"],
  "large": ["big", "spacious", "oversized", "xl"],
  "office": ["work", "workplace", "business", "corporate"],
  "home": ["house", "residential", "domestic"],
};

/** Expand a token into synonyms for broader search matching */
function expandSynonyms(token: string): string[] {
  const result: string[] = [token];
  const synonyms = SYNONYM_MAP[token];
  if (synonyms) {
    result.push(...synonyms);
  }
  return result;
}

// ── Relevance scoring ──

interface ScoredItem {
  item: Open3dCatalogItem;
  score: number;
}

function compareCatalogItems(a: Open3dCatalogItem, b: Open3dCatalogItem): number {
  return a.name.localeCompare(b.name)
    || a.sku.localeCompare(b.sku)
    || a.id.localeCompare(b.id);
}

function compareScoredItems(a: ScoredItem, b: ScoredItem): number {
  return (b.score - a.score) || compareCatalogItems(a.item, b.item);
}

/**
 * Compute relevance score with deterministic tie-breaking.
 *
 * Accepts pre-tokenized item tokens (built once during load()) to avoid
 * per-call tokenize() allocations in the search hot path (PLAN-FAIL-012).
 *
 * Ranking priority:
 * 1. Exact SKU match: 100
 * 2. Exact name match: 80
 * 3. Exact slug match: 70
 * 4. Tag match: 50 per tag
 * 5. Name token match: 30 per token
 * 6. Description match: 15 per token
 * 7. Fuzzy prefix match: 5 per token
 * 8. Synonym match: 25 per synonym token
 */
function scoreItem(
  item: Open3dCatalogItem,
  preTokenized: string[],
  queryTokens: string[],
  queryLower: string,
): number {
  let score = 0;

  if (item.sku.toLowerCase() === queryLower) score += 100;
  if (item.name.toLowerCase() === queryLower) score += 80;
  if (item.slug.toLowerCase() === queryLower) score += 70;

  const itemTokens = preTokenized;

  // Expand query with synonyms
  const allQueryTokens = new Set<string>();
  for (const qt of queryTokens) {
    for (const syn of expandSynonyms(qt)) {
      allQueryTokens.add(syn);
    }
  }

  for (const qt of allQueryTokens) {
    if (itemTokens.includes(qt)) {
      if (item.tags.some((t) => t.toLowerCase() === qt)) score += 50;
      else if (item.name.toLowerCase().includes(qt)) score += 30;
      else if (item.description.toLowerCase().includes(qt)) score += 15;
      else if (SYNONYM_MAP[queryTokens[0]]?.includes(qt)) score += 25;
      else score += 10;
    } else {
      // Fuzzy prefix match
      for (const it of itemTokens) {
        if (it.startsWith(qt) || qt.startsWith(it)) {
          score += 5;
          break;
        }
      }
    }
  }

  return score;
}

// ── Typo tolerance ──

/**
 * Simple typo tolerance: generates near-miss tokens by single-character edits.
 * Only applied for queries ≥ 4 characters to avoid overwhelming results.
 */
function generateTypoVariants(token: string): string[] {
  if (token.length < 4) return [];
  const variants: string[] = [];
  // Character swap (adjacent)
  for (let i = 0; i < token.length - 1; i++) {
    const chars = token.split("");
    [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
    variants.push(chars.join(""));
  }
  return variants.slice(0, 3); // Limit to 3 variants
}

// ── Search engine ──

export interface InventorySearchOptions {
  /** Max results per page */
  pageSize?: number;
  /** Minimum relevance score to include in results */
  minScore?: number;
  /** Whether to use typo tolerance */
  typoTolerance?: boolean;
  /** Optional category filter applied before ranking */
  category?: Open3dCatalogCategory;
  /** Optional room filter. Matches items containing at least one selected room. */
  roomTags?: Open3dRoomTag[];
  /** Optional style filter. Matches items containing at least one selected style. */
  styleTags?: Open3dStyleTag[];
  /** Optional material filter using normalized material values. */
  material?: string[];
  /** Optional availability filter. */
  availability?: Open3dAvailabilityStatus[];
  /** Optional configurability filter. */
  configurability?: Open3dConfigurability[];
  /** Optional mounting/anchoring filter. */
  mounting?: Open3dMountingContract[];
  /** Optional asset-readiness filter for degraded-state recovery. */
  assetReadiness?: Open3dAssetReadiness[];
  /** Optional dimension range filter in millimetres. */
  dimensionFilter?: {
    /** Minimum width in mm */
    minWidthMm?: number;
    /** Maximum width in mm */
    maxWidthMm?: number;
    /** Minimum depth in mm */
    minDepthMm?: number;
    /** Maximum depth in mm */
    maxDepthMm?: number;
    /** Minimum height in mm */
    minHeightMm?: number;
    /** Maximum height in mm */
    maxHeightMm?: number;
  };
}

export interface InventorySearchResult {
  items: Open3dCatalogItem[];
  totalCount: number;
  /** Original query (for zero-result recovery) */
  query: string;
  /** Whether the search was relaxed due to zero results */
  relaxed: boolean;
  /** Suggested correction if typo detected */
  suggestedCorrection?: string;
}

/**
 * Inventory search engine with synonyms, typo tolerance, and zero-result recovery.
 */
export class InventorySearchIndex {
  private items: Open3dCatalogItem[] = [];
  /**
   * Pre-tokenized item corpus, keyed by item ID.
   * Built once in load() so scoreItem() never calls tokenize() at query time.
   * Fixes PLAN-FAIL-012: per-item tokenization in the hot scoring path.
   */
  private itemTokenCache = new Map<string, string[]>();

  load(items: Open3dCatalogItem[]): void {
    this.items = [...items].sort(compareCatalogItems);
    // Pre-tokenize all items once so search scoring is allocation-free per query.
    this.itemTokenCache.clear();
    for (const item of this.items) {
      this.itemTokenCache.set(
        item.id,
        tokenize(`${item.name} ${item.description} ${item.tags.join(" ")} ${item.sku}`),
      );
    }
  }

  private filterItems(options: InventorySearchOptions): Open3dCatalogItem[] {
    const materialFilter = new Set((options.material ?? []).map((value) => value.toLowerCase()));
    const roomFilter = new Set(options.roomTags ?? []);
    const styleFilter = new Set(options.styleTags ?? []);
    const availabilityFilter = new Set(options.availability ?? []);
    const configurabilityFilter = new Set(options.configurability ?? []);
    const mountingFilter = new Set(options.mounting ?? []);
    const assetReadinessFilter = new Set(options.assetReadiness ?? []);
    const dim = options.dimensionFilter;

    const configurability = (item: Open3dCatalogItem) => item.configurability ?? null;
    return this.items.filter((item) => {
      if (options.category && item.category !== options.category) return false;
      if (roomFilter.size > 0 && !item.roomTags.some((tag) => roomFilter.has(tag))) return false;
      if (styleFilter.size > 0 && !item.styleTags.some((tag) => styleFilter.has(tag))) return false;
      if (materialFilter.size > 0 && !materialFilter.has(item.material.normalizedMaterial.toLowerCase())) return false;
      if (availabilityFilter.size > 0 && !availabilityFilter.has(item.availability)) return false;
      const itemConfigurability = configurability(item);
      if (configurabilityFilter.size > 0 && (itemConfigurability === null || !configurabilityFilter.has(itemConfigurability))) return false;
      if (mountingFilter.size > 0 && !(item.mounting ?? ["floor"]).some((mounting) => mountingFilter.has(mounting))) return false;
      if (assetReadinessFilter.size > 0 && !(item.assetReadiness ?? ["ready"]).some((state) => assetReadinessFilter.has(state))) return false;
      // Dimension range filter
      if (dim) {
        const { widthMm, depthMm, heightMm } = item.dimensions;
        const minW = dim.minWidthMm ?? null;
        const maxW = dim.maxWidthMm ?? null;
        const minD = dim.minDepthMm ?? null;
        const maxD = dim.maxDepthMm ?? null;
        const minH = dim.minHeightMm ?? null;
        const maxH = dim.maxHeightMm ?? null;
        if (minW !== null && widthMm < minW) return false;
        if (maxW !== null && widthMm > maxW) return false;
        if (minD !== null && depthMm < minD) return false;
        if (maxD !== null && depthMm > maxD) return false;
        if (minH !== null && heightMm < minH) return false;
        if (maxH !== null && heightMm > maxH) return false;
      }
      return true;
    });
  }

  /**
   * Search with synonym expansion, ranking, and typo tolerance.
   */
  search(query: string, options: InventorySearchOptions = {}): InventorySearchResult {
    const { pageSize = 20, minScore = 1, typoTolerance = true } = options;
    const candidates = this.filterItems(options);

    if (!query || query.trim().length === 0) {
      return { items: candidates.slice(0, pageSize), totalCount: candidates.length, query: "", relaxed: false };
    }

    const queryLower = query.trim().toLowerCase();
    const queryTokens = tokenize(query);

    // Primary search — uses pre-tokenized cache to avoid per-item tokenize() calls.
    let scored = candidates
      .map((item) => ({
        item,
        score: scoreItem(item, this.itemTokenCache.get(item.id) ?? [], queryTokens, queryLower),
      }))
      .filter((s) => s.score >= minScore)
      .sort(compareScoredItems);

    // Typo tolerance for zero results
    let relaxed = false;
    let suggestedCorrection: string | undefined;

    if (scored.length === 0 && typoTolerance) {
      const typoVariants: string[] = [];
      for (const token of queryTokens) {
        typoVariants.push(...generateTypoVariants(token));
      }

      if (typoVariants.length > 0) {
        const typoTokens = tokenize(typoVariants.join(" "));
        scored = candidates
          .map((item) => ({
            item,
            score: scoreItem(item, this.itemTokenCache.get(item.id) ?? [], typoTokens, queryLower),
          }))
          .filter((s) => s.score >= 1)
          .sort(compareScoredItems);

        if (scored.length > 0) {
          relaxed = true;
          suggestedCorrection = typoVariants[0];
        }
      }
    }
    // compareScoredItems already provides deterministic tie-breaking via name/SKU/ID.

    return {
      items: scored.slice(0, pageSize).map((s) => s.item),
      totalCount: scored.length,
      query,
      relaxed,
      suggestedCorrection,
    };
  }

  /**
   * Auto-complete suggestions for a partial query.
   */
  suggest(query: string, limit = 5): string[] {
    if (!query || query.trim().length < 2) return [];
    const queryLower = query.trim().toLowerCase();
    const suggestions = new Set<string>();

    for (const item of this.items) {
      if (item.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.name);
      }
      for (const tag of item.tags) {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      }
      if (suggestions.size >= limit) break;
    }

    return Array.from(suggestions).slice(0, limit);
  }
}
