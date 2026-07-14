import { describe, expect, it } from "vitest";
import type { BoqLineItem, BoqSummary } from "@/features/planner/shared/boq/types";

describe("shared/boq/types", () => {
  it("accepts a complete BoqLineItem shape", () => {
    const item: BoqLineItem = {
      catalogId: "desk-1",
      name: "Desk",
      sku: "DSK-1",
      category: "desks",
      quantity: 2,
      unitPriceInr: 10000,
      dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    };
    expect(item.quantity * item.unitPriceInr).toBe(20000);
    expect(item.dimensions.widthMm).toBe(1200);
  });

  it("accepts BoqSummary with GST fields", () => {
    const summary: BoqSummary = {
      lineItems: [],
      totalItems: 0,
      totalPriceInr: 0,
      generatedAt: "2026-07-13T12:00:00.000Z",
      subtotalInr: 0,
      gstRate: 0.18,
      gstAmountInr: 0,
      grandTotalInr: 0,
    };
    expect(summary.gstRate).toBe(0.18);
    expect(summary.generatedAt).toMatch(/2026/);
  });
});
