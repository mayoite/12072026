import "server-only";

import { productsDb } from "@/platform/drizzle/productsDb";
import { isProductsDatabaseConfigured } from "@/platform/drizzle/databaseUrls";
import { blockDescriptors } from "@/platform/drizzle/schema/catalog";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import {
  loadBuyerVisibleDescriptors,
  readLifecycleManifest,
  isBuyerVisibleSlug,
} from "./catalogLifecycle";

/**
 * Load buyer-visible descriptors from the Products DB when configured,
 * falling back to disk-based inventory/descriptors/ otherwise.
 */
export function loadBuyerVisibleDescriptorsWithDb(): BlockDescriptor[] {
  if (!isProductsDatabaseConfigured()) {
    return loadBuyerVisibleDescriptors();
  }

  try {
    const rows = productsDb.select().from(blockDescriptors).execute() as unknown as {
      slug: string;
      descriptor: unknown;
    }[];
    if (!rows || rows.length === 0) {
      return loadBuyerVisibleDescriptors();
    }

    const manifest = readLifecycleManifest();
    return rows
      .filter((row) => isBuyerVisibleSlug(row.slug, manifest))
      .map((row) => row.descriptor as BlockDescriptor);
  } catch {
    return loadBuyerVisibleDescriptors();
  }
}
