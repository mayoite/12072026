import { describe, expect, it } from "vitest";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";
import { PLANNER_DEMO_CATALOG_ITEMS } from "@/features/planner/editor/demoCatalogItems";

describe("catalogTypes (structural)", () => {
  it("demo items satisfy PlannerCatalogItem shape", () => {
    expect(PLANNER_DEMO_CATALOG_ITEMS.length).toBeGreaterThan(0);
    const item: PlannerCatalogItem = PLANNER_DEMO_CATALOG_ITEMS[0]!;
    expect(item.id.length).toBeGreaterThan(0);
    expect(item.dimensions.widthMm).toBeGreaterThan(0);
    expect(item.dimensions.depthMm).toBeGreaterThan(0);
    expect(typeof item.name).toBe("string");
    expect(typeof item.sku).toBe("string");
  });
});
