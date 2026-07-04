/**
 * Phase 03 Catalog Mapping
 *
 * Maps OOFPLWeb planner catalog API responses into the canonical
 * Open3dCatalogItem domain model. Preserves all source identity fields
 * (plannerSourceSlug, legacyProductId, categoryId, seriesId) for
 * BOQ/quote/export/AI traceability.
 *
 * Bridges from:
 *   - /api/planner/catalog (planner_managed_products)
 *   - /api/planner/catalog/configurator (configurator_products)
 */

import type {
  Open3dCatalogItem,
  Open3dCatalogCategory,
  Open3dCatalogProvenance,
  Open3dCatalogVariant,
  Open3dAvailabilityStatus,
  Open3dRoomTag,
  Open3dStyleTag,
  Open3dAssetReadiness,
  Open3dMountingContract,
} from "./catalogTypes";
import {
  buildTaxonomyPath,
  buildShortName,
  normalizeMaterial,
  normalizeColor,
  normalizeAssemblyType,
} from "./catalogTaxonomy";
import {
  canonicalDimensionsFromCatalogCm,
  configuratorHeightCmFromMixedUnit,
} from "./unitConversion";

// ── Types for OOFPLWeb API inputs ──

/**
 * Shape of a row from /api/planner/catalog (planner_managed_products).
 * Mirrors PlannerManagedProductRow from site/features/planner/model.
 */
