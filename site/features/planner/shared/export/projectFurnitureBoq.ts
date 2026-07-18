/**
 * First-class planner project furniture BOQ (Bill of Quantities).
 *
 * Pure: aggregates all placed furniture on the project (not workstation-only).
 * Workstation rows use systems-v0 list pricing when parseable; other rows keep
 * quantity + footprint with unitPriceInr = 0 (honest — no fabricated prices).
 */

import type { PlannerFurnitureItem, PlannerProject } from "../../model/types";
import {
  parseWorkstationConfigKey,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
} from "../../catalog/workstationSystemV0";
import { workstationConfigFromOptions } from "../../catalog/workstationMeshV0";
import { workstationV0UnitPriceInr, WORKSTATION_V0_GST_RATE } from "../../catalog/workstationBoqV0";
import { sha256Hex } from "../../catalog/svg/sha256";
import { resolveCatalogDisplayName } from "../../catalog/catalogLabelUtils";

export const PLANNER_FURNITURE_BOQ_KIND = "open3d-furniture-boq-v1" as const;
export const PLANNER_FURNITURE_BOQ_GST_RATE = WORKSTATION_V0_GST_RATE;

/**
 * Honesty label for BOQ money columns.
 * Demo list only — not live ERP / multi-tenant / cloud catalog pricing.
 */
export const PLANNER_FURNITURE_BOQ_PRICING_NOTE =
  "Workstation unit prices are demo list schedule (systems-v0), not live ERP or cloud pricing. Unpriced rows keep unitPriceInr=0 (quantity + footprint only — no fabricated prices).";

export type PlannerFurnitureBoqPriceSource = "demo-list" | "none";

export type PlannerFurnitureBoqLine = {
  catalogId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  /** Whole INR list unit price (ex-GST). 0 when unknown — not fabricated. */
  unitPriceInr: number;
  lineSubtotalInr: number;
  gstRate: number;
  lineGstInr: number;
  lineTotalInr: number;
  geometryMode: string;
  priced: boolean;
  /** Where unitPriceInr came from — always labeled (demo-list or none). */
  priceSource: PlannerFurnitureBoqPriceSource;
  sourceObjectIds: string[];
};

export type PlannerFurnitureBoqSummary = {
  kind: typeof PLANNER_FURNITURE_BOQ_KIND;
  projectId: string;
  projectName: string;
  generatedAt: string;
  currencyCode: "INR";
  gstRate: number;
  /** Always demo-list-partial until live pricing exists. */
  pricingMode: "demo-list-partial";
  /** Human-readable honesty note for download consumers. */
  pricingNote: string;
  /** SHA-256 of canonical calculation inputs and outputs. Excludes generation time. */
  calculationHash: string;
  lines: PlannerFurnitureBoqLine[];
  /** Placed furniture instance count. */
  totalItems: number;
  totalLines: number;
  subtotalInr: number;
  gstInr: number;
  totalInr: number;
  pricedItemCount: number;
  unpricedItemCount: number;
  /** Items without a recognized catalog identity — separated for visibility. */
  unsupportedLines: PlannerFurnitureBoqLine[];
  totalUnsupportedItems: number;
};

export type BuildPlannerFurnitureBoqOptions = {
  /** Default: active floor only. */
  allFloors?: boolean;
  gstRate?: number;
  /** Override clock for stable tests. */
  now?: string;
};

type GroupBucket = {
  catalogId: string;
  name: string;
  sku: string;
  category: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  geometryMode: string;
  unitPriceInr: number;
  priced: boolean;
  priceSource: PlannerFurnitureBoqPriceSource;
  quantity: number;
  sourceObjectIds: string[];
};

function roundMoneyInr(value: number): number {
  return Math.round(value);
}

