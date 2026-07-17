import { describe, it, expect } from "vitest";
import {
  furnitureBoqToBoqSummary,
  furnitureBoqToHandoffPayload,
  furnitureBoqToPdfRows,
  furnitureBoqToQuoteCartItems,
} from "@/features/planner/shared/export/furnitureBoqBridge";
import { boqToQuoteCart } from "@/features/planner/shared/boq/quoteCartBridge";
import {
  buildPlannerFurnitureBoq,
  type PlannerFurnitureBoqSummary,
} from "@/features/planner/shared/export/projectFurnitureBoq";
import { createRectangularRoomProject } from "@/features/planner/model/project";
import { addPlannerFurniture } from "@/features/planner/model/actions/furniture";

const sample: PlannerFurnitureBoqSummary = {
  kind: "open3d-furniture-boq-v1",
  projectId: "p1",
  projectName: "Demo",
  generatedAt: "2026-07-17T00:00:00.000Z",
  currencyCode: "INR",
  gstRate: 0.18,
  pricingMode: "demo-list-partial",
  pricingNote: "demo",
  calculationHash: "hash1",
  lines: [
    {
      catalogId: "chair-1",
      name: "Task Chair",
      sku: "CH-1",
      category: "furniture",
      quantity: 3,
      widthMm: 600,
      depthMm: 600,
      heightMm: 900,
      unitPriceInr: 0,
      lineSubtotalInr: 0,
      gstRate: 0.18,
      lineGstInr: 0,
      lineTotalInr: 0,
      geometryMode: "box",
      priced: false,
      priceSource: "none",
      sourceObjectIds: ["a", "b", "c"],
    },
  ],
  totalItems: 3,
  totalLines: 1,
  subtotalInr: 0,
  gstInr: 0,
  totalInr: 0,
  pricedItemCount: 0,
  unpricedItemCount: 3,
  unsupportedLines: [],
  totalUnsupportedItems: 0,
};

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("furnitureBoqBridge", () => {
  it("maps generic furniture into quote cart items", () => {
    const items = furnitureBoqToQuoteCartItems(sample);
    expect(items).toHaveLength(1);
    expect(items[0]?.qty).toBe(3);
    expect(items[0]?.name).toBe("Task Chair");
    expect(items[0]?.priced).toBe(false);
    expect(items[0]?.plannerFamily).toBe("furniture");
  });

  it("projects furniture BOQ into legacy BoqSummary for dual-path consumers", () => {
    const legacy = furnitureBoqToBoqSummary(sample);
    expect(legacy.totalItems).toBe(3);
    expect(legacy.lineItems).toHaveLength(1);
    expect(legacy.lineItems[0]).toMatchObject({
      catalogId: "chair-1",
      quantity: 3,
      unitPriceInr: 0,
      dimensions: { widthMm: 600, depthMm: 600, heightMm: 900 },
    });
    expect(legacy.subtotalInr).toBe(0);
    expect(legacy.gstAmountInr).toBe(0);
    expect(legacy.grandTotalInr).toBe(0);
    expect(legacy.generatedAt).toBe(sample.generatedAt);

    const legacyCart = boqToQuoteCart(legacy);
    expect(legacyCart).toHaveLength(1);
    expect(legacyCart[0]?.qty).toBe(3);
    expect(legacyCart[0]?.name).toBe("Task Chair");
  });

  it("maps pdf rows in cm with unpriced honesty label", () => {
    const rows = furnitureBoqToPdfRows(sample);
    expect(rows[0]?.widthCm).toBe(60);
    expect(rows[0]?.spec).toContain("unpriced");
  });

  it("builds compact handoff payload without source ids", () => {
    const payload = furnitureBoqToHandoffPayload(sample);
    expect(payload.calculationHash).toBe("hash1");
    expect(payload.currencyCode).toBe("INR");
    expect(payload.totalItems).toBe(3);
    expect(payload.totalLines).toBe(1);
    expect(payload.pricingMode).toBe("demo-list-partial");
    expect(payload.lines[0]).toMatchObject({
      catalogId: "chair-1",
      quantity: 3,
      priceSource: "none",
      priced: false,
      unitPriceInr: 0,
    });
    expect(payload.lines[0]).not.toHaveProperty("sourceObjectIds");
    expect(payload.lines[0]).not.toHaveProperty("geometryMode");
    expect(payload).not.toHaveProperty("generatedAt");
    expect(payload).not.toHaveProperty("unsupportedLines");
  });

  it("includes non-workstation furniture from a live project BOQ in quote cart", () => {
    let project = createRectangularRoomProject({
      name: "Mixed",
      widthMm: 8000,
      depthMm: 6000,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    project = addPlannerFurniture(
      project,
      {
        catalogId: "task-chair-v1",
        position: { x: 2000, y: 2000 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 600,
        height: 900,
        sourceSku: "CHAIR-01",
        geometryMode: "box",
      },
      ids("f-chair"),
    );
    project = addPlannerFurniture(
      project,
      {
        catalogId: "meeting-table",
        position: { x: 4000, y: 3000 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1800,
        depth: 900,
        height: 750,
        sourceSku: "TBL-01",
        geometryMode: "box",
      },
      ids("f-table"),
    );

    const summary = buildPlannerFurnitureBoq(project, {
      now: "2026-07-17T00:00:00.000Z",
    });
    expect(summary.totalItems).toBe(2);
    expect(summary.lines.every((l) => l.category !== "workstation")).toBe(true);

    const cart = furnitureBoqToQuoteCartItems(summary);
    expect(cart).toHaveLength(2);
    expect(cart.map((c) => c.sku).sort()).toEqual(["CHAIR-01", "TBL-01"]);
    expect(cart.every((c) => c.source === "planner")).toBe(true);

    const pdfRows = furnitureBoqToPdfRows(summary);
    expect(pdfRows).toHaveLength(2);
    expect(pdfRows.every((r) => r.spec.includes("unpriced"))).toBe(true);
  });
});