export interface PlannerManagedProductInput {
  id: string;
  legacy_product_id?: string | null;
  slug: string;
  planner_source_slug?: string;
  name: string;
  description?: string;
  category?: string;
  category_id?: string;
  category_name?: string;
  series_id?: string;
  series_name?: string;
  price?: number;
  flagship_image?: string;
  images?: string[];
  specs?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  active?: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Shape of a product from /api/planner/catalog/configurator.
 * Mirrors Product from site/lib/catalog/types.ts.
 */
export interface ConfiguratorProductInput {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  family?: string;
  brandName?: string;
  description?: string;
  thumbnailUrl?: string;
  model3dUrl?: string;
  sizingType?: "parametric" | "discrete" | "fixed";
  workstation?: {
    shape?: string;
    lengthOptions?: number[];
    depthOptions?: number[];
    seaterOptions?: number[];
    heightMm?: number;
    sharing?: string;
  };
  sizeOptions?: Array<{ dim: { L: number; D: number; H?: number } }>;
  defaultFootprint?: { L: number; D: number; H?: number };
  specs?: {
    materials?: string[];
    dimensions?: string;
    features?: string[];
  };
}

// ── Category mapping ──

/**
 * Map OOFPLWeb admin/workspace category strings to canonical Open3dCatalogCategory.
 * Based on the existing mapAdminCategoryToWorkspace logic but extended to canonical types.
 */
export function mapAdminCategoryToCanonical(
  category: string,
  subcategory?: string | null,
): Open3dCatalogCategory {
  const blob = `${category} ${subcategory ?? ""}`.toLowerCase();
  if (blob.includes("desk") || blob.includes("workstation") || blob.includes("bench")) return "Furniture";
  if (blob.includes("room") || blob.includes("booth") || blob.includes("pod") || blob.includes("meeting")) return "Furniture";
  if (blob.includes("storage") || blob.includes("locker") || blob.includes("cabinet") || blob.includes("wardrobe")) return "Furniture";
  if (blob.includes("chair") || blob.includes("seat") || blob.includes("stool")) return "Furniture";
  if (blob.includes("table")) return "Furniture";
  if (blob.includes("sofa") || blob.includes("sectional") || blob.includes("loveseat")) return "Furniture";
  if (blob.includes("bed")) return "Furniture";
  if (blob.includes("light") || blob.includes("lamp") || blob.includes("chandelier")) return "Lighting";
  if (blob.includes("rug") || blob.includes("plant") || blob.includes("curtain") || blob.includes("mirror") || blob.includes("art")) return "Decor";
  if (blob.includes("outdoor") || blob.includes("patio") || blob.includes("garden") || blob.includes("bbq")) return "Outdoor";
  if (blob.includes("zone") || blob.includes("infra") || blob.includes("wifi") || blob.includes("display") || blob.includes("electrical") || blob.includes("plumbing")) return "Symbols";
  if (blob.includes("kitchen") || blob.includes("dining") || blob.includes("cook")) return "Kitchen & Dining";
  if (blob.includes("textile") || blob.includes("duvet") || blob.includes("pillow") || blob.includes("throw")) return "Bedding & Textiles";
  return "Furniture";
}

/**
 * Infer room tags from category and subcategory strings.
 */
export function inferRoomTags(category: string, subcategory?: string | null): Open3dRoomTag[] {
  const blob = `${category} ${subcategory ?? ""}`.toLowerCase();
  const tags: Open3dRoomTag[] = [];
  if (blob.includes("living")) tags.push("Living Room");
  if (blob.includes("bedroom")) tags.push("Bedroom");
  if (blob.includes("kitchen")) tags.push("Kitchen");
  if (blob.includes("bathroom")) tags.push("Bathroom");
  if (blob.includes("office") || blob.includes("workstation") || blob.includes("desk")) tags.push("Office");
  if (blob.includes("dining")) tags.push("Dining");
  if (blob.includes("outdoor") || blob.includes("patio") || blob.includes("garden")) tags.push("Outdoor");
  if (blob.includes("garage")) tags.push("Garage");
  if (blob.includes("utility")) tags.push("Utility");
  if (blob.includes("kids") || blob.includes("nursery") || blob.includes("children")) tags.push("Kids & Nursery");
  return tags.length > 0 ? tags : ["Office"];
}

/**
 * Infer style tags from product name and description.
 * Simplified heuristic — production would use ML-based tagging (Wayfair approach).
 */
export function inferStyleTags(name: string, description?: string): Open3dStyleTag[] {
  const blob = `${name} ${description ?? ""}`.toLowerCase();
  const tags: Open3dStyleTag[] = [];
  if (blob.includes("modern") || blob.includes("contemporary")) tags.push("Modern");
  if (blob.includes("scandinavian") || blob.includes("scandi") || blob.includes("nordic")) tags.push("Scandinavian");
  if (blob.includes("industrial")) tags.push("Industrial");
  if (blob.includes("traditional") || blob.includes("classic")) tags.push("Traditional");
  if (blob.includes("coastal")) tags.push("Coastal");
  if (blob.includes("boho") || blob.includes("bohemian")) tags.push("Boho");
  if (blob.includes("mid-century") || blob.includes("midcentury")) tags.push("Mid-Century");
  if (blob.includes("minimalist") || blob.includes("minimal")) tags.push("Minimalist");
  if (blob.includes("rustic")) tags.push("Rustic");
  return tags.length > 0 ? tags : ["Modern"];
}

/**
 * Resolve subcategory from category data.
 */
export function resolveSubCategory(
  category: string,
  seriesName?: string | null,
  family?: string | null,
): string {
  if (seriesName && seriesName.trim().length > 0) return seriesName.trim();
  if (family && family.trim().length > 0) return family.trim();
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("desk") || normalized.includes("workstation")) return "Desks";
  if (normalized.includes("sofa") || normalized.includes("sectional")) return "Sofas & Sectionals";
  if (normalized.includes("chair")) return "Chairs";
  if (normalized.includes("table")) return "Tables";
  if (normalized.includes("storage") || normalized.includes("wardrobe") || normalized.includes("cabinet")) return "Storage";
  if (normalized.includes("bed")) return "Beds";
  if (normalized.includes("light")) return "Lighting";
  return category.trim();
}

/**
 * Resolve availability status from product data.
 */
export function resolveAvailabilityStatus(input: {
  active?: boolean;
  visible?: boolean;
  plannerVisible?: boolean;
}): Open3dAvailabilityStatus {
  if (input.active === false || input.visible === false || input.plannerVisible === false) {
    return "discontinued";
  }
  return "in-stock";
}

function resolveMountingContract(category: Open3dCatalogCategory, subCategory: string): Open3dMountingContract[] {
  const blob = `${category} ${subCategory}`.toLowerCase();
  if (blob.includes("ceiling")) return ["ceiling"];
  if (blob.includes("wall") || blob.includes("mirror") || blob.includes("art") || blob.includes("sconce")) return ["wall"];
  if (category === "Lighting" && blob.includes("pendant")) return ["ceiling"];
  if (category === "Symbols") return ["wall", "ceiling", "floor"];
  return ["floor"];
}