function resolveWorkstationConfig(item: PlannerFurnitureItem): WorkstationConfigV0 | null {
  if (item.workstationOptions) {
    return workstationConfigFromOptions(item.workstationOptions);
  }
  return (
    parseWorkstationConfigKey(item.catalogId) ??
    parseWorkstationConfigKey(item.sourceCatalogId ?? "") ??
    parseWorkstationConfigKey(item.sourceSlug ?? "")
  );
}

function resolveDims(item: PlannerFurnitureItem): {
  widthMm: number;
  depthMm: number;
  heightMm: number;
} {
  const config = resolveWorkstationConfig(item);
  if (config) {
    const fp = workstationFootprintMm(config);
    return {
      widthMm: fp.widthMm,
      depthMm: fp.depthMm,
      heightMm: config.heightMm,
    };
  }
  if (item.modularOptions) {
    return {
      widthMm: item.modularOptions.widthMm,
      depthMm: item.modularOptions.depthMm,
      heightMm: item.modularOptions.heightMm,
    };
  }
  return {
    widthMm: item.width ?? 500,
    depthMm: item.depth ?? 500,
    heightMm: item.height ?? 750,
  };
}

function resolveIdentity(item: PlannerFurnitureItem): {
  catalogId: string;
  name: string;
  sku: string;
  category: string;
  geometryMode: string;
  unitPriceInr: number;
  priced: boolean;
  priceSource: PlannerFurnitureBoqPriceSource;
} {
  const config = resolveWorkstationConfig(item);
  if (config) {
    const catalogId = workstationConfigKey(config);
    const shapeLabel = config.shape === "l-shape" ? "L-shape" : "Linear";
    return {
      catalogId,
      name: `Workstation ${shapeLabel} ${config.size.lengthMm}×${config.size.depthMm}`,
      sku: item.sourceSku ?? catalogId,
      category: "workstation",
      geometryMode: item.geometryMode ?? "workstation-v0",
      unitPriceInr: workstationV0UnitPriceInr(config),
      priced: true,
      priceSource: "demo-list",
    };
  }

  const geometryMode = item.geometryMode ?? "box";
  const catalogId = (item.sourceCatalogId || item.catalogId || "unknown").trim() || "unknown";
  const category =
    geometryMode === "modular-cabinet-v0"
      ? "cabinet"
      : geometryMode === "workstation-v0"
        ? "workstation"
        : "furniture";

  const sku = item.sourceSku?.trim() ?? "";
  // Brand series label from slug/SKU (oando-* / OANDO-*), never raw slug-only.
  const name = resolveCatalogDisplayName({
    slug: item.sourceSlug,
    sku: sku || undefined,
    catalogId,
  });

  return {
    catalogId,
    name,
    sku,
    category,
    geometryMode,
    unitPriceInr: 0,
    priced: false,
    priceSource: "none",
  };
}

function groupKey(bucket: Omit<GroupBucket, "quantity" | "sourceObjectIds">): string {
  return [
    bucket.catalogId,
    bucket.sku,
    bucket.widthMm,
    bucket.depthMm,
    bucket.heightMm,
    bucket.geometryMode,
    bucket.unitPriceInr,
  ].join("|");
}

/**
 * Build a furniture BOQ from the planner project document.
 * Groups identical catalog/footprint rows and rolls up quantities.
 */
