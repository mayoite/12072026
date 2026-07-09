/**
 * First-class open3d project furniture BOQ (Bill of Quantities).
 *
 * Pure: aggregates all placed furniture on the project (not workstation-only).
 * Workstation rows use systems-v0 list pricing when parseable; other rows keep
 * quantity + footprint with unitPriceInr = 0 (honest — no fabricated prices).
 */

import type { Open3dFurnitureItem, Open3dProject } from "../../model/types";
import {
  parseWorkstationConfigKey,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
} from "../../catalog/workstationSystemV0";
import { workstationConfigFromOptions } from "../../catalog/workstationMeshV0";
import { workstationV0UnitPriceInr, WORKSTATION_V0_GST_RATE } from "../../catalog/workstationBoqV0";

export const OPEN3D_FURNITURE_BOQ_KIND = "open3d-furniture-boq-v1" as const;
export const OPEN3D_FURNITURE_BOQ_GST_RATE = WORKSTATION_V0_GST_RATE;

export type Open3dFurnitureBoqLine = {
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
};

export type Open3dFurnitureBoqSummary = {
  kind: typeof OPEN3D_FURNITURE_BOQ_KIND;
  projectId: string;
  projectName: string;
  generatedAt: string;
  currencyCode: "INR";
  gstRate: number;
  lines: Open3dFurnitureBoqLine[];
  /** Placed furniture instance count. */
  totalItems: number;
  totalLines: number;
  subtotalInr: number;
  gstInr: number;
  totalInr: number;
  pricedItemCount: number;
  unpricedItemCount: number;
};

export type BuildOpen3dFurnitureBoqOptions = {
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
  quantity: number;
};

function roundMoneyInr(value: number): number {
  return Math.round(value);
}

function humanizeCatalogId(catalogId: string): string {
  const trimmed = catalogId.trim();
  if (!trimmed) return "Furniture";
  return trimmed
    .replace(/^ws-v0-/i, "Workstation ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveWorkstationConfig(item: Open3dFurnitureItem): WorkstationConfigV0 | null {
  if (item.workstationOptions) {
    return workstationConfigFromOptions(item.workstationOptions);
  }
  return (
    parseWorkstationConfigKey(item.catalogId) ??
    parseWorkstationConfigKey(item.sourceCatalogId ?? "") ??
    parseWorkstationConfigKey(item.sourceSlug ?? "")
  );
}

function resolveDims(item: Open3dFurnitureItem): {
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

function resolveIdentity(item: Open3dFurnitureItem): {
  catalogId: string;
  name: string;
  sku: string;
  category: string;
  geometryMode: string;
  unitPriceInr: number;
  priced: boolean;
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

  return {
    catalogId,
    name: humanizeCatalogId(item.sourceSlug || catalogId),
    sku: item.sourceSku ?? "",
    category,
    geometryMode,
    unitPriceInr: 0,
    priced: false,
  };
}

function groupKey(bucket: Omit<GroupBucket, "quantity">): string {
  return [
    bucket.catalogId,
    bucket.widthMm,
    bucket.depthMm,
    bucket.heightMm,
    bucket.geometryMode,
    bucket.unitPriceInr,
  ].join("|");
}

/**
 * Build a furniture BOQ from the open3d project document.
 * Groups identical catalog/footprint rows and rolls up quantities.
 */
export function buildOpen3dFurnitureBoq(
  project: Open3dProject,
  opts?: BuildOpen3dFurnitureBoqOptions,
): Open3dFurnitureBoqSummary {
  const gstRate = opts?.gstRate ?? OPEN3D_FURNITURE_BOQ_GST_RATE;
  const generatedAt = opts?.now ?? new Date().toISOString();
  const floors = opts?.allFloors
    ? project.floors
    : project.floors.filter((f) => f.id === project.activeFloorId);

  const groups = new Map<string, GroupBucket>();
  let totalItems = 0;

  for (const floor of floors) {
    for (const item of floor.furniture) {
      totalItems += 1;
      const dims = resolveDims(item);
      const identity = resolveIdentity(item);
      const base: Omit<GroupBucket, "quantity"> = {
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
      };
      const key = groupKey(base);
      const existing = groups.get(key);
      if (existing) {
        existing.quantity += 1;
      } else {
        groups.set(key, { ...base, quantity: 1 });
      }
    }
  }

  const lines: Open3dFurnitureBoqLine[] = [...groups.values()]
    .map((g) => {
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
      };
    })
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) ||
        a.name.localeCompare(b.name) ||
        a.catalogId.localeCompare(b.catalogId),
    );

  const subtotalInr = lines.reduce((sum, line) => sum + line.lineSubtotalInr, 0);
  const gstInr = lines.reduce((sum, line) => sum + line.lineGstInr, 0);
  const pricedItemCount = lines
    .filter((l) => l.priced)
    .reduce((sum, l) => sum + l.quantity, 0);
  const unpricedItemCount = totalItems - pricedItemCount;

  return {
    kind: OPEN3D_FURNITURE_BOQ_KIND,
    projectId: project.id,
    projectName: project.name,
    generatedAt,
    currencyCode: "INR",
    gstRate,
    lines,
    totalItems,
    totalLines: lines.length,
    subtotalInr,
    gstInr,
    totalInr: subtotalInr + gstInr,
    pricedItemCount,
    unpricedItemCount,
  };
}

/** Pure JSON string for download / snapshot tests. */
export function exportOpen3dFurnitureBoqToJson(
  summary: Open3dFurnitureBoqSummary,
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
export function exportOpen3dFurnitureBoqToCsv(summary: Open3dFurnitureBoqSummary): string {
  const rows: string[] = [];
  rows.push(`Project,${escapeCsvField(summary.projectName)}`);
  rows.push(`Project ID,${escapeCsvField(summary.projectId)}`);
  rows.push(`Generated,${escapeCsvField(summary.generatedAt)}`);
  rows.push(`Currency,${summary.currencyCode}`);
  rows.push(`GST rate,${summary.gstRate}`);
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
      "Geometry",
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
        escapeCsvField(li.geometryMode),
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

  return rows.join("\n");
}

export function buildOpen3dBoqFilename(
  project: Pick<Open3dProject, "name">,
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
