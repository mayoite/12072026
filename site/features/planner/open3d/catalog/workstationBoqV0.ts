/**
 * Systems v0 — pure BOQ lines from open3d project furniture (ws-v0 keys).
 * No pricing (quote later); identity + footprint + quantity for facility buyer trust.
 */

import type { Open3dProject } from "../model/types";
import {
  parseWorkstationConfigKey,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
} from "./workstationSystemV0";

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
};

export type WorkstationBoqSummaryV0 = {
  lines: WorkstationBoqLineV0[];
  totalSeats: number;
  totalInstances: number;
};

function shapeLabel(shape: WorkstationConfigV0["shape"]): string {
  return shape === "l-shape" ? "L-shape" : "Linear";
}

function lineFromConfig(config: WorkstationConfigV0, quantity: number): WorkstationBoqLineV0 {
  const catalogId = workstationConfigKey(config);
  const fp = workstationFootprintMm(config);
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
  };
}

/**
 * Aggregate workstation furniture on the active floor (or all floors if opts.allFloors).
 * Non-ws furniture is ignored.
 */
/** Map BOQ lines into site quote-cart rows (qty only; price later). */
export function workstationBoqToQuoteCartItems(
  summary: WorkstationBoqSummaryV0,
): Array<{ id: string; name: string; qty: number }> {
  return summary.lines.map((line) => ({
    id: `planner-ws-v0-${line.catalogId}`,
    name: `${line.label} (${line.footprintWidthMm}×${line.footprintDepthMm} mm)`,
    qty: line.quantity,
  }));
}

export function summarizeWorkstationBoqV0(
  project: Open3dProject,
  opts?: { allFloors?: boolean },
): WorkstationBoqSummaryV0 {
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
    .map(({ config, quantity }) => lineFromConfig(config, quantity))
    .sort((a, b) => a.catalogId.localeCompare(b.catalogId));

  const totalInstances = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    lines,
    totalSeats: totalInstances, // v0: 1 seat per workstation instance
    totalInstances,
  };
}
