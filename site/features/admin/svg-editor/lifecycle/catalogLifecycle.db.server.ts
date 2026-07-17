import "server-only";

import { productsDb } from "@/platform/drizzle/productsDb";
import { isProductsDatabaseConfigured } from "@/platform/drizzle/databaseUrls";
import { blockDescriptors } from "@/platform/drizzle/schema/catalog";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { PlannerSvgCatalogDescriptor } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { SvgBlockDefinitionV1Schema } from "@/features/admin/svg-editor/contracts/svgBlockSchemas";
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

function finitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function toPlannerCatalogDescriptor(
  row: { readonly slug: string; readonly descriptor: unknown },
): PlannerSvgCatalogDescriptor | null {
  if (isUsableDescriptor(row.descriptor)) {
    if (row.descriptor.slug !== row.slug) return null;
    const { geometry } = row.descriptor;
    if (
      !finitePositive(geometry.widthMm) ||
      !finitePositive(geometry.depthMm) ||
      !finitePositive(geometry.heightMm)
    ) {
      return null;
    }
    return {
      id:
        typeof row.descriptor.id === "string" && row.descriptor.id.trim() !== ""
          ? row.descriptor.id
          : row.slug,
      slug: row.slug,
      sku: row.descriptor.sku,
      geometry,
    };
  }

  const legacyDefinition = SvgBlockDefinitionV1Schema.safeParse(row.descriptor);
  if (!legacyDefinition.success || legacyDefinition.data.typeId !== row.slug) {
    return null;
  }
  const definition = legacyDefinition.data;
  return {
    id: row.slug,
    slug: row.slug,
    sku: definition.sku,
    name: definition.name,
    tags: definition.tags,
    geometry: {
      widthMm: definition.physicalDimensionsMm.width,
      depthMm: definition.physicalDimensionsMm.depth,
      heightMm: definition.physicalDimensionsMm.height,
    },
  };
}

export async function loadBuyerVisibleDescriptorsWithDb(): Promise<
  Array<BlockDescriptor | PlannerSvgCatalogDescriptor>
> {
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
      .map(toPlannerCatalogDescriptor)
      .filter((descriptor): descriptor is PlannerSvgCatalogDescriptor => descriptor !== null);

    // Empty DB during cutover may still fall back to disk; stub/corrupt rows must not.
    if (fromDb.length === 0) {
      return rows.length > 0 ? [] : loadBuyerVisibleDescriptors();
    }
    return fromDb;
  } catch {
    return [];
  }
}
