import type { CatalogItem } from "./catalogTypes";

function evictionKeys(item: CatalogItem): string[] {
  return [item.id, item.sku].filter((key): key is string => Boolean(key));
}

/** Merge catalog layers weakest → strongest with sku-aware eviction. */
export function mergeWorkspaceCatalogItemsLayered(
  ...layers: readonly (readonly CatalogItem[])[]
): CatalogItem[] {
  const byId = new Map<string, CatalogItem>();

  for (const layer of layers) {
    for (const item of layer) {
      const incomingKeys = new Set(evictionKeys(item));
      for (const [existingId, existing] of [...byId.entries()]) {
        const existingKeys = evictionKeys(existing);
        if (existingKeys.some((key) => incomingKeys.has(key))) {
          byId.delete(existingId);
        }
      }
      byId.set(item.id, item);
    }
  }

  return [...byId.values()];
}

/**
 * Merge static workspace catalog with admin-managed items.
 * Managed entries win on id/sku collision.
 */
export function mergeWorkspaceCatalogItems(
  staticItems: readonly CatalogItem[],
  managedItems: readonly CatalogItem[],
): CatalogItem[] {
  return mergeWorkspaceCatalogItemsLayered(staticItems, managedItems);
}
