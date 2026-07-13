/**
 * ADM-SVG-02 — pure inventory finding (search + multi-filter).
 * No catalog I/O. Operates on already-loaded descriptor rows.
 */

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { CatalogLifecycleState } from "./catalogLifecycle.shared";
import type { SvgArtifactStatus } from "./svgArtifactStatus.server";

export type InventoryArtifactFilter = "all" | SvgArtifactStatus["state"];
export type InventoryLifecycleFilter = "all" | CatalogLifecycleState;

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
  readonly validationLabel: "ok" | "invalid" | "missing";
}

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
