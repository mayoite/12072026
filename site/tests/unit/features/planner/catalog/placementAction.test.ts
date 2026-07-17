import { describe, expect, it } from "vitest";
import {
  placeCatalogItemInProject,
  MODULAR_CABINET_V0_CATALOG_ID,
} from "@/features/planner/catalog/placementAction";
import { createPlannerProject } from "@/features/planner/model/project";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

function item(id: string): PlannerCatalogItem {
  return {
    id,
    slug: id,
    sku: id,
    name: id,
    shortName: id,
    description: "",
    category: "Furniture",
    subCategory: "Storage",
    taxonomyPath: "Furniture > Storage",
    dimensions: { widthMm: 800, depthMm: 400, heightMm: 720 },
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
  };
}

describe("placementAction", () => {
  it("places a catalog item onto the active floor", () => {
    const project = createPlannerProject();
    const { result, snapshot } = placeCatalogItemInProject(project, item("chair-1"), null, {
      placedFrom: "click",
      position: { x: 500, y: 600 },
    });
    expect(result.project.floors[0]!.furniture.length).toBe(1);
    expect(result.project.floors[0]!.furniture[0]!.catalogId).toBe("chair-1");
    expect(snapshot.position).toEqual({ x: 500, y: 600 });
    expect(MODULAR_CABINET_V0_CATALOG_ID.length).toBeGreaterThan(0);
  });
});
