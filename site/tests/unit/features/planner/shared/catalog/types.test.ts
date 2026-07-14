import { describe, expect, it } from "vitest";
import type {
  CatalogItem,
  CatalogItemDimensions,
  CatalogSource,
  PlannerShapeMeta,
} from "@/features/planner/shared/catalog/types";

describe("shared/catalog/types", () => {
  it("accepts CatalogItem with dimensions and optional mesh", () => {
    const dims: CatalogItemDimensions = {
      widthMm: 1200,
      depthMm: 600,
      heightMm: 750,
    };
    const item: CatalogItem = {
      id: "desk-1",
      name: "Desk",
      category: "desks",
      dimensions: dims,
      meshType: "desk-rect",
      priceInr: 12000,
    };
    expect(item.dimensions.widthMm).toBe(1200);
    expect(item.meshType).toBe("desk-rect");
  });

  it("accepts CatalogSource and PlannerShapeMeta values", () => {
    const sources: CatalogSource[] = ["supabase", "managed", "json", "custom"];
    expect(sources).toContain("managed");
    const meta: PlannerShapeMeta = {
      isPlannerItem: true,
      productId: "p1",
      structureType: "wall",
    };
    expect(meta.structureType).toBe("wall");
  });
});
