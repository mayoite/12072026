/**
 * ADM-LIST-01..04 / ADM-SVG-02 — inventory finding, sort, page, saved views, family groups.
 * Pure functions only. No catalog I/O.
 */

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { CatalogLifecycleState } from "./catalogLifecycle.shared";
import type { SvgArtifactStatus } from "../publish/svgArtifactStatus.server";

export type InventoryArtifactFilter = "all" | SvgArtifactStatus["state"];
export type InventoryLifecycleFilter = "all" | CatalogLifecycleState;

export type InventorySortKey =
  | "slug"
  | "sku"
  | "family"
  | "lifecycle"
  | "lastChange"
  | "widthMm";

export type InventorySortDir = "asc" | "desc";

export interface SvgInventoryFilterInput {
  readonly query: string;
  readonly artifact: InventoryArtifactFilter;
  readonly lifecycle: InventoryLifecycleFilter;
  readonly variant: "all" | BlockDescriptor["variant"];
}

export interface SvgInventoryRow {
  readonly descriptor: BlockDescriptor;
  readonly artifactState: SvgArtifactStatus["state"];
  readonly lifecycle: CatalogLifecycleState;
  readonly lastChangeLabel: string;
  readonly lastChangeEpoch: number;
  readonly validationLabel: "ok" | "invalid" | "missing";
  /** Family key for grouping (variant family). */
  readonly family: BlockDescriptor["variant"];
  /** Buyer-facing availability derived from lifecycle. */
  readonly availability: "available" | "unavailable" | "retired";
}

export interface InventorySavedView {
  readonly id: string;
  readonly name: string;
  readonly filter: SvgInventoryFilterInput;
  readonly sortKey: InventorySortKey;
  readonly sortDir: InventorySortDir;
  readonly pageSize: number;
}

export const INVENTORY_PAGE_SIZE_DEFAULT = 10;
export const INVENTORY_SAVED_VIEWS_STORAGE_KEY = "admin-svg-inventory-saved-views";

export function matchInventoryQuery(
  descriptor: BlockDescriptor,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  const haystack = [
    descriptor.slug,
    descriptor.sku ?? "",
    descriptor.variant,
    descriptor.sourceProvenance,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterInventoryRows(
  rows: readonly SvgInventoryRow[],
  input: SvgInventoryFilterInput,
): readonly SvgInventoryRow[] {
  return rows.filter((row) => {
    if (!matchInventoryQuery(row.descriptor, input.query)) return false;
    if (input.artifact !== "all" && row.artifactState !== input.artifact) {
      return false;
    }
    if (input.lifecycle !== "all" && row.lifecycle !== input.lifecycle) {
      return false;
    }
    if (input.variant !== "all" && row.descriptor.variant !== input.variant) {
      return false;
    }
    return true;
  });
}

export function validationLabelForArtifact(
  state: SvgArtifactStatus["state"],
): SvgInventoryRow["validationLabel"] {
  if (state === "published") return "ok";
  if (state === "invalid") return "invalid";
  return "missing";
}

export function availabilityFromLifecycle(
  lifecycle: CatalogLifecycleState,
): SvgInventoryRow["availability"] {
  if (lifecycle === "live") return "available";
  if (lifecycle === "retired") return "retired";
  return "unavailable";
}

function compareStrings(a: string, b: string, dir: InventorySortDir): number {
  const c = a.localeCompare(b);
  return dir === "asc" ? c : -c;
}

function compareNumbers(a: number, b: number, dir: InventorySortDir): number {
  const c = a === b ? 0 : a < b ? -1 : 1;
  return dir === "asc" ? c : -c;
}

/** ADM-LIST-01 — stable sort of inventory rows. */
export function sortInventoryRows(
  rows: readonly SvgInventoryRow[],
  sortKey: InventorySortKey,
  sortDir: InventorySortDir,
): readonly SvgInventoryRow[] {
  const copy = [...rows];
  copy.sort((left, right) => {
    switch (sortKey) {
      case "slug":
        return compareStrings(left.descriptor.slug, right.descriptor.slug, sortDir);
      case "sku":
        return compareStrings(
          left.descriptor.sku ?? "",
          right.descriptor.sku ?? "",
          sortDir,
        );
      case "family":
        return compareStrings(left.family, right.family, sortDir) ||
          compareStrings(left.descriptor.slug, right.descriptor.slug, "asc");
      case "lifecycle":
        return compareStrings(left.lifecycle, right.lifecycle, sortDir);
      case "lastChange":
        return compareNumbers(left.lastChangeEpoch, right.lastChangeEpoch, sortDir);
      case "widthMm":
        return compareNumbers(
          left.descriptor.geometry.widthMm,
          right.descriptor.geometry.widthMm,
          sortDir,
        );
      default: {
        const _exhaustive: never = sortKey;
        return _exhaustive;
      }
    }
  });
  return copy;
}

/** ADM-LIST-01 — page slice (1-based page index). */
export function pageInventoryRows(
  rows: readonly SvgInventoryRow[],
  page: number,
  pageSize: number,
): {
  readonly pageRows: readonly SvgInventoryRow[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly total: number;
} {
  const size = Math.max(1, Math.trunc(pageSize));
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(Math.max(1, Math.trunc(page)), totalPages);
  const start = (safePage - 1) * size;
  return {
    pageRows: rows.slice(start, start + size),
    page: safePage,
    pageSize: size,
    totalPages,
    total,
  };
}

/**
 * ADM-LIST-04 — group rows by family (variant) for comparable sections.
 * Preserves relative order within each family.
 */
export function groupInventoryRowsByFamily(
  rows: readonly SvgInventoryRow[],
): readonly {
  readonly family: BlockDescriptor["variant"];
  readonly rows: readonly SvgInventoryRow[];
}[] {
  const order: BlockDescriptor["variant"][] = [
    "fixed",
    "configurable",
    "parametric",
  ];
  const buckets = new Map<BlockDescriptor["variant"], SvgInventoryRow[]>();
  for (const family of order) buckets.set(family, []);
  for (const row of rows) {
    const list = buckets.get(row.family) ?? [];
    list.push(row);
    buckets.set(row.family, list);
  }
  return order
    .map((family) => ({ family, rows: buckets.get(family) ?? [] }))
    .filter((group) => group.rows.length > 0);
}

export function createSavedView(
  name: string,
  filter: SvgInventoryFilterInput,
  sortKey: InventorySortKey,
  sortDir: InventorySortDir,
  pageSize: number,
  idFactory: () => string = () => `view-${Date.now()}`,
): InventorySavedView {
  return {
    id: idFactory(),
    name: name.trim() || "Saved view",
    filter: { ...filter },
    sortKey,
    sortDir,
    pageSize: Math.max(1, Math.trunc(pageSize)),
  };
}

export function serializeSavedViews(views: readonly InventorySavedView[]): string {
  return JSON.stringify(views);
}

export function parseSavedViews(raw: string | null | undefined): InventorySavedView[] {
  if (!raw || raw.trim() === "") return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is InventorySavedView =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as InventorySavedView).id === "string" &&
        typeof (entry as InventorySavedView).name === "string" &&
        typeof (entry as InventorySavedView).filter === "object",
    );
  } catch {
    return [];
  }
}
