import Fuse from "fuse.js";

import type { Open3dCatalogItem } from "./catalogTypes";

/**
 * Maximum catalogue results surfaced to the planner at once (REC-02,
 * `00-REVISION.md` Decision 2 / `02-PHASE-1.md` §1A). Keeps the catalogue grid
 * scannable and bounds render cost; deeper browsing happens through filters and
 * categories rather than an unbounded result list.
 */
export const OPEN3D_CATALOG_RESULT_CAP = 24;

/**
 * Clamp a result list to the catalogue cap. Non-mutating; returns the input
 * unchanged when already within the cap.
 */
export function capCatalogResults<T>(
  items: readonly T[],
  cap: number = OPEN3D_CATALOG_RESULT_CAP,
): T[] {
  return items.length > cap ? items.slice(0, cap) : [...items];
}

export interface PlannerCatalogCollectionItem {
  key: string;
  textValue: string;
  item: Open3dCatalogItem;
}

export function rankCatalogItems(
  items: readonly Open3dCatalogItem[],
  query: string,
): Open3dCatalogItem[] {
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
  items: readonly Open3dCatalogItem[],
): PlannerCatalogCollectionItem[] {
  return items.map((item) => ({
    key: item.id,
    textValue: `${item.name} ${item.shortName} ${item.sku}`.trim(),
    item,
  }));
}
