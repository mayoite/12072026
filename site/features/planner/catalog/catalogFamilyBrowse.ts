/**
 * PF-22 — planner inventory family grouping, facet filters, and compare rows.
 * Pure helpers only (no React / no I/O).
 */

import type {
  PlannerAvailabilityStatus,
  PlannerCatalogItem,
} from "./catalogTypes";

export const PLANNER_CATALOG_COMPARE_MAX = 4;

export const CATALOG_FAMILY_OTHER = "Other";

export interface CatalogFacetFilters {
  /** Family key from resolveCatalogFamilyKey; null/undefined = all */
  familyKey?: string | null;
  /** Normalized material; null/undefined = all */
  material?: string | null;
  /** Availability status; null/undefined = all */
  availability?: PlannerAvailabilityStatus | null;
  /** Exact seat count match; null/undefined = all */
  seatCount?: number | null;
  minWidthMm?: number | null;
  maxWidthMm?: number | null;
  minDepthMm?: number | null;
  maxDepthMm?: number | null;
}

export interface CatalogFamilyGroup {
  readonly familyKey: string;
  readonly familyLabel: string;
  readonly items: readonly PlannerCatalogItem[];
}

export interface CatalogCompareAttribute {
  readonly key: string;
  readonly label: string;
  readonly values: readonly string[];
}

export interface CatalogCompareTable {
  readonly itemIds: readonly string[];
  readonly names: readonly string[];
  readonly attributes: readonly CatalogCompareAttribute[];
}

/** List/card metadata for inventory tiles and compare headers (PF-22). */
export interface CatalogListMetadata {
  readonly id: string;
  /** Compact display name (shortName preferred). */
  readonly name: string;
  /** Full product name when different from compact name. */
  readonly fullName: string;
  /** Master SKU or null when blank. */
  readonly sku: string | null;
  readonly family: string;
  /** Primary variant label or null when absent/redundant. */
  readonly variant: string | null;
  readonly dimsMm: {
    readonly widthMm?: number;
    readonly depthMm?: number;
    readonly heightMm?: number;
  };
  /** Formatted W×D×H mm label, or "—" when no finite dims. */
  readonly dimsLabel: string;
}

/** Stable family key used for filter/group (case-folded trim). */
export function resolveCatalogFamilyKey(item: PlannerCatalogItem): string {
  const raw = resolveCatalogFamilyLabel(item);
  return raw.trim().toLowerCase();
}

/**
 * Buyer-facing family label.
 * Prefer explicit `family`, then subCategory, then taxonomy leaf, then category.
 */
export function resolveCatalogFamilyLabel(item: PlannerCatalogItem): string {
  const explicit = item.family?.trim();
  if (explicit) return explicit;

  const sub = item.subCategory?.trim();
  if (sub) return sub;

  const path = item.taxonomyPath?.trim();
  if (path) {
    const parts = path.split(">").map((p) => p.trim()).filter(Boolean);
    const leaf = parts[parts.length - 1];
    if (leaf) return leaf;
  }

  const category = item.category?.trim();
  if (category) return category;

  return CATALOG_FAMILY_OTHER;
}

/** Primary variant label when present (master or first variant). */
export function resolveCatalogVariantLabel(
  item: PlannerCatalogItem,
): string | null {
  const variants = item.variants ?? [];
  if (variants.length === 0) return null;
  const master =
    variants.find((v) => v.variantId.endsWith("-master")) ?? variants[0];
  const label = master?.label?.trim();
  if (!label) return null;
  // Skip redundant labels that only repeat the product name.
  if (label === item.name || label === item.shortName) {
    return variants.length > 1 ? label : null;
  }
  return label;
}

/** Unique family options present in the list, sorted by label. */
export function listCatalogFamilyOptions(
  items: readonly PlannerCatalogItem[],
): readonly { key: string; label: string; count: number }[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const item of items) {
    const key = resolveCatalogFamilyKey(item);
    const label = resolveCatalogFamilyLabel(item);
    const prev = map.get(key);
    if (prev) {
      prev.count += 1;
    } else {
      map.set(key, { label, count: 1 });
    }
  }
  return [...map.entries()]
    .map(([key, value]) => ({ key, label: value.label, count: value.count }))
    .sort(
      (a, b) =>
        a.label.localeCompare(b.label) || a.key.localeCompare(b.key),
    );
}

