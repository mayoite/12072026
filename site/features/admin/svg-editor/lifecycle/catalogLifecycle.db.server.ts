import "server-only";

import { eq } from "drizzle-orm";

import { productsDb } from "@/platform/drizzle/productsDb";
import { isProductsDatabaseConfigured } from "@/platform/drizzle/databaseUrls";
import {
  blockDescriptors,
  plannerManagedProducts,
} from "@/platform/drizzle/schema/catalog";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { PlannerSvgCatalogDescriptor } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { SvgBlockDefinitionV1Schema } from "@/features/admin/svg-editor/contracts/svgBlockSchemas";
import {
  loadBuyerVisibleDescriptors,
  readLifecycleManifest,
  isBuyerVisibleSlug,
} from "./catalogLifecycle";
import { isDbSvgReleaseAuthority } from "@/features/admin/svg-editor/publish/svgReleaseAuthority";

/**
 * Load buyer-visible descriptors from the Products DB when configured.
 *
 * Disk authority (default):
 * - Start from full disk inventory (migration / partial dual-write safe).
 * - Overlay `publishedSvgRevisionId` from Products DB when a dual-written row exists.
 * - Partial dual-write of 1 SKU must not hide the other ~19 disk plan symbols.
 *
 * DB authority (`SVG_RELEASE_AUTHORITY=db`):
 * - Return only usable DB rows (never silent disk override — DB-SVG-16).
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

function toPlannerCatalogDescriptor(row: {
  readonly slug: string;
  readonly descriptor: unknown;
  readonly publishedSvgRevisionId?: string | null;
}): PlannerSvgCatalogDescriptor | null {
  const revisionId =
    typeof row.publishedSvgRevisionId === "string"
      ? row.publishedSvgRevisionId.trim()
      : "";
  const revisionField =
    revisionId && /^[a-z][a-z0-9-]{1,127}$/i.test(revisionId)
      ? { publishedSvgRevisionId: revisionId }
      : {};

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
      ...revisionField,
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
    ...revisionField,
  };
}

export async function loadBuyerVisibleDescriptorsWithDb(): Promise<
  Array<BlockDescriptor | PlannerSvgCatalogDescriptor>
> {
  const dbAuthority = isDbSvgReleaseAuthority();

  if (!isProductsDatabaseConfigured()) {
    // DB authority without Products DB is an empty catalog (no disk override).
    return dbAuthority ? [] : loadBuyerVisibleDescriptors({ forceReload: true });
  }

  try {
    const rows = (await productsDb
      .select({
        slug: blockDescriptors.slug,
        descriptor: blockDescriptors.descriptor,
        publishedSvgRevisionId: plannerManagedProducts.publishedSvgRevisionId,
      })
      .from(blockDescriptors)
      .leftJoin(
        plannerManagedProducts,
        eq(plannerManagedProducts.plannerSourceSlug, blockDescriptors.slug),
      )
      .execute()) as {
      slug: string;
      descriptor: unknown;
      publishedSvgRevisionId?: string | null;
    }[];

    if (!rows || rows.length === 0) {
      return dbAuthority ? [] : loadBuyerVisibleDescriptors();
    }

    const manifest = readLifecycleManifest();
    const fromDb = rows
      .filter((row) => isBuyerVisibleSlug(row.slug, manifest))
      .map(toPlannerCatalogDescriptor)
      .filter(
        (descriptor): descriptor is PlannerSvgCatalogDescriptor =>
          descriptor !== null,
      );

    if (dbAuthority) {
      // Cutover mode: only immutable DB catalog (empty if unusable).
      return fromDb;
    }

    // Disk authority + partial dual-write: merge disk inventory with revision pointers.
    // forceReload: Admin publish must show up without relying on cross-isolate cache clears.
    const disk = loadBuyerVisibleDescriptors({ forceReload: true });
    const bySlug = new Map<string, BlockDescriptor | PlannerSvgCatalogDescriptor>();
    for (const d of disk) {
      const slug = typeof d.slug === "string" ? d.slug : "";
      if (slug) bySlug.set(slug, d);
    }
    for (const dbRow of fromDb) {
      const existing = bySlug.get(dbRow.slug);
      if (existing && "geometry" in existing) {
        bySlug.set(dbRow.slug, {
          ...existing,
          ...(dbRow.publishedSvgRevisionId
            ? { publishedSvgRevisionId: dbRow.publishedSvgRevisionId }
            : {}),
          // Prefer DB geometry when present (authoritative dual-write body).
          geometry: dbRow.geometry ?? (existing as BlockDescriptor).geometry,
          id: dbRow.id || (existing as BlockDescriptor).id,
          sku: dbRow.sku ?? (existing as BlockDescriptor).sku,
        } as PlannerSvgCatalogDescriptor);
      } else {
        bySlug.set(dbRow.slug, dbRow);
      }
    }
    return Array.from(bySlug.values());
  } catch {
    // DB configured but unreachable: under disk authority keep disk catalog;
    // under db authority fail closed (empty).
    return isDbSvgReleaseAuthority() ? [] : loadBuyerVisibleDescriptors();
  }
}
