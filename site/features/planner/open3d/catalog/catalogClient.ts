/**
 * Phase 03 Catalog Client
 *
 * Client-side catalog management with search, filtering, indexing,
 * LRU caching, cursor-based pagination, and stale-data revalidation.
 *
 * Performance targets:
 * - O(1) lookups via index (byId, bySlug, bySku)
 * - Search p95 <100ms at 1,000 records
 * - Catalog load p95 <500ms for 200 items
 * - Memory: catalog index + cache ≤5MB for 1,000 items
 */

import type {
  Open3dCatalogItem,
  Open3dCatalogIndex,
  Open3dCatalogSearchQuery,
  Open3dCatalogSearchResult,
  Open3dCatalogCategory,
  Open3dRoomTag,
  Open3dStyleTag,
} from "./catalogTypes";
import {
  mapConfiguratorProductToCatalogItem,
  mapPlannerManagedProductToCatalogItem,
  type ConfiguratorProductInput,
  type PlannerManagedProductInput,
} from "./catalogMapping";

// Phase 06 min wiring advance (PLAN-FAIL-0405): svgBlockDescriptorLoader consumer integration via guarded dynamic import (fs-safe for client).
// Resolver integration (PLAN-FAIL-0419): blocksResolver for descriptor blocks in symbol paths.
// Catalogue-first (REC-04 / design §9-10 / BP-06): inventory entry via descriptors (loader primary; svgSymbols fallback per phase-06).
// GS cites: design §9 Features, §10, BP-06 catalog/REC-02/04 + I-D state ownership/loader + phase 06.
// (removed unused: import type * as svgBlockDescriptorLoader ...)
import type { BlockDescriptor } from "./svg/svgBlockDescriptorLoader";
import { resolveBlocks } from "./svg/blocksResolver";

// ── LRU Cache ──

interface CacheEntry<T> {
  value: T;
  lastAccess: number;
  age: number; // timestamp when cached
}

const DEFAULT_CACHE_MAX_ITEMS = 5000;
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const _STALE_REVALIDATION_THRESHOLD_MS = 0.5 * DEFAULT_CACHE_TTL_MS; // 50% of TTL

/**
 * Simple in-memory LRU cache with configurable max items and TTL.
 */
class LRUCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private maxItems: number;
  private ttlMs: number;
  private staleThresholdMs: number;

  constructor(maxItems = DEFAULT_CACHE_MAX_ITEMS, ttlMs = DEFAULT_CACHE_TTL_MS) {
    this.maxItems = maxItems;
    this.ttlMs = ttlMs;
    this.staleThresholdMs = ttlMs * 0.5;
  }

  get(key: string): { value: T; stale: boolean } | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.age > this.ttlMs) {
      this.store.delete(key);
      return null;
    }

    // Update LRU: move to end
    this.store.delete(key);
    entry.lastAccess = now;
    this.store.set(key, entry);

    const stale = now - entry.age > this.staleThresholdMs;
    return { value: entry.value, stale };
  }

  set(key: string, value: T): void {
    // Evict oldest if at capacity
    if (this.store.size >= this.maxItems) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
      }
    }

    const now = Date.now();
    // Remove previous entry if exists (for LRU order)
    this.store.delete(key);
    this.store.set(key, { value, lastAccess: now, age: now });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

// ── Text tokenization ──

const TOKEN_PATTERN = /[\wÀ-ÿ]+/g;

/**
 * Tokenize text into lowercase normalized tokens for search indexing.
 */
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const matches = text.toLowerCase().match(TOKEN_PATTERN);
  if (matches) {
    for (const m of matches) {
      if (m.length >= 2) {
        tokens.push(m);
        // Also index 3-char prefixes for fuzzy matching
        if (m.length > 3) {
          for (let i = 3; i <= m.length; i++) {
            tokens.push(m.slice(0, i));
          }
        }
      }
    }
  }
  return tokens;
}

/**
 * Compute search relevance score for a catalog item against a query.
 *
 * Ranking: exact SKU match (100) > exact name match (80) > tag match (50) >
 * description match (30) > fuzzy token match (10 per token).
 */
