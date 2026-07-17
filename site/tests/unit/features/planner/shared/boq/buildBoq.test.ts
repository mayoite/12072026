import { describe, expect, it } from "vitest";
import { buildBoq } from "@/features/planner/shared/boq/buildBoq";
import type { CatalogItem } from "@/features/planner/shared/catalog/types";

function catalogItem(partial: Partial<CatalogItem> & Pick<CatalogItem, "id" | "name">): CatalogItem {
  return {
    category: "desks",
    dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    priceInr: 10000,
    sku: "DSK-1",
    ...partial,
  };
}

describe("buildBoq", () => {
  it("groups identical placements and totals quantity", () => {
    const catalog = new Map<string, CatalogItem>([
      ["desk-1", catalogItem({ id: "desk-1", name: "Task Desk", priceInr: 10000 })],
    ]);
    const boq = buildBoq(
      [
        { catalogId: "desk-1", name: "Task Desk" },
        { catalogId: "desk-1", name: "Task Desk" },
      ],
      catalog,
    );
    expect(boq.totalItems).toBe(2);
    expect(boq.lineItems).toHaveLength(1);
    expect(boq.lineItems[0]?.quantity).toBe(2);
    expect(boq.lineItems[0]?.name).toBe("Task Desk");
    expect(boq.lineItems[0]?.sku).toBe("DSK-1");
    expect(boq.lineItems[0]?.unitPriceInr).toBe(10000);
  });

  it("applies 18% GST on subtotal", () => {
    const catalog = new Map<string, CatalogItem>([
      ["desk-1", catalogItem({ id: "desk-1", name: "Desk", priceInr: 10000 })],
    ]);
    const boq = buildBoq([{ catalogId: "desk-1", name: "Desk" }], catalog, {
      now: "2026-07-17T00:00:00.000Z",
    });
    expect(boq.subtotalInr).toBe(10000);
    expect(boq.totalPriceInr).toBe(10000);
    expect(boq.gstRate).toBe(0.18);
    expect(boq.gstAmountInr).toBe(1800);
    expect(boq.grandTotalInr).toBe(11800);
    expect(boq.generatedAt).toBe("2026-07-17T00:00:00.000Z");
  });

  it("falls back to placement dimensions when catalog missing", () => {
    const boq = buildBoq(
      [{ catalogId: "unknown", name: "Custom", widthCm: 140, depthCm: 70, heightCm: 75 }],
      new Map(),
    );
    expect(boq.lineItems).toHaveLength(1);
    expect(boq.lineItems[0]?.name).toBe("Custom");
    expect(boq.lineItems[0]?.dimensions.widthMm).toBeGreaterThan(0);
    expect(boq.lineItems[0]?.unitPriceInr).toBe(0);
  });

  it("sorts line items by category then name", () => {
    const catalog = new Map<string, CatalogItem>([
      ["b", catalogItem({ id: "b", name: "Beta", category: "storage", priceInr: 1 })],
      ["a", catalogItem({ id: "a", name: "Alpha", category: "desks", priceInr: 1 })],
    ]);
    const boq = buildBoq(
      [
        { catalogId: "b", name: "Beta" },
        { catalogId: "a", name: "Alpha" },
      ],
      catalog,
    );
    expect(boq.lineItems.map((li) => li.name)).toEqual(["Alpha", "Beta"]);
  });
});
