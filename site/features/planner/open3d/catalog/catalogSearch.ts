import Fuse from "fuse.js";

import type { Open3dCatalogItem } from "./catalogTypes";

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
      { name: "name", weight: 0.4 },
      { name: "shortName", weight: 0.2 },
      { name: "sku", weight: 0.15 },
      { name: "tags", weight: 0.15 },
      { name: "taxonomyPath", weight: 0.1 },
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