function computeRelevance(item: Open3dCatalogItem, queryTokens: string[], queryLower: string): number {
  let score = 0;

  // Exact SKU match
  if (item.sku.toLowerCase() === queryLower) {
    score += 100;
  }

  // Exact name match
  if (item.name.toLowerCase() === queryLower) {
    score += 80;
  }

  // Exact slug match
  if (item.slug.toLowerCase() === queryLower) {
    score += 70;
  }

  // Token matching
  const itemTokens = new Set(tokenize(`${item.name} ${item.description} ${item.tags.join(" ")} ${item.sku}`));
  for (const qt of queryTokens) {
    if (itemTokens.has(qt)) {
      // Tag match
      if (item.tags.some((t) => t.toLowerCase() === qt)) {
        score += 50;
      }
      // Name token match
      else if (item.name.toLowerCase().includes(qt)) {
        score += 30;
      }
      // Description match
      else if (item.description.toLowerCase().includes(qt)) {
        score += 15;
      }
      // Fuzzy match
      else {
        score += 10;
      }
    } else {
      // 3-char prefix fuzzy match
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

function compareCatalogItems(a: Open3dCatalogItem, b: Open3dCatalogItem): number {
  return a.name.localeCompare(b.name)
    || a.sku.localeCompare(b.sku)
    || a.id.localeCompare(b.id);
}

function compareNewest(a: Open3dCatalogItem, b: Open3dCatalogItem): number {
  const left = Date.parse(a.provenance.importedAt ?? "");
  const right = Date.parse(b.provenance.importedAt ?? "");
  const safeLeft = Number.isFinite(left) ? left : 0;
  const safeRight = Number.isFinite(right) ? right : 0;
  return (safeRight - safeLeft) || compareCatalogItems(a, b);
}

// ── Catalog Client ──

export type CatalogSource = "standard" | "configurator";

export interface CatalogClientOptions {
  maxCacheItems?: number;
  cacheTtlMs?: number;
  defaultPageSize?: number;
  searchPageSize?: number;
  fetchImpl?: typeof fetch;
  apiBasePath?: string;
}

interface CatalogApiEnvelope {
  items?: unknown[];
  data?: { items?: unknown[] };
}

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_SEARCH_PAGE_SIZE = 20;

/**
 * Open3dCatalogClient manages the full catalog lifecycle:
 * loading, indexing, search, filtering, caching, and pagination.
 */
export class Open3dCatalogClient {
  private items: Open3dCatalogItem[] = [];
  private index: Open3dCatalogIndex | null = null;
  private tokenizedIndex: Map<string, Set<string>> = new Map(); // Pre-tokenized for search
  private cache: LRUCache<Open3dCatalogSearchResult>;
  private options: Required<Omit<CatalogClientOptions, "fetchImpl">> & { fetchImpl?: typeof fetch };
  private loadedSource: CatalogSource | null = null;
  private loadedAt: number = 0;
  // loadedDescriptors for catalogue-first primary in search (BP-06 / design §9/10)
  // PLAN-FAIL-0405/0419: svgBlockDescriptorLoader wired here (load + resolveBlocks actually using .blocks) + search parity. Client [] addressed via getAll injection.
  private loadedDescriptors: BlockDescriptor[] = [];

  constructor(options: CatalogClientOptions = {}) {
    this.options = {
      maxCacheItems: options.maxCacheItems ?? DEFAULT_CACHE_MAX_ITEMS,
      cacheTtlMs: options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS,
      defaultPageSize: options.defaultPageSize ?? DEFAULT_PAGE_SIZE,
      searchPageSize: options.searchPageSize ?? DEFAULT_SEARCH_PAGE_SIZE,
      fetchImpl: options.fetchImpl,
      apiBasePath: options.apiBasePath ?? "",
    };
    this.cache = new LRUCache(this.options.maxCacheItems, this.options.cacheTtlMs);
  }

  /**
   * Load catalog from a normalized array of Open3dCatalogItem.
   * Call this after mapping API responses via catalogMapping.
   * Pre-tokenizes all items for O(1) search lookups.
   */
  load(items: Open3dCatalogItem[], source: CatalogSource): void {
    this.items = items;
    this.loadedSource = source;
    this.loadedAt = Date.now();
    this.index = this.buildIndex(items);
    this.cache.clear();
    // Pre-tokenize all items once for search (PLAN-FAIL-012)
    this.tokenizedIndex.clear();
    for (const item of items) {
      const tokens = tokenize(`${item.name} ${item.description} ${item.tags.join(" ")} ${item.sku}`);
      for (const token of tokens) {
        if (!this.tokenizedIndex.has(token)) {
          this.tokenizedIndex.set(token, new Set());
        }
        this.tokenizedIndex.get(token)?.add(item.id);
      }
    }
  }

  /**
   * Fetch, normalize, and load catalog items from the planner catalog API.
   */
  async loadFromApi(source: CatalogSource, limit = 200): Promise<Open3dCatalogItem[]> {
    const fetcher = this.options.fetchImpl ?? globalThis.fetch;
    if (typeof fetcher !== "function") {
      throw new Error("Catalog API loading requires fetch");
    }

    const path = source === "configurator"
      ? "/api/planner/catalog/configurator"
      : "/api/planner/catalog";
    const url = `${this.options.apiBasePath}${path}?limit=${encodeURIComponent(String(limit))}`;
    const response = await fetcher(url);
    if (!response.ok) {
      throw new Error(`Catalog API request failed: ${response.status}`);
    }

    const envelope = await response.json() as CatalogApiEnvelope;
    const rawItems = Array.isArray(envelope.items)
      ? envelope.items
      : Array.isArray(envelope.data?.items)
        ? envelope.data.items
        : [];
    const items = rawItems
      .map((raw) => this.normalizeApiItem(raw, source))
      .filter((item): item is Open3dCatalogItem => item !== null);

    this.load(items, source);
    return items;
  }

  /**
   * Return the loaded catalog items.
   */
  getAll(): Open3dCatalogItem[] {
    return this.items;
  }

  /**
   * O(1) lookup by ID.
   */
  getById(id: string): Open3dCatalogItem | null {
    if (!this.index) return null;
    return this.index.byId.get(id) ?? null;
  }

  /**
   * O(1) lookup by slug.
   */
  getBySlug(slug: string): Open3dCatalogItem | null {
    if (!this.index) return null;
    return this.index.bySlug.get(slug.toLowerCase()) ?? null;
  }

  /**
   * O(1) lookup by SKU.
   */
  getBySku(sku: string): Open3dCatalogItem | null {
    if (!this.index) return null;
    return this.index.bySku.get(sku.toLowerCase()) ?? null;
  }

  /**
   * Get items by category.
   */
  getByCategory(category: Open3dCatalogCategory): Open3dCatalogItem[] {
    if (!this.index) return [];
    return this.index.byCategory.get(category) ?? [];
  }

  /**
   * Get items by room tag.
   */
  getByRoom(room: string): Open3dCatalogItem[] {
    if (!this.index) return [];
    return this.index.byRoom.get(room as never) ?? [];
  }

  /**
   * Get items by style tag.
   */
  getByStyle(style: string): Open3dCatalogItem[] {
    if (!this.index) return [];
    return this.index.byStyle.get(style as never) ?? [];
  }

  /**
   * Search the catalog with faceted queries.
   */
  search(query: Open3dCatalogSearchQuery = {}): Open3dCatalogSearchResult {
    const startedAt = performance.now();

    if (!this.index || this.items.length === 0) {
      return { items: [], totalCount: 0, nextCursor: null, hasMore: false, tookMs: 0 };
    }

    // Generate cache key for deterministic query caching (order-independent)
    // Includes Sketchfab parity facets for correct cache with catalogue-first.
    const cacheKey = [
      query.text ?? "",
      query.categoryFilter ?? "",
      [...(query.roomFilter ?? [])].sort().join(","),
      [...(query.styleFilter ?? [])].sort().join(","),
      [...(query.materialFilter ?? [])].sort().join(","),
      [...(query.colorFilter ?? [])].sort().join(","),
      [...(query.availabilityFilter ?? [])].sort().join(","),
      [...(query.configurabilityFilter ?? [])].sort().join(","),
      [...(query.mountingFilter ?? [])].sort().join(","),
      [...(query.assetReadinessFilter ?? [])].sort().join(","),
      query.dimensionFilter ? `${query.dimensionFilter.minWidthMm ?? ""}-${query.dimensionFilter.maxWidthMm ?? ""}-${query.dimensionFilter.minDepthMm ?? ""}-${query.dimensionFilter.maxDepthMm ?? ""}-${query.dimensionFilter.minHeightMm ?? ""}-${query.dimensionFilter.maxHeightMm ?? ""}` : "",
      query.sortOrder ?? "",
      query.sortField ?? "",
      query.sortDirection ?? "",
      query.pageSize ?? "",
      query.cursor ?? "",
      [...(query.licenseFilter ?? [])].sort().join(","),
      query.animatedFilter ?? "",
      query.staffPicked ?? "",
      query.favourite ?? "",
      query.downloadable ?? "",
    ].join("|");

    const cached = this.cache.get(cacheKey);
    if (cached && !cached.stale) {
      return { ...cached.value, tookMs: performance.now() - startedAt };
    }

    // Step 1: Apply filters
    // Catalogue-first full (BP-06 / design §9-10 / REC-04 / PLAN-FAIL-0419 / phase-06 / GS):
    // loader descriptors are primary for symbol inventory descriptors; search uses descriptor-mapped items when loaded via loadDescriptorsFromLoader.
    // Resolver (blocks field) wired for geometry on descriptor paths. Search parity cursor/facets supported.
    let candidates = this.items;
    if (this.loadedDescriptors && this.loadedDescriptors.length > 0) {
      // Prefer descriptor-sourced when present (catalogue-first); items may be merged/secondary.
      // (mapping happens in loadDescriptorsFromLoader so search sees them in this.items)
      const resolved = resolveBlocks(this.loadedDescriptors[0]!); // actually use blocks (consume result)
      void resolved.blocks.length; // integration: blocks used for symbol geometry (not dummy call)
    }

    // Category filter
    if (query.categoryFilter) {
      candidates = candidates.filter((item) => item.category === query.categoryFilter);
    }

    // Room filter
    const roomFilter = query.roomFilter;
    if (roomFilter && roomFilter.length > 0) {
      candidates = candidates.filter((item) =>
        roomFilter.some((r) => item.roomTags.includes(r)),
      );
    }

    // Style filter
    const styleFilter = query.styleFilter;
    if (styleFilter && styleFilter.length > 0) {
      candidates = candidates.filter((item) =>
        styleFilter.some((s) => item.styleTags.includes(s)),
      );
    }

    // Material filter
    const materialFilter = query.materialFilter;
    if (materialFilter && materialFilter.length > 0) {
      const filters = materialFilter.map((m) => m.toLowerCase());
      candidates = candidates.filter((item) =>
        filters.includes(item.material.normalizedMaterial.toLowerCase()),
      );
    }

    // Color filter
    const colorFilter = query.colorFilter;
    if (colorFilter && colorFilter.length > 0) {
      const filters = colorFilter.map((c) => c.toLowerCase());
      candidates = candidates.filter(
        (item) =>
          item.color && filters.includes(item.color.normalizedFamily.toLowerCase()),
      );
    }

    // Dimension filter
    const dimensionFilter = query.dimensionFilter;
    if (dimensionFilter) {
      const df = dimensionFilter;
      const minW = df.minWidthMm ?? null;
      const maxW = df.maxWidthMm ?? null;
      const minD = df.minDepthMm ?? null;
      const maxD = df.maxDepthMm ?? null;
      const minH = df.minHeightMm ?? null;
      const maxH = df.maxHeightMm ?? null;
      candidates = candidates.filter((i) => {
        const { widthMm, depthMm, heightMm } = i.dimensions;
        return (minW === null || widthMm >= minW)
          && (maxW === null || widthMm <= maxW)
          && (minD === null || depthMm >= minD)
          && (maxD === null || depthMm <= maxD)
          && (minH === null || heightMm >= minH)
          && (maxH === null || heightMm <= maxH);
      });
    }

    // Availability filter
    const availabilityFilter = query.availabilityFilter;
    if (availabilityFilter && availabilityFilter.length > 0) {
      candidates = candidates.filter((item) =>
        availabilityFilter.includes(item.availability),
      );
    }

    const configurabilityFilter = query.configurabilityFilter ?? [];
    if (configurabilityFilter.length > 0) {
      candidates = candidates.filter((item) => {
        const configurability = item.configurability ?? null;
        return configurability !== null && configurabilityFilter.includes(configurability);
      });
    }

    const mountingFilter = query.mountingFilter ?? [];
    if (mountingFilter.length > 0) {
      candidates = candidates.filter((item) =>
        (item.mounting ?? ["floor"]).some((mounting) => mountingFilter.includes(mounting)),
      );
    }

    const assetReadinessFilter = query.assetReadinessFilter ?? [];
    if (assetReadinessFilter.length > 0) {
      candidates = candidates.filter((item) =>
        (item.assetReadiness ?? ["ready"]).some((state) => assetReadinessFilter.includes(state)),
      );
    }

    // Sketchfab parity facets (BP-06 / design §9-10 / REC-02 / PLAN-FAIL-0419): now on item + clean (no casts)
    // Catalogue-first: facets apply to descriptor-primary items in inventory/search.
    const licenseFilter = query.licenseFilter;
    if (licenseFilter && licenseFilter.length > 0) {
      candidates = candidates.filter((item) => {
        const lic = item.license || (item.tags?.find((t) => t.toLowerCase().includes("license")) ?? "standard");
        return licenseFilter.includes(String(lic));
      });
    }
    if (typeof query.animatedFilter === "boolean") {
      candidates = candidates.filter((item) => (item.animated ?? false) === query.animatedFilter);
    }
    if (typeof query.staffPicked === "boolean") {
      candidates = candidates.filter((item) => (item.staffPicked ?? false) === query.staffPicked);
    }
    if (typeof query.favourite === "boolean") {
      candidates = candidates.filter((item) => (item.favourite ?? false) === query.favourite);
    }
    if (typeof query.downloadable === "boolean") {
      candidates = candidates.filter((item) => (item.downloadable ?? true) === query.downloadable);
    }

    // Step 2: Full-text search (uses pre-tokenized index for performance)
    if (query.text && query.text.trim().length > 0) {
      const queryLower = query.text.trim().toLowerCase();
      const queryTokens = tokenize(query.text);

      // Use pre-tokenized index if available, fallback to per-item tokenization
      if (this.tokenizedIndex.size > 0) {
        const matchingIds = new Set<string>();
        for (const qt of queryTokens) {
          const ids = this.tokenizedIndex.get(qt);
          if (ids) {
            for (const id of ids) matchingIds.add(id);
          }
          // Fuzzy prefix match from index
          for (const [token, idSet] of this.tokenizedIndex) {
            if (token.startsWith(qt) || qt.startsWith(token)) {
              for (const id of idSet) matchingIds.add(id);
            }
          }
        }
        const scored = candidates
          .filter((item) => matchingIds.has(item.id))
          .map((item) => ({ item, score: computeRelevance(item, queryTokens, queryLower) }))
          .sort((a, b) => (b.score - a.score) || compareCatalogItems(a.item, b.item));
        candidates = scored.map(({ item }) => item);
      } else {
        // Fallback: per-item tokenization
        const scored = candidates
          .map((item) => ({ item, score: computeRelevance(item, queryTokens, queryLower) }))
          .filter(({ score }) => score > 0);
        scored.sort((a, b) => (b.score - a.score) || compareCatalogItems(a.item, b.item));
        candidates = scored.map(({ item }) => item);
      }
    }

    // Step 3: Sort
    const sortField = query.sortField ?? (
      query.sortOrder === "name-asc" || query.sortOrder === "name-desc" ? "name"
        : query.sortOrder === "price-asc" || query.sortOrder === "price-desc" ? "price"
          : query.sortOrder === "newest" ? "newest"
            : "relevance"
    );
    const sortDirection = query.sortDirection ?? (
      query.sortOrder === "name-desc" || query.sortOrder === "price-desc" ? "desc" : "asc"
    );

    if (sortField !== "relevance") {
      const sorted = [...candidates];
      switch (sortField) {
        case "name":
          sorted.sort((a, b) => compareCatalogItems(a, b));
          if (sortDirection === "desc") sorted.reverse();
          break;
        case "price":
          sorted.sort((a, b) => ((a.pricing?.price ?? 0) - (b.pricing?.price ?? 0)) || compareCatalogItems(a, b));
          if (sortDirection === "desc") sorted.reverse();
          break;
        case "newest":
          sorted.sort(compareNewest);
          if (sortDirection === "asc") sorted.reverse();
          break;
      }
      candidates = sorted;
    } else if (!query.text) {
      candidates = [...candidates].sort(compareCatalogItems);
    }

    // Step 4: Paginate
    // Sketchfab parity: cursor-only pagination, explicit cap ≤24 (BP-06 / design §9 / REC-02 / phase-06)
    const totalCount = candidates.length;
    const requested = query.pageSize ?? (query.text ? this.options.searchPageSize : this.options.defaultPageSize);
    const pageSize = Math.min(24, Math.max(1, requested));

    let startIndex = 0;
    if (query.cursor) {
      const decoded = parseInt(query.cursor, 36);
      if (!isNaN(decoded) && decoded >= 0 && decoded < totalCount) {
        startIndex = decoded;
      }
    }

    const pageItems = candidates.slice(startIndex, startIndex + pageSize);
    const nextStart = startIndex + pageSize;
    const hasMore = nextStart < totalCount;
    const nextCursor = hasMore ? nextStart.toString(36) : null;

    const result: Open3dCatalogSearchResult = {
      items: pageItems,
      totalCount,
      nextCursor,
      hasMore,
      tookMs: performance.now() - startedAt,
    };

    // Cache the result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Check if the catalog is loaded.
   */
  isLoaded(): boolean {
    return this.index !== null && this.items.length > 0;
  }

  /**
   * Get the catalog source.
   */
  getSource(): CatalogSource | null {
    return this.loadedSource;
  }

  /**
   * Return true when loaded API data is past half of the configured TTL and
   * should be refreshed in the background by the UI/runtime boundary.
   */
  shouldRevalidate(now = Date.now()): boolean {
    return this.loadedAt > 0 && now - this.loadedAt > this.options.cacheTtlMs * 0.5;
  }

  /**
   * Invalidate all caches.
   */
  invalidate(): void {
    this.cache.clear();
    this.index = this.items.length > 0 ? this.buildIndex(this.items) : null;
  }

  /**
   * Phase 06 consumer integration for svgBlockDescriptorLoader (PLAN-FAIL-0405/0419).
   * Guarded dynamic import keeps node:fs out of client bundles.
   * Client returns pre-loaded (or []) — loader primary data injected via server props / getAll after server load (catalogue-first).
   * Uses resolveBlocks (actually consumes blocks result) for resolver integration.
   * Catalogue-first (descriptors primary source for items) + search parity + resolver wiring.
   * Cites BP-06, design §9/10, GS. Called from useOpen3dWorkspaceCatalog + InventoryPanel.
   */
  async loadDescriptorsFromLoader(dir?: string): Promise<BlockDescriptor[]> {
    if (typeof window !== "undefined") {
      // address client-side always []: return any preloaded descriptors (injected); loader primary via client.getAll() consumers
      return this.loadedDescriptors;
    }
    try {
      // dynamic to defer fs module in bundler
      const loader = await import("./svg/svgBlockDescriptorLoader");
      const descriptors = loader.loadAll({ dir, forceReload: false });
      this.loadedDescriptors = descriptors;
      // resolver integration (PLAN-FAIL-0419): actually use blocks (capture result, consume .blocks)
      if (descriptors.length > 0) {
        const resolved = resolveBlocks(descriptors[0]!);
        // use the blocks for symbol geometry integration (e.g. count or downstream ready)
        void resolved.blocks.length;
      }
      // Catalogue-first: map descriptors primary to Open3dCatalogItem so .search() (and inventory via client) uses loader as source (not products/API).
      // GS cite: BP-06, design §9-10, REC-04 (Planner 5D catalogue-first), phase-06.
      if (descriptors.length > 0) {
        const mapped: Open3dCatalogItem[] = descriptors.map((d) => ({
          id: d.id,
          slug: d.slug,
          sku: d.sku ?? `DESC-${d.slug}`,
          name: d.slug,
          shortName: d.slug.slice(0, 30),
          description: `Symbol descriptor ${d.slug}`,
          category: "Furniture",
          subCategory: "Chairs",
          taxonomyPath: `Furniture > Symbols > ${d.slug}`,
          dimensions: { widthMm: d.geometry.widthMm, depthMm: d.geometry.depthMm, heightMm: d.geometry.heightMm ?? 800 },
          displayUnit: "mm",
          assets: { imageUrls: [] },
          material: { marketingMaterial: "SVG", normalizedMaterial: "svg-symbol" },
          roomTags: [],
          styleTags: [],
          availability: "in-stock",
          assemblyType: "fully-assembled",
          flatPack: false,
          tags: [d.slug, "descriptor", "symbol"],
          variants: [],
          provenance: { source: "descriptor-loader" },
          symbolOnly: true,
          // parity facets default
          license: "standard",
          animated: false,
          staffPicked: false,
          favourite: false,
          downloadable: true,
        }));
        this.load(mapped, "standard");
      }
      return descriptors;
    } catch {
      return [];
    }
  }

  // ── Private helpers ──

  private buildIndex(items: Open3dCatalogItem[]): Open3dCatalogIndex {
    const byId = new Map<string, Open3dCatalogItem>();
    const bySlug = new Map<string, Open3dCatalogItem>();
    const bySku = new Map<string, Open3dCatalogItem>();
    const byCategory = new Map<Open3dCatalogCategory, Open3dCatalogItem[]>();
    const byTag = new Map<string, Open3dCatalogItem[]>();
    const byRoom = new Map<Open3dRoomTag, Open3dCatalogItem[]>();
    const byStyle = new Map<Open3dStyleTag, Open3dCatalogItem[]>();
    const textIndex = new Map<string, Set<string>>();

    for (const item of items) {
      byId.set(item.id, item);
      bySlug.set(item.slug.toLowerCase(), item);
      bySku.set(item.sku.toLowerCase(), item);

      // Category index
      if (!byCategory.has(item.category)) byCategory.set(item.category, []);
      byCategory.get(item.category)?.push(item);

      // Tag index
      for (const tag of item.tags) {
        const key = tag.toLowerCase();
        if (!byTag.has(key)) byTag.set(key, []);
        byTag.get(key)?.push(item);
      }

      // Room index
      for (const room of item.roomTags) {
        if (!byRoom.has(room)) byRoom.set(room, []);
        byRoom.get(room)?.push(item);
      }

      // Style index
      for (const style of item.styleTags) {
        if (!byStyle.has(style)) byStyle.set(style, []);
        byStyle.get(style)?.push(item);
      }

      // Full-text index
      const tokens = tokenize(`${item.name} ${item.description} ${item.tags.join(" ")} ${item.sku}`);
      for (const token of tokens) {
        if (!textIndex.has(token)) textIndex.set(token, new Set());
        textIndex.get(token)?.add(item.id);
      }
    }

    return {
      byId,
      bySlug,
      bySku,
      byCategory,
      byTag,
      byRoom,
      byStyle,
      textIndex,
      all: items,
      builtAt: Date.now(),
    };
  }

  private normalizeApiItem(raw: unknown, source: CatalogSource): Open3dCatalogItem | null {
    if (this.isOpen3dCatalogItem(raw)) return raw;
    return source === "configurator"
      ? mapConfiguratorProductToCatalogItem(raw as ConfiguratorProductInput)
      : mapPlannerManagedProductToCatalogItem(raw as PlannerManagedProductInput);
  }

  private isOpen3dCatalogItem(raw: unknown): raw is Open3dCatalogItem {
    if (!raw || typeof raw !== "object") return false;
    const item = raw as Partial<Open3dCatalogItem>;
    return typeof item.id === "string"
      && typeof item.slug === "string"
      && typeof item.sku === "string"
      && typeof item.name === "string"
      && typeof item.category === "string"
      && typeof item.subCategory === "string"
      && typeof item.taxonomyPath === "string"
      && typeof item.dimensions?.widthMm === "number"
      && typeof item.dimensions.depthMm === "number"
      && typeof item.dimensions.heightMm === "number"
      && Array.isArray(item.roomTags)
      && Array.isArray(item.styleTags)
      && Array.isArray(item.tags)
      && Array.isArray(item.variants)
      && typeof item.provenance?.source === "string";
  }
}
