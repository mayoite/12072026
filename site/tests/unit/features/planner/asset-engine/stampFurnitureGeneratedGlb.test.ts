import { describe, expect, it } from "vitest";
import {
  attachGeneratedGlbToFurniture,
  stampFurnitureGeneratedGlb,
} from "@/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb";
import { modularCabinetV0GeneratedRelativePath } from "@/features/planner/catalog/modularCabinetV0GlbExport";
import { defaultCabinetV0Options } from "@/features/planner/catalog/modularCabinetV0";
import {
  isSystemGeneratedGlbUrl,
  rejectDesignerStaticGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import type { PlannerFurnitureItem } from "@/features/planner/model/types";
import {
  placeCatalogItemInProject,
} from "@/features/planner/catalog/placementAction";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";
import type { PlannerProject } from "@/features/planner/model/types";

function sampleFurniture(
  overrides: Partial<PlannerFurnitureItem> = {},
): PlannerFurnitureItem {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    geometryMode: "modular-cabinet-v0",
    modularOptions: defaultCabinetV0Options(),
    ...overrides,
  };
}

function emptyProject(): PlannerProject {
  return {
    id: "project-glb-stamp",
    name: "GLB stamp",
    activeFloorId: "floor-1",
    displayUnit: "mm",
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z",
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        level: 0,
        walls: [],
        rooms: [],
        doors: [],
        windows: [],
        furniture: [],
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      },
    ],
  };
}

function modularCatalogItem(): PlannerCatalogItem {
  return {
    id: "cabinet-v0",
    slug: "cabinet-v0",
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
  };
}

describe("stampFurnitureGeneratedGlb + isSystemGeneratedGlbUrl", () => {
  it("stamps modular G5 relative path when policy allows", () => {
    const relativePath = modularCabinetV0GeneratedRelativePath(
      defaultCabinetV0Options({ doorStyle: "slab", material: "white" }),
    );

    expect(isSystemGeneratedGlbUrl(relativePath)).toBe(true);
    expect(rejectDesignerStaticGlbUrl(relativePath)).toBeNull();

    const base = sampleFurniture();
    expect(base.generatedGlbUrl).toBeUndefined();

    const stamped = stampFurnitureGeneratedGlb(base, relativePath);
    expect(stamped.generatedGlbUrl).toBe(relativePath);
    expect(isSystemGeneratedGlbUrl(stamped.generatedGlbUrl ?? "")).toBe(true);
    // Original unchanged (immutable stamp).
    expect(base.generatedGlbUrl).toBeUndefined();
    expect(stamped.geometryMode).toBe("modular-cabinet-v0");
  });

  it("attachGeneratedGlbToFurniture is the same stamp helper", () => {
    const path =
      "catalog-assets/generated/modular-cabinet-v0-600x580x720-slab-white.glb";
    expect(isSystemGeneratedGlbUrl(path)).toBe(true);
    const stamped = attachGeneratedGlbToFurniture(sampleFurniture(), path);
    expect(stamped.generatedGlbUrl).toBe(path);
  });

  it("rejects designer/static GLB URLs", () => {
    expect(
      isSystemGeneratedGlbUrl("https://cdn.example.com/models/sofa.glb"),
    ).toBe(false);
    expect(() =>
      stampFurnitureGeneratedGlb(
        sampleFurniture(),
        "https://cdn.example.com/models/sofa.glb",
      ),
    ).toThrow(/not allowed/i);
  });

  it("rejects empty path", () => {
    expect(() => stampFurnitureGeneratedGlb(sampleFurniture(), "   ")).toThrow(
      /non-empty/i,
    );
  });

  it("placeCatalogItemInProject modular leaves generatedGlbUrl unset (procedural)", () => {
    const placement = placeCatalogItemInProject(
      emptyProject(),
      modularCatalogItem(),
      null,
      { placedFrom: "api" },
    );
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.modularOptions).toBeDefined();
    expect(furniture?.generatedGlbUrl).toBeUndefined();

    const relativePath = modularCabinetV0GeneratedRelativePath(
      defaultCabinetV0Options(furniture?.modularOptions),
    );
    expect(isSystemGeneratedGlbUrl(relativePath)).toBe(true);
    if (!furniture) throw new Error("expected furniture");
    const stamped = stampFurnitureGeneratedGlb(furniture, relativePath);
    expect(stamped.generatedGlbUrl).toBe(relativePath);
  });
});