export function buildPlannerFurnitureBoq(
  project: PlannerProject,
  opts?: BuildPlannerFurnitureBoqOptions,
): PlannerFurnitureBoqSummary {
  const gstRate = opts?.gstRate ?? PLANNER_FURNITURE_BOQ_GST_RATE;
  const generatedAt = opts?.now ?? new Date().toISOString();
  const floors = opts?.allFloors
    ? project.floors
    : project.floors.filter((f) => f.id === project.activeFloorId);

  const groups = new Map<string, GroupBucket>();
  let totalItems = 0;

  const unsupportedGroups = new Map<string, GroupBucket>();

  for (const floor of floors) {
    for (const item of floor.furniture) {
      totalItems += 1;
      const dims = resolveDims(item);
      const identity = resolveIdentity(item);
      const base: Omit<GroupBucket, "quantity" | "sourceObjectIds"> = {
        catalogId: identity.catalogId,
        name: identity.name,
        sku: identity.sku,
        category: identity.category,
        widthMm: dims.widthMm,
        depthMm: dims.depthMm,
        heightMm: dims.heightMm,
        geometryMode: identity.geometryMode,
        unitPriceInr: identity.unitPriceInr,
        priced: identity.priced,
        priceSource: identity.priceSource,
      };
      const isUnsupported = identity.catalogId === "unknown" || identity.catalogId === "";
      const bucket = isUnsupported ? unsupportedGroups : groups;
      const key = groupKey(base);
      const existing = bucket.get(key);
      if (existing) {
        existing.quantity += 1;
        existing.sourceObjectIds.push(item.id);
      } else {
        bucket.set(key, { ...base, quantity: 1, sourceObjectIds: [item.id] });
      }
    }
  }

  function bucketToLine(g: GroupBucket): PlannerFurnitureBoqLine {
    const lineSubtotalInr = roundMoneyInr(g.unitPriceInr * g.quantity);
    const lineGstInr = g.priced ? roundMoneyInr(lineSubtotalInr * gstRate) : 0;
    const lineTotalInr = lineSubtotalInr + lineGstInr;
    return {
      catalogId: g.catalogId,
      name: g.name,
      sku: g.sku,
      category: g.category,
      quantity: g.quantity,
      widthMm: g.widthMm,
      depthMm: g.depthMm,
      heightMm: g.heightMm,
      unitPriceInr: g.unitPriceInr,
      lineSubtotalInr,
      gstRate,
      lineGstInr,
      lineTotalInr,
      geometryMode: g.geometryMode,
      priced: g.priced,
      priceSource: g.priceSource,
      sourceObjectIds: [...g.sourceObjectIds].sort(),
    };
  }

  const lines: PlannerFurnitureBoqLine[] = [...groups.values()]
    .map(bucketToLine)
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) ||
        a.name.localeCompare(b.name) ||
        a.catalogId.localeCompare(b.catalogId),
    );

  const unsupportedLines: PlannerFurnitureBoqLine[] = [...unsupportedGroups.values()]
    .map(bucketToLine)
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) ||
        a.name.localeCompare(b.name),
    );

  const subtotalInr = lines.reduce((sum, line) => sum + line.lineSubtotalInr, 0);
  const gstInr = lines.reduce((sum, line) => sum + line.lineGstInr, 0);
  const pricedItemCount = lines
    .filter((l) => l.priced)
    .reduce((sum, l) => sum + l.quantity, 0);
  const unpricedItemCount = lines
    .filter((l) => !l.priced)
    .reduce((sum, l) => sum + l.quantity, 0);
  const totalUnsupportedItems = [...unsupportedGroups.values()]
    .reduce((sum, g) => sum + g.quantity, 0);
  const calculationHash = sha256Hex(
    JSON.stringify({
      kind: PLANNER_FURNITURE_BOQ_KIND,
      projectId: project.id,
      currencyCode: "INR",
      gstRate,
      lines,
      totalItems,
      subtotalInr,
      gstInr,
      totalInr: subtotalInr + gstInr,
    }),
  );

  return {
    kind: PLANNER_FURNITURE_BOQ_KIND,
    projectId: project.id,
    projectName: project.name,
    generatedAt,
    currencyCode: "INR",
    gstRate,
    pricingMode: "demo-list-partial",
    pricingNote: PLANNER_FURNITURE_BOQ_PRICING_NOTE,
    calculationHash,
    lines,
    totalItems,
    totalLines: lines.length,
    subtotalInr,
    gstInr,
    totalInr: subtotalInr + gstInr,
    pricedItemCount,
    unpricedItemCount,
    unsupportedLines,
    totalUnsupportedItems,
  };
}

