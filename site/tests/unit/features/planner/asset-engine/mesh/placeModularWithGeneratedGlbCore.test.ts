import { describe, expect, it, vi } from "vitest";
import { placeModularWithGeneratedGlbCore } from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbCore";
import { createPlannerProject } from "@/features/planner/model/project";
import { MODULAR_CABINET_V0_CATALOG_ID } from "@/features/planner/catalog/placementAction";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

function modularCatalogItem(): PlannerCatalogItem {
  return {
    id: MODULAR_CABINET_V0_CATALOG_ID,
    slug: MODULAR_CABINET_V0_CATALOG_ID,
    sku: "CAB-V0",
    name: "Cabinet V0",
    shortName: "Cabinet",
    description: "Modular",
    category: "Furniture",
    subCategory: "Cabinets",
    taxonomyPath: "Furniture > Cabinets",
    dimensions: { widthMm: 600, depthMm: 580, heightMm: 720 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: {
      marketingMaterial: "White",
      normalizedMaterial: "white",
    },
    roomTags: ["Kitchen"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "flat-pack",
    flatPack: true,
    tags: ["cabinet"],
    variants: [],
    provenance: { source: "sample_data" },
    symbolOnly: false,
    geometryMode: "modular-cabinet-v0",
  } as PlannerCatalogItem;
}

describe("placeModularWithGeneratedGlbCore", () => {
  it("places, exports, writes via injected writer, and stamps", async () => {
    const project = createPlannerProject({ name: "Core place" });
    const writeBytes = vi.fn(async (buffer: ArrayBuffer, relativePath: string) => {
      expect(buffer.byteLength).toBeGreaterThan(0);
      expect(relativePath).toMatch(/^catalog-assets\/generated\//);
      return {
        absolutePath: "/tmp/" + relativePath,
        publicUrlPath: "/" + relativePath,
      };
    });

    const result = await placeModularWithGeneratedGlbCore(
      project,
      modularCatalogItem(),
      { x: 1000, y: 1000 },
      { writeToPublic: true, writeBytes },
    );

    expect(result.furnitureId).toBeDefined();
    expect(result.stamped).toBe(true);
    expect(result.written).toBe(true);
    expect(writeBytes).toHaveBeenCalled();
    const furniture = result.project.floors
      .flatMap((f) => f.furniture)
      .find((f) => f.id === result.furnitureId);
    expect(furniture?.generatedGlbUrl).toBeDefined();
  }, 30_000);

  it("skips write when writeToPublic is false", async () => {
    const project = createPlannerProject({ name: "No write" });
    const result = await placeModularWithGeneratedGlbCore(
      project,
      modularCatalogItem(),
      { x: 1000, y: 1000 },
      { writeToPublic: false },
    );
    expect(result.written).toBe(false);
    expect(result.furnitureId).toBeDefined();
  }, 30_000);
});
