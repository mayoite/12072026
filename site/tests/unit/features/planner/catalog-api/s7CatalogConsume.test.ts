/**
 * P05 / asset-engine S7 - catalog place stamps published SVG URL.
 * Proves place stamps previewImageUrl onto furniture (inventory place consume).
 * Canvas draw path: svgPlanSymbolCache.test.ts + PlannerCanvasStage.
 */
import { describe, expect, it } from "vitest";
import { placeCatalogItemInProject } from "@/features/planner/project/catalog/placementAction";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";
import type { PlannerProject } from "@/features/planner/project/model/types";
import {
  buildSvgCatalogPublicUrl,
  isSvgAssetUrl,
} from "@/features/planner/project/catalog/svg/svgPreviewAssets";

function emptyProject(id = "s7-proj"): PlannerProject {
  return {
    id,
    name: "S7",
    activeFloorId: "floor-1",
    displayUnit: "cm",
    createdAt: "2026-07-10T00:00:00.000Z",
    updatedAt: "2026-07-10T00:00:00.000Z",
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

function svgCatalogItem(slug = "chaise-lounge-001"): PlannerCatalogItem {
  const previewImageUrl = buildSvgCatalogPublicUrl(slug);
  return {
    id: "f81e3a1b-16f4-4000-8000-000000000001",
    slug,
    sku: "OFL-CHS-001",
    name: "Chaise Lounge",
    shortName: "Chaise Lounge",
    description: `SVG symbol · Chaise Lounge`,
    category: "Symbols",
    subCategory: "SVG Catalog",
    taxonomyPath: `Symbols > SVG Catalog > Chaise Lounge`,
    dimensions: { widthMm: 800, depthMm: 1600, heightMm: 420 },
    displayUnit: "mm",
    assets: {
      imageUrls: [],
      previewImageUrl,
    },
    material: {
      marketingMaterial: "SVG",
      normalizedMaterial: "svg-symbol",
    },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: [slug, "descriptor", "symbol", "svg"],
    variants: [],
    provenance: { source: "descriptor-loader" },
    symbolOnly: true,
    license: "standard",
    animated: false,
    staffPicked: false,
    favourite: false,
    downloadable: true,
  };
}

describe("S7 catalog/inventory published SVG consume", () => {
  it("builds inventory-safe public URL under /svg-catalog/{slug}.svg", () => {
    const url = buildSvgCatalogPublicUrl("side-table-001");
    expect(url).toBe("/svg-catalog/side-table-001.svg");
    expect(isSvgAssetUrl(url)).toBe(true);
  });

  it("placeCatalogItemInProject stamps catalog previewImageUrl onto furniture (S7)", () => {
    const project = emptyProject("s7-proj");
    const item = svgCatalogItem("chaise-lounge-001");
    const placement = placeCatalogItemInProject(project, item, null, {
      placedFrom: "click",
      position: { x: 500, y: 600 },
    });
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture).toBeDefined();
    expect(furniture?.previewImageUrl).toBe("/svg-catalog/chaise-lounge-001.svg");
    expect(furniture?.sourceSlug).toBe("chaise-lounge-001");
    expect(isSvgAssetUrl(furniture?.previewImageUrl ?? "")).toBe(true);
  });

  it("does not invent a preview URL when catalog item has none", () => {
    const project = emptyProject("s7-empty");
    const item = svgCatalogItem("no-preview");
    item.assets = { imageUrls: [] };
    const placement = placeCatalogItemInProject(project, item, null, {
      placedFrom: "click",
      position: { x: 0, y: 0 },
    });
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture?.previewImageUrl).toBeUndefined();
  });
});