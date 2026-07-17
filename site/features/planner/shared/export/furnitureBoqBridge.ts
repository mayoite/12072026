/**
 * Single bridge from the live furniture BOQ into quote-cart + branded PDF rows.
 * Prefer this over workstation-only builders for customer-ready export.
 */

import type { PdfBoqRow } from "./pdfExport";
import type {
  PlannerFurnitureBoqLine,
  PlannerFurnitureBoqSummary,
} from "./projectFurnitureBoq";
import type { PlannerHandoffBoq } from "../handoff/handoffTypes";

export type FurnitureQuoteCartItem = {
  id: string;
  name: string;
  sku: string;
  qty: number;
  unitPriceInr: number;
  lineTotalInr: number;
  source: "planner";
  plannerFamily: string;
  plannerDimensions: string;
  priced: boolean;
};

function lineDims(line: PlannerFurnitureBoqLine): string {
  return `${line.widthMm} × ${line.depthMm} × ${line.heightMm} mm`;
}

export function furnitureBoqToQuoteCartItems(
  summary: PlannerFurnitureBoqSummary,
): FurnitureQuoteCartItem[] {
  return summary.lines.map((line) => ({
    id: `planner-boq:${line.catalogId}|${line.sku}|${line.widthMm}x${line.depthMm}x${line.heightMm}|${line.geometryMode}`,
    name: line.name,
    sku: line.sku,
    qty: line.quantity,
    unitPriceInr: line.unitPriceInr,
    lineTotalInr: line.lineTotalInr,
    source: "planner" as const,
    plannerFamily: line.category,
    plannerDimensions: lineDims(line),
    priced: line.priced,
  }));
}

export function furnitureBoqToPdfRows(
  summary: PlannerFurnitureBoqSummary,
): PdfBoqRow[] {
  return summary.lines.map((line) => ({
    sku: line.sku || line.catalogId,
    name: line.name,
    category: line.category,
    quantity: line.quantity,
    widthCm: Math.round(line.widthMm / 10),
    depthCm: Math.round(line.depthMm / 10),
    heightCm: Math.round(line.heightMm / 10),
    unitPriceInr: line.unitPriceInr,
    spec: line.priced
      ? `demo-list · ${line.geometryMode}`
      : `unpriced · ${line.geometryMode}`,
  }));
}

/** Compact payload for POST /api/planner/handoff (no source object IDs). */
export function furnitureBoqToHandoffPayload(
  summary: PlannerFurnitureBoqSummary,
): PlannerHandoffBoq {
  return {
    kind: summary.kind,
    projectId: summary.projectId,
    projectName: summary.projectName,
    calculationHash: summary.calculationHash,
    pricingMode: summary.pricingMode,
    pricingNote: summary.pricingNote,
    currencyCode: summary.currencyCode,
    totalItems: summary.totalItems,
    totalLines: summary.totalLines,
    subtotalInr: summary.subtotalInr,
    gstInr: summary.gstInr,
    totalInr: summary.totalInr,
    pricedItemCount: summary.pricedItemCount,
    unpricedItemCount: summary.unpricedItemCount,
    lines: summary.lines.map((line) => ({
      catalogId: line.catalogId,
      name: line.name,
      sku: line.sku,
      category: line.category,
      quantity: line.quantity,
      unitPriceInr: line.unitPriceInr,
      lineTotalInr: line.lineTotalInr,
      priced: line.priced,
      priceSource: line.priceSource,
    })),
  };
}
