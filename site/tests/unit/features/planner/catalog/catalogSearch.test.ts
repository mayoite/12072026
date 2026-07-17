import { describe, expect, it } from "vitest";
import {
  PLANNER_CATALOG_RESULT_CAP,
  capCatalogResults,
  rankCatalogItems,
  toPlannerCatalogCollection,
} from "@/features/planner/catalog/catalogSearch";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

function item(partial: Partial<PlannerCatalogItem> & { id: string; name: string }): PlannerCatalogItem {
  return {
    slug: partial.id,
    sku: partial.id,
    shortName: partial.name,
    description: "",
    category: "Furniture",
    subCategory: "Desks",
    taxonomyPath: "Furniture > Desks",
    dimensions: { widthMm: 1000, depthMm: 600, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: { marketingMaterial: "x", normalizedMaterial: "x" },
    roomTags: [],
    styleTags: [],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: [],
    variants: [],
    provenance: { source: "test" },
    symbolOnly: false,
    ...partial,
  };
}

describe("catalogSearch", () => {
  it("caps results without mutating input", () => {
    expect(PLANNER_CATALOG_RESULT_CAP).toBe(50);
    const items = Array.from({ length: 60 }, (_, i) => item({ id: `i${i}`, name: `Item ${i}` }));
    const capped = capCatalogResults(items, 10);
    expect(capped).toHaveLength(10);
    expect(items).toHaveLength(60);
    expect(capCatalogResults(items, 0)).toEqual([]);
  });

  it("ranks by name and builds collection rows", () => {
    const items = [
      item({ id: "desk-1", name: "Standing Desk" }),
      item({ id: "sofa-1", name: "Modern Sofa" }),
    ];
    const ranked = rankCatalogItems(items, "desk");
    expect(ranked[0]!.id).toBe("desk-1");
    expect(rankCatalogItems(items, "   ")).toHaveLength(2);
    const coll = toPlannerCatalogCollection(items);
    expect(coll[0]).toMatchObject({ key: "desk-1" });
    expect(coll[0]!.textValue).toContain("Standing Desk");
  });
});