/** Pure JSON string for download / snapshot tests. */
export function exportPlannerFurnitureBoqToJson(
  summary: PlannerFurnitureBoqSummary,
  pretty = true,
): string {
  return JSON.stringify(summary, null, pretty ? 2 : 0);
}

function escapeCsvField(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/** Pure CSV for procurement handoff. */
export function exportPlannerFurnitureBoqToCsv(summary: PlannerFurnitureBoqSummary): string {
  const rows: string[] = [];
  rows.push(`Project,${escapeCsvField(summary.projectName)}`);
  rows.push(`Project ID,${escapeCsvField(summary.projectId)}`);
  rows.push(`Generated,${escapeCsvField(summary.generatedAt)}`);
  rows.push(`Currency,${summary.currencyCode}`);
  rows.push(`GST rate,${summary.gstRate}`);
  rows.push(`Pricing mode,${summary.pricingMode}`);
  rows.push(`Pricing note,${escapeCsvField(summary.pricingNote)}`);
  rows.push("");
  rows.push(
    [
      "Category",
      "Item",
      "Catalog ID",
      "SKU",
      "Qty",
      "Width (mm)",
      "Depth (mm)",
      "Height (mm)",
      "Unit price (INR ex-GST)",
      "Line subtotal (INR)",
      "Line GST (INR)",
      "Line total (INR)",
      "Priced",
      "Price source",
      "Geometry",
      "Source object IDs",
    ].join(","),
  );

  for (const li of summary.lines) {
    rows.push(
      [
        escapeCsvField(li.category),
        escapeCsvField(li.name),
        escapeCsvField(li.catalogId),
        escapeCsvField(li.sku),
        String(li.quantity),
        String(li.widthMm),
        String(li.depthMm),
        String(li.heightMm),
        String(li.unitPriceInr),
        String(li.lineSubtotalInr),
        String(li.lineGstInr),
        String(li.lineTotalInr),
        li.priced ? "yes" : "no",
        li.priceSource,
        escapeCsvField(li.geometryMode),
        escapeCsvField(li.sourceObjectIds.join(" | ")),
      ].join(","),
    );
  }

  rows.push("");
  rows.push(`Total items,${summary.totalItems}`);
  rows.push(`Total lines,${summary.totalLines}`);
  rows.push(`Subtotal INR,${summary.subtotalInr}`);
  rows.push(`GST INR,${summary.gstInr}`);
  rows.push(`Grand total INR,${summary.totalInr}`);
  rows.push(`Priced items,${summary.pricedItemCount}`);
  rows.push(`Unpriced items,${summary.unpricedItemCount}`);

  if (summary.unsupportedLines.length > 0) {
    rows.push("");
    rows.push("UNSUPPORTED ITEMS (no recognized catalog identity)");
    rows.push(
      [
        "Category",
        "Item",
        "Catalog ID",
        "Width (mm)",
        "Depth (mm)",
        "Height (mm)",
        "Geometry",
        "Source object IDs",
      ].join(","),
    );
    for (const li of summary.unsupportedLines) {
      rows.push(
        [
          escapeCsvField(li.category),
          escapeCsvField(li.name),
          escapeCsvField(li.catalogId),
          String(li.widthMm),
          String(li.depthMm),
          String(li.heightMm),
          escapeCsvField(li.geometryMode),
          escapeCsvField(li.sourceObjectIds.join(" | ")),
        ].join(","),
      );
    }
    rows.push(`Total unsupported items,${summary.totalUnsupportedItems}`);
  }

  rows.push(`Calculation hash,${summary.calculationHash}`);

  return rows.join("\n");
}

export function buildPlannerBoqFilename(
  project: Pick<PlannerProject, "name">,
  ext: "json" | "csv",
): string {
  const slug =
    project.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "plan";
  return `${slug}-furniture-boq-v1.${ext}`;
}