function resolveAssetReadiness(params: { imageUrl?: string; meshUrl?: string; symbolOnly?: boolean }): Open3dAssetReadiness[] {
  const readiness: Open3dAssetReadiness[] = [];
  if (!params.imageUrl) readiness.push("missing-image");
  if (!params.symbolOnly && !params.meshUrl) readiness.push("missing-mesh");
  return readiness.length > 0 ? readiness : ["ready"];
}

// ── Mapping functions ──

/**
 * Map a planner managed product row to a canonical Open3dCatalogItem.
 */
export function mapPlannerManagedProductToCatalogItem(
  input: PlannerManagedProductInput,
): Open3dCatalogItem | null {
  if (!input.id || !input.name) return null;

  const specs = input.specs ?? {};
  const widthCm = Number(specs.widthMm ?? specs.width_mm ?? 0);
  const depthCm = Number(specs.depthMm ?? specs.depth_mm ?? 0);
  // NAMING DEBT: specs.heightMm stores centimetres despite the "Mm" suffix.
  // This matches the OOFPLWeb planner_managed_products column convention.
  // See unitConversion.ts: canonicalMmFromCatalogCm / configuratorHeightCmFromMixedUnit.
  const heightCm = Number(specs.heightMm ?? specs.height_mm ?? 75);
  if (!widthCm || !depthCm) return null;

  const category = mapAdminCategoryToCanonical(input.category ?? "Office", input.series_name);
  const subCategory = resolveSubCategory(input.category ?? "Office", input.series_name);
  const taxonomyPath = buildTaxonomyPath(category, subCategory);
  const dimensions = canonicalDimensionsFromCatalogCm({
    widthCm,
    depthCm,
    heightCm,
    weightKg: undefined,
  });
  const materialName = typeof specs.material === "string" ? specs.material : "Admin catalog";
  const material = normalizeMaterial(materialName);

  const name = input.name.trim();
  const description = input.description ?? `${input.category_name ?? ""} · ${input.series_name ?? ""}`;

  const provenance: Open3dCatalogProvenance = {
    source: "planner_managed_products",
    legacyProductId: input.legacy_product_id ?? undefined,
    plannerSourceSlug: input.planner_source_slug ?? undefined,
    sourceCategoryId: input.category_id ?? undefined,
    sourceSeriesId: input.series_id ?? undefined,
    importedAt: new Date().toISOString(),
  };

  const item: Open3dCatalogItem = {
    id: input.id,
    slug: input.slug || input.id,
    sku: input.slug || input.id,
    name,
    shortName: buildShortName(name),
    description,
    category,
    subCategory,
    taxonomyPath,
    dimensions,
    displayUnit: "cm",
    assets: {
      previewImageUrl: input.flagship_image || (input.images?.[0]) || undefined,
      imageUrls: input.images ?? [],
      meshUrl: undefined,
    },
    material,
    roomTags: inferRoomTags(input.category ?? "Office", input.series_name),
    styleTags: inferStyleTags(name, description),
    tags: [
      "managed",
      input.category ?? "",
      input.series_name ?? "",
      material.normalizedMaterial,
    ].filter(Boolean),
    availability: resolveAvailabilityStatus({ active: input.active }),
    assemblyType: normalizeAssemblyType("partial"),
    configurability: "fixed",
    mounting: resolveMountingContract(category, subCategory),
    assetReadiness: resolveAssetReadiness({ imageUrl: input.flagship_image || input.images?.[0] }),
    flatPack: false,
    variants: [],
    provenance,
    symbolOnly: false,
  };

  return item;
}

/**
 * Map a configurator product to a canonical Open3dCatalogItem.
 * Only call this if configurator products are currently used in the planner.
 */
