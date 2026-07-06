/**
 * Phase 03 Recent Items and Favorites
 *
 * localStorage-backed persistence with schema versioning, deduplication
 * by SKU, max-item limits, and timestamp ordering.
 *
 * Recent items: max 50, reverse-chronological, deduplicated by SKU.
 * Favorites: max 200, category-filterable view, add/remove/isFavorite.
 */

import type {
  Open3dCatalogItem,
  Open3dCatalogCategory,
  Open3dRecentItemEntry,
  Open3dFavoriteEntry,
  Open3dRecentItemsData,
  Open3dFavoritesData,
} from "./catalogTypes";

// ── Storage keys ──

const RECENT_KEY = "open3d-catalog-recent";
const FAVORITES_KEY = "open3d-catalog-favorites";

const MAX_RECENT_ITEMS = 50;
const MAX_FAVORITE_ITEMS = 200;

// ── Schema version ──

const CURRENT_SCHEMA_VERSION = 1;

// ── Safe localStorage helpers ──

/**
 * Validate that parsed data has required schema structure.
 */
function isValidRecentItemsData(data: unknown): data is Open3dRecentItemsData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.schemaVersion !== "number") return false;
  if (!Array.isArray(obj.items)) return false;
  // Validate first few items structure
  const items = obj.items as unknown[];
  const sampleSize = Math.min(items.length, 5);
  for (let i = 0; i < sampleSize; i++) {
    const item = items[i] as Record<string, unknown>;
    if (typeof item.sku !== "string" || typeof item.catalogId !== "string" || typeof item.name !== "string") {
      return false;
    }
  }
  return true;
}

function isValidFavoritesData(data: unknown): data is Open3dFavoritesData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.schemaVersion !== "number") return false;
  if (!Array.isArray(obj.items)) return false;
  const items = obj.items as unknown[];
  const sampleSize = Math.min(items.length, 5);
  for (let i = 0; i < sampleSize; i++) {
    const item = items[i] as Record<string, unknown>;
    if (typeof item.catalogId !== "string" || typeof item.sku !== "string" || typeof item.name !== "string") {
      return false;
    }
  }
  return true;
}

function safeRead<T>(key: string, fallback: T, validator?: (data: unknown) => data is T): T {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Run schema validation if validator provided
    if (validator && !validator(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently degrade
  }
}

// ── Recent items ──

/**
 * Add a catalog item to recent items.
 * Deduplicates by SKU, enforces max count, maintains reverse-chronological order.
 */
export function addRecentItem(item: Pick<Open3dCatalogItem, "sku" | "id" | "name">): void {
  const data = readRecentItems();
  const now = new Date().toISOString();

  // Remove existing entry with same SKU (deduplication)
  data.items = data.items.filter((entry) => entry.sku !== item.sku);

  // Prepend new entry
  data.items.unshift({
    sku: item.sku,
    catalogId: item.id,
    name: item.name,
    lastUsedAt: now,
  });

  // Enforce max count
  if (data.items.length > MAX_RECENT_ITEMS) {
    data.items = data.items.slice(0, MAX_RECENT_ITEMS);
  }

  writeRecentItems(data);
}

/**
 * Get recent items in reverse-chronological order.
 */
export function getRecentItems(): Open3dRecentItemEntry[] {
  return readRecentItems().items;
}

/**
 * Clear all recent items.
 */
export function clearRecentItems(): void {
  writeRecentItems({ schemaVersion: CURRENT_SCHEMA_VERSION, items: [] });
}

// ── Favorites ──

/**
 * Add a catalog item to favorites.
 */
export function addFavoriteItem(
  item: Pick<Open3dCatalogItem, "id" | "sku" | "name" | "category">,
): void {
  const data = readFavorites();

  // Don't duplicate
  if (data.items.some((entry) => entry.sku === item.sku)) return;

  // Enforce max count
  if (data.items.length >= MAX_FAVORITE_ITEMS) {
    data.items.shift(); // Remove oldest
  }

  data.items.push({
    catalogId: item.id,
    sku: item.sku,
    name: item.name,
    category: item.category,
    favoritedAt: new Date().toISOString(),
  });

  writeFavorites(data);
}

/**
 * Remove a catalog item from favorites by ID.
 */
export function removeFavoriteItem(catalogId: string): void {
  const data = readFavorites();
  data.items = data.items.filter((entry) => entry.catalogId !== catalogId);
  writeFavorites(data);
}

/**
 * Check if a catalog item is favorited.
 */
export function isFavorite(catalogId: string): boolean {
  return readFavorites().items.some((entry) => entry.catalogId === catalogId);
}

/**
 * Get all favorite items.
 */
export function getFavoriteItems(): Open3dFavoriteEntry[] {
  return readFavorites().items;
}

/**
 * Get favorite items filtered by category.
 */
export function getFavoritesByCategory(category: Open3dCatalogCategory): Open3dFavoriteEntry[] {
  return readFavorites().items.filter((entry) => entry.category === category);
}

// ── Schema migration ──

/**
 * Migrate localStorage data from an older schema version to the current version.
 */
export function migrateRecentItemsSchema(): void {
  const data = readRecentItems();
  if (data.schemaVersion === CURRENT_SCHEMA_VERSION) return;

  // Future migrations go here:
  // if (data.schemaVersion === 1) { ... upgrade to 2 ... }

  data.schemaVersion = CURRENT_SCHEMA_VERSION;
  writeRecentItems(data);
}

export function migrateFavoritesSchema(): void {
  const data = readFavorites();
  if (data.schemaVersion === CURRENT_SCHEMA_VERSION) return;

  // Future migrations go here

  data.schemaVersion = CURRENT_SCHEMA_VERSION;
  writeFavorites(data);
}

// ── Internal read/write ──

function readRecentItems(): Open3dRecentItemsData {
  return safeRead<Open3dRecentItemsData>(
    RECENT_KEY,
    { schemaVersion: CURRENT_SCHEMA_VERSION, items: [] },
    isValidRecentItemsData,
  );
}

function writeRecentItems(data: Open3dRecentItemsData): void {
  safeWrite(RECENT_KEY, data);
}

function readFavorites(): Open3dFavoritesData {
  return safeRead<Open3dFavoritesData>(
    FAVORITES_KEY,
    { schemaVersion: CURRENT_SCHEMA_VERSION, items: [] },
    isValidFavoritesData,
  );
}

function writeFavorites(data: Open3dFavoritesData): void {
  safeWrite(FAVORITES_KEY, data);
}
