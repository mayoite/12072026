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
function isUsableDescriptor(value: unknown): value is BlockDescriptor {
  if (!value || typeof value !== "object") return false;
  const row = value as BlockDescriptor;
  const geometry = row.geometry;
  if (!geometry || typeof geometry !== "object") return false;
  return (
    typeof geometry.widthMm === "number" &&
    Number.isFinite(geometry.widthMm) &&
    typeof geometry.depthMm === "number" &&
    Number.isFinite(geometry.depthMm) &&
    typeof row.slug === "string" &&
    row.slug.trim() !== ""
  );
}

export async function loadBuyerVisibleDescriptorsWithDb(): Promise<BlockDescriptor[]> {
  if (!isProductsDatabaseConfigured()) {
    return loadBuyerVisibleDescriptors();
  }

  try {
    const rows = await productsDb.select().from(blockDescriptors).execute() as {
      slug: string;
      descriptor: unknown;
    }[];
    if (!rows || rows.length === 0) {
      return loadBuyerVisibleDescriptors();
    }

    const manifest = readLifecycleManifest();
    const fromDb = rows
      .filter((row) => isBuyerVisibleSlug(row.slug, manifest))
      .map((row) => row.descriptor)
      .filter(isUsableDescriptor);

    // Empty DB during cutover may still fall back to disk; stub/corrupt rows must not.
    if (fromDb.length === 0) {
      return rows.length > 0 ? [] : loadBuyerVisibleDescriptors();
    }
    return fromDb;
  } catch {
    return [];
  }
}