export function listCatalogMaterialOptions(
  items: readonly PlannerCatalogItem[],
): readonly string[] {
  const set = new Set<string>();
  for (const item of items) {
    const m = item.material?.normalizedMaterial?.trim();
    if (m) set.add(m);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function listCatalogAvailabilityOptions(
  items: readonly PlannerCatalogItem[],
): readonly PlannerAvailabilityStatus[] {
  const set = new Set<PlannerAvailabilityStatus>();
  for (const item of items) {
    if (item.availability) set.add(item.availability);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function listCatalogSeatOptions(
  items: readonly PlannerCatalogItem[],
): readonly number[] {
  const set = new Set<number>();
  for (const item of items) {
    if (
      typeof item.seatCount === "number"
      && Number.isFinite(item.seatCount)
      && item.seatCount > 0
    ) {
      set.add(item.seatCount);
    }
  }
  return [...set].sort((a, b) => a - b);
}

/** True when at least one dimension bound is set. */
export function hasDimensionFacet(filters: CatalogFacetFilters): boolean {
  return (
    isFiniteBound(filters.minWidthMm)
    || isFiniteBound(filters.maxWidthMm)
    || isFiniteBound(filters.minDepthMm)
    || isFiniteBound(filters.maxDepthMm)
  );
}

function isFiniteBound(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Apply family + optional material/availability/seats/dims facets.
 * Empty/null facet values are ignored (pass-through).
 */
export function filterCatalogByFacets(
  items: readonly PlannerCatalogItem[],
  filters: CatalogFacetFilters,
): PlannerCatalogItem[] {
  const familyKey = filters.familyKey?.trim().toLowerCase() || null;
  const material = filters.material?.trim().toLowerCase() || null;
  const availability = filters.availability ?? null;
  const seatCount =
    typeof filters.seatCount === "number" && Number.isFinite(filters.seatCount)
      ? filters.seatCount
      : null;

  return items.filter((item) => {
    if (familyKey && resolveCatalogFamilyKey(item) !== familyKey) {
      return false;
    }
    if (material) {
      const m = item.material?.normalizedMaterial?.trim().toLowerCase() ?? "";
      if (m !== material) return false;
    }
    if (availability && item.availability !== availability) {
      return false;
    }
    if (seatCount !== null) {
      if (item.seatCount !== seatCount) return false;
    }
    const w = item.dimensions?.widthMm;
    const d = item.dimensions?.depthMm;
    if (isFiniteBound(filters.minWidthMm) && !(typeof w === "number" && w >= filters.minWidthMm)) {
      return false;
    }
    if (isFiniteBound(filters.maxWidthMm) && !(typeof w === "number" && w <= filters.maxWidthMm)) {
      return false;
    }
    if (isFiniteBound(filters.minDepthMm) && !(typeof d === "number" && d >= filters.minDepthMm)) {
      return false;
    }
    if (isFiniteBound(filters.maxDepthMm) && !(typeof d === "number" && d <= filters.maxDepthMm)) {
      return false;
    }
    return true;
  });
}

/**
 * Group items by family. Preserves relative order within each group.
 * Group order follows first appearance in the input list.
 */
export function groupCatalogItemsByFamily(
  items: readonly PlannerCatalogItem[],
): CatalogFamilyGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, {
    familyLabel: string;
    items: PlannerCatalogItem[];
  }>();

  for (const item of items) {
    const key = resolveCatalogFamilyKey(item);
    const label = resolveCatalogFamilyLabel(item);
    const existing = buckets.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      order.push(key);
      buckets.set(key, { familyLabel: label, items: [item] });
    }
  }

  return order.map((key) => {
    const bucket = buckets.get(key)!;
    return {
      familyKey: key,
      familyLabel: bucket.familyLabel,
      items: bucket.items,
    };
  });
}

/**
 * Toggle an item in the compare selection.
 * Enforces max; selecting an already-selected id removes it.
 * Unknown excess adds are ignored (selection unchanged length-wise).
 */
export function toggleCatalogCompareSelection(
  selectedIds: readonly string[],
  itemId: string,
  max: number = PLANNER_CATALOG_COMPARE_MAX,
): string[] {
  const id = itemId.trim();
  if (!id) return [...selectedIds];
  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : PLANNER_CATALOG_COMPARE_MAX;
  if (selectedIds.includes(id)) {
    return selectedIds.filter((entry) => entry !== id);
  }
  if (selectedIds.length >= limit) {
    return [...selectedIds];
  }
  return [...selectedIds, id];
}

function formatDims(item: PlannerCatalogItem): string {
  const { widthMm, depthMm, heightMm } = item.dimensions;
  const parts = [widthMm, depthMm, heightMm]
    .filter((n): n is number => typeof n === "number" && Number.isFinite(n))
    .map((n) => String(Math.round(n)));
  return parts.length > 0 ? `${parts.join("×")} mm` : "—";
}

/**
 * Compact list/card metadata: name, SKU, family, variant, dims when fields exist.
 * Pure; safe for inventory tiles without React.
 */
export function buildCatalogListMetadata(
  item: PlannerCatalogItem,
): CatalogListMetadata {
  const name = (item.shortName?.trim() || item.name?.trim() || item.id).trim();
  const fullName = (item.name?.trim() || name).trim();
  const skuRaw = item.sku?.trim() ?? "";
  return {
    id: item.id,
    name,
    fullName,
    sku: skuRaw.length > 0 ? skuRaw : null,
    family: resolveCatalogFamilyLabel(item),
    variant: resolveCatalogVariantLabel(item),
    dimsMm: {
      widthMm: item.dimensions?.widthMm,
      depthMm: item.dimensions?.depthMm,
      heightMm: item.dimensions?.heightMm,
    },
    dimsLabel: formatDims(item),
  };
}

function formatAvailability(status: PlannerAvailabilityStatus): string {
  switch (status) {
    case "in-stock":
      return "In stock";
    case "out-of-stock":
      return "Unavailable";
    case "discontinued":
      return "Discontinued";
    case "preorder":
      return "Pre-order";
    case "backorder":
      return "Backorder";
    default:
      return status;
  }
}

/**
 * Side-by-side compare table for selected catalog items.
 * Resolves ids against the provided catalog; skips missing ids.
 * Requires at least two resolved items to be "usable".
 * Names/SKU align with {@link buildCatalogListMetadata}.
 */
export function buildCatalogCompareTable(
  catalog: readonly PlannerCatalogItem[],
  selectedIds: readonly string[],
): CatalogCompareTable | null {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const items: PlannerCatalogItem[] = [];
  for (const id of selectedIds) {
    const item = byId.get(id);
    if (item) items.push(item);
  }
  if (items.length < 2) return null;

  const listMeta = items.map((item) => buildCatalogListMetadata(item));

  const attr = (
    key: string,
    label: string,
    pick: (item: PlannerCatalogItem, index: number) => string,
  ): CatalogCompareAttribute => ({
    key,
    label,
    values: items.map((item, index) => pick(item, index)),
  });

  return {
    itemIds: items.map((i) => i.id),
    names: listMeta.map((m) => m.name),
    attributes: [
      attr("sku", "SKU", (_i, index) => listMeta[index]!.sku ?? "—"),
      attr("family", "Family", (_i, index) => listMeta[index]!.family),
      attr(
        "variant",
        "Variant",
        (_i, index) => listMeta[index]!.variant ?? "—",
      ),
      attr("dims", "Dimensions", (_i, index) => listMeta[index]!.dimsLabel),
      attr(
        "material",
        "Material",
        (i) =>
          i.material?.marketingMaterial?.trim()
          || i.material?.normalizedMaterial?.trim()
          || "—",
      ),
      attr("availability", "Availability", (i) =>
        formatAvailability(i.availability),
      ),
      attr("seats", "Seats", (i) =>
        typeof i.seatCount === "number" && i.seatCount > 0
          ? String(i.seatCount)
          : "—",
      ),
    ],
  };
}

/** Panel field subset used to build {@link CatalogFacetFilters} (PF-22). */
export interface CatalogPanelFacetFields {
  selectedFamilyKey?: string | null;
  selectedMaterial?: string | null;
  selectedAvailability?: PlannerAvailabilityStatus | null;
  selectedSeatCount?: number | null;
  minWidthMm?: number | null;
  maxWidthMm?: number | null;
  minDepthMm?: number | null;
  maxDepthMm?: number | null;
}

/** Map inventory panel facet fields → filter input for {@link filterCatalogByFacets}. */
export function catalogFacetsFromPanelFields(
  fields: CatalogPanelFacetFields,
): CatalogFacetFilters {
  return {
    familyKey: fields.selectedFamilyKey ?? null,
    material: fields.selectedMaterial ?? null,
    availability: fields.selectedAvailability ?? null,
    seatCount: fields.selectedSeatCount ?? null,
    minWidthMm: fields.minWidthMm ?? null,
    maxWidthMm: fields.maxWidthMm ?? null,
    minDepthMm: fields.minDepthMm ?? null,
    maxDepthMm: fields.maxDepthMm ?? null,
  };
}

/** Whether facet filters (excluding free-text search) are active. */
export function hasActiveCatalogFacets(filters: CatalogFacetFilters): boolean {
  return Boolean(
    filters.familyKey?.trim()
    || filters.material?.trim()
    || filters.availability
    || (typeof filters.seatCount === "number" && Number.isFinite(filters.seatCount))
    || hasDimensionFacet(filters),
  );
}