export function mapConfiguratorProductToCatalogItem(
  input: ConfiguratorProductInput,
): Open3dCatalogItem | null {
  if (!input.slug?.trim() || !input.name?.trim()) return null;

  // Resolve dimensions
  let widthCm = 0;
  let depthCm = 0;
  let heightCm = 75;

  if (input.sizingType === "parametric" && input.workstation) {
    const ws = input.workstation;
    const validLengths = (ws.lengthOptions ?? []).filter((v) => Number.isFinite(v) && v > 0);
    const validDepths = (ws.depthOptions ?? []).filter((v) => Number.isFinite(v) && v > 0);
    const validSeaters = (ws.seaterOptions ?? []).filter((v) => Number.isFinite(v) && v > 0);
    if (validLengths.length > 0 && validDepths.length > 0 && validSeaters.length > 0) {
      const minLen = Math.min(...validLengths);
      const minDep = Math.min(...validDepths);
      const minSeaters = Math.min(...validSeaters);
      widthCm = ws.shape === "l-shape" ? minLen : minSeaters * minLen;
      depthCm = ws.sharing === "sharing" ? minDep * 2 : minDep;
      heightCm = configuratorHeightCmFromMixedUnit(ws.heightMm);
    }
  } else if (input.sizingType === "discrete" && (input.sizeOptions?.length ?? 0) > 0) {
    let bestArea = Number.POSITIVE_INFINITY;
    for (const opt of input.sizeOptions ?? []) {
      const area = opt.dim.L * opt.dim.D;
      if (area > 0 && area < bestArea) {
        bestArea = area;
        widthCm = opt.dim.L;
        depthCm = opt.dim.D;
        heightCm = configuratorHeightCmFromMixedUnit(opt.dim.H);
      }
    }
  } else if (input.defaultFootprint?.L && input.defaultFootprint?.D) {
    widthCm = input.defaultFootprint.L;
    depthCm = input.defaultFootprint.D;
    heightCm = configuratorHeightCmFromMixedUnit(input.defaultFootprint.H);
  }

  if (!widthCm || !depthCm) return null;

  const category = mapAdminCategoryToCanonical(input.category_id, input.family);
  const subCategory = resolveSubCategory(input.category_id, null, input.family);
  const taxonomyPath = buildTaxonomyPath(category, subCategory);
  const dimensions = canonicalDimensionsFromCatalogCm({
    widthCm,
    depthCm,
    heightCm,
  });

  const name = input.name.trim();
  const description = input.description ?? "";
  const materialName = input.specs?.materials?.[0] ?? "Configurator";
  const material = normalizeMaterial(materialName);

  const provenance: Open3dCatalogProvenance = {
    source: "configurator_products",
    sourceCategoryId: input.category_id,
    importedAt: new Date().toISOString(),
  };

  // Build a master variant
  const masterVariant: Open3dCatalogVariant = {
    variantId: `${input.slug}-master`,
    sku: input.slug,
    parentProductId: input.slug,
    label: name,
    variantAttributes: {},
    dimensions,
    imageUrl: input.thumbnailUrl,
    meshUrl: input.model3dUrl,
    availability: "in-stock",
  };

  const seatCount =
    input.sizingType === "parametric"
      ? (() => {
        const opts = input.workstation?.seaterOptions ?? [];
        const valid = opts.filter((v) => v > 0);
        return valid.length > 0 ? Math.min(...valid) : undefined;
      })()
      : undefined;

  const item: Open3dCatalogItem = {
    id: input.slug,
    slug: input.slug,
    sku: input.slug,
    name,
    shortName: buildShortName(name),
    description,
    category,
    subCategory,
    taxonomyPath,
    dimensions,
    displayUnit: "cm",
    assets: {
      previewImageUrl: input.thumbnailUrl,
      imageUrls: input.thumbnailUrl ? [input.thumbnailUrl] : [],
      meshUrl: input.model3dUrl,
    },
    material,
    roomTags: inferRoomTags(input.category_id, input.family),
    styleTags: inferStyleTags(name, description),
    tags: [
      "configurator",
      input.category_id,
      input.family ?? "",
      material.normalizedMaterial,
    ].filter(Boolean),
    availability: "in-stock",
    assemblyType: normalizeAssemblyType("fully-assembled"),
    configurability: input.sizingType === "parametric" ? "configurable" : "fixed",
    mounting: resolveMountingContract(category, subCategory),
    assetReadiness: resolveAssetReadiness({
      imageUrl: input.thumbnailUrl,
      meshUrl: input.model3dUrl,
    }),
    flatPack: false,
    seatCount,
    variants: [masterVariant],
    provenance,
    symbolOnly: false,
  };

  return item;
}
