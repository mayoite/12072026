import Fuse from "fuse.js";

import type { PlannerCatalogItem } from "./catalogTypes";

/**
 * Default maximum catalogue results shown in the planner inventory at once.
 * Owner: multi-line multi-SKU — floor of **50** (was 24). Deeper browse via
 * filters/categories/search; raise later if needed.
 */
export const PLANNER_CATALOG_RESULT_CAP = 50;

/**
 * Clamp a result list to the catalogue cap. Non-mutating; returns a copy.
 */
export function capCatalogResults<T>(
  items: readonly T[],
  cap: number = PLANNER_CATALOG_RESULT_CAP,
): T[] {
  if (!Number.isFinite(cap) || cap <= 0) return [];
  const limit = Math.floor(cap);
  return items.length > limit ? items.slice(0, limit) : [...items];
}

export interface PlannerCatalogCollectionItem {
  key: string;
  textValue: string;
  item: PlannerCatalogItem;
}

export function rankCatalogItems(
  items: readonly PlannerCatalogItem[],
  query: string,
): PlannerCatalogItem[] {
  const normalized = query.trim();
  if (!normalized) return [...items];
  return new Fuse(items, {
    keys: [
      { name: "name", weight: 0.35 },
      { name: "shortName", weight: 0.2 },
      // Guests / docs often type catalog ids (e.g. cabinet-v0) — must rank.
      { name: "id", weight: 0.15 },
      { name: "slug", weight: 0.12 },
      { name: "sku", weight: 0.08 },
      { name: "tags", weight: 0.07 },
      { name: "taxonomyPath", weight: 0.03 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
  }).search(normalized).map((result) => result.item);
}

export function toPlannerCatalogCollection(
  items: readonly PlannerCatalogItem[],
): PlannerCatalogCollectionItem[] {
  return items.map((item) => ({
    key: item.id,
    textValue: `${item.name} ${item.shortName} ${item.sku}`.trim(),
    item,
  }));
}
