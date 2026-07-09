/**
 * Systems v0 — pure BOQ lines from open3d project furniture (ws-v0 keys).
 * List prices (INR) + GST for quote path. Not live ERP / multi-tenant catalogs.
 */

import type { Open3dProject } from "../model/types";
import {
  parseWorkstationConfigKey,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
  type WorkstationModuleKindV0,
} from "./workstationSystemV0";

/** Default India GST rate for workstation systems v0 list (owner can reprice later). */
export const WORKSTATION_V0_GST_RATE = 0.18;

export type WorkstationBoqLineV0 = {
  catalogId: string;
  shape: WorkstationConfigV0["shape"];
  lengthMm: number;
  depthMm: number;
  heightMm: number;
  footprintWidthMm: number;
  footprintDepthMm: number;
  modules: readonly string[];
  quantity: number;
  label: string;
  /** Whole INR list unit price (ex-GST). */
  unitPriceInr: number;
  /** quantity × unitPriceInr */
  lineSubtotalInr: number;
  gstRate: number;
  lineGstInr: number;
  /** lineSubtotalInr + lineGstInr */
  lineTotalInr: number;
};

export type WorkstationBoqSummaryV0 = {
  lines: WorkstationBoqLineV0[];
  totalSeats: number;
  totalInstances: number;
  currencyCode: "INR";
  gstRate: number;
  /** Sum of line subtotals (ex-GST). */
  subtotalInr: number;
  /** Sum of line GST. */
  gstInr: number;
  /** subtotalInr + gstInr */
  totalInr: number;
};

function shapeLabel(shape: WorkstationConfigV0["shape"]): string {
  return shape === "l-shape" ? "L-shape" : "Linear";
}

/**
 * Demo list unit price (INR, ex-GST) for systems v0.
 * Schedule is intentional list pricing for the wedge — not a full price book.
 */
export function workstationV0UnitPriceInr(config: WorkstationConfigV0): number {
  const { lengthMm, depthMm } = config.size;
  const sizeKey = `${lengthMm}x${depthMm}`;

  const linearBase: Record<string, number> = {
    "900x600": 45_000,
    "900x750": 48_000,
    "1200x600": 52_000,
    "1500x600": 58_000,
  };

  let base = linearBase[sizeKey] ?? Math.round(40_000 + lengthMm * 12 + depthMm * 8);
  if (config.shape === "l-shape") {
    base = Math.round(base * 1.35);
  }

  const moduleAdd: Partial<Record<WorkstationModuleKindV0, number>> = {
    pedestal: 8_000,
    panel: 6_000,
    overhead: 12_000,
    // desk / return included in base footprint pricing
  };

  let add = 0;
  for (const mod of config.modules) {
    add += moduleAdd[mod] ?? 0;
  }

  return base + add;
}

function roundMoneyInr(value: number): number {
  return Math.round(value);
}

function lineFromConfig(
  config: WorkstationConfigV0,
  quantity: number,
  gstRate: number,
): WorkstationBoqLineV0 {
  const catalogId = workstationConfigKey(config);
  const fp = workstationFootprintMm(config);
  const unitPriceInr = workstationV0UnitPriceInr(config);
  const lineSubtotalInr = roundMoneyInr(unitPriceInr * quantity);
  const lineGstInr = roundMoneyInr(lineSubtotalInr * gstRate);
  const lineTotalInr = lineSubtotalInr + lineGstInr;
  return {
    catalogId,
    shape: config.shape,
    lengthMm: config.size.lengthMm,
    depthMm: config.size.depthMm,
    heightMm: config.heightMm,
    footprintWidthMm: fp.widthMm,
    footprintDepthMm: fp.depthMm,
    modules: [...config.modules],
    quantity,
    label: `Workstation ${shapeLabel(config.shape)} ${config.size.lengthMm}×${config.size.depthMm}`,
    unitPriceInr,
    lineSubtotalInr,
    gstRate,
    lineGstInr,
    lineTotalInr,
  };
}

/**
 * Aggregate workstation furniture on the active floor (or all floors if opts.allFloors).
 * Non-ws furniture is ignored.
 */
/** Map BOQ lines into site quote-cart rows (qty + unit price in name for v0 cart). */
export function workstationBoqToQuoteCartItems(
  summary: WorkstationBoqSummaryV0,
): Array<{ id: string; name: string; qty: number }> {
  return summary.lines.map((line) => ({
    id: `planner-ws-v0-${line.catalogId}`,
    name: `${line.label} (${line.footprintWidthMm}×${line.footprintDepthMm} mm) · ₹${line.unitPriceInr.toLocaleString("en-IN")} ex-GST`,
    qty: line.quantity,
  }));
}

export function summarizeWorkstationBoqV0(
  project: Open3dProject,
  opts?: { allFloors?: boolean; gstRate?: number },
): WorkstationBoqSummaryV0 {
  const gstRate = opts?.gstRate ?? WORKSTATION_V0_GST_RATE;
  const floors = opts?.allFloors
    ? project.floors
    : project.floors.filter((f) => f.id === project.activeFloorId);

  const counts = new Map<string, { config: WorkstationConfigV0; quantity: number }>();

  for (const floor of floors) {
    for (const item of floor.furniture) {
      const config =
        parseWorkstationConfigKey(item.catalogId) ??
        parseWorkstationConfigKey(item.sourceCatalogId ?? "") ??
        parseWorkstationConfigKey(item.sourceSlug ?? "");
      if (!config) continue;
      const key = workstationConfigKey(config);
      const existing = counts.get(key);
      if (existing) {
        existing.quantity += 1;
      } else {
        counts.set(key, { config, quantity: 1 });
      }
    }
  }

  const lines = [...counts.values()]
    .map(({ config, quantity }) => lineFromConfig(config, quantity, gstRate))
    .sort((a, b) => a.catalogId.localeCompare(b.catalogId));

  const totalInstances = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalInr = lines.reduce((sum, line) => sum + line.lineSubtotalInr, 0);
  const gstInr = lines.reduce((sum, line) => sum + line.lineGstInr, 0);

  return {
    lines,
    totalSeats: totalInstances, // v0: 1 seat per workstation instance
    totalInstances,
    currencyCode: "INR",
    gstRate,
    subtotalInr,
    gstInr,
    totalInr: subtotalInr + gstInr,
  };
}
