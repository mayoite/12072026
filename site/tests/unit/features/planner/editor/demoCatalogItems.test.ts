import { describe, expect, it } from "vitest";
import {
  PLANNER_DEMO_CATALOG_ITEMS,
  getDemoCatalogItemById,
} from "@/features/planner/editor/demoCatalogItems";

describe("demoCatalogItems", () => {
  it("seeds non-empty demo catalog with unique ids", () => {
    expect(PLANNER_DEMO_CATALOG_ITEMS.length).toBeGreaterThan(2);
    const ids = PLANNER_DEMO_CATALOG_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of PLANNER_DEMO_CATALOG_ITEMS) {
      expect(item.dimensions.widthMm).toBeGreaterThan(0);
      expect(item.dimensions.depthMm).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
    }
  });

  it("resolves demo items by id and returns undefined for unknown", () => {
    const first = PLANNER_DEMO_CATALOG_ITEMS[0]!;
    expect(getDemoCatalogItemById(first.id)?.sku).toBe(first.sku);
    expect(getDemoCatalogItemById("does-not-exist-xyz")).toBeUndefined();
  });
});
