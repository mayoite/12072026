import { describe, expect, it, vi } from "vitest";
import { applyLayoutToWorkspace } from "@/features/planner/ai/applyLayoutToWorkspace";
import { createPlannerProject } from "@/features/planner/project/model/project";
import type { SuggestedLayoutJson } from "@/features/planner/ai/types";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";

const baseLayout: SuggestedLayoutJson = {
  version: 1,
  source: "grid-pack",
  summary: "room",
  room: { label: "Open", x: 0, y: 0, widthMm: 6000, depthMm: 4000 },
  walls: [],
  zones: [],
  furniture: [],
};

describe("applyLayoutToWorkspace", () => {
  it("returns project unchanged when schema invalid", () => {
    const project = createPlannerProject({ name: "P" });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const next = applyLayoutToWorkspace(
      project,
      { ...baseLayout, version: 2 as 1 },
      () => undefined,
    );
    expect(next).toBe(project);
    spy.mockRestore();
  });

  it("adds rectangular room when walls empty", () => {
    const project = createPlannerProject({ name: "P" });
    const next = applyLayoutToWorkspace(project, baseLayout, () => undefined);
    const floor = next.floors[0];
    expect(floor.walls.length).toBeGreaterThanOrEqual(4);
  });

  it("places furniture when catalog resolves", () => {
    const project = createPlannerProject({ name: "P" });
    const item = {
      id: "desk-1",
      slug: "desk-1",
      sku: "DESK-1",
      name: "Desk",
      shortName: "Desk",
      description: "Linear desk",
      category: "Furniture",
      subCategory: "Desks",
      taxonomyPath: "Furniture > Desks",
      dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
      displayUnit: "mm",
      assets: { imageUrls: [] },
      material: {
        marketingMaterial: "Oak",
        normalizedMaterial: "oak",
      },
      roomTags: ["Office"],
      styleTags: ["Modern"],
      availability: "in-stock",
      assemblyType: "flat-pack",
      flatPack: true,
      tags: ["desk"],
      variants: [],
      provenance: { source: "sample_data" },
      symbolOnly: false,
    } as PlannerCatalogItem;
    const layout: SuggestedLayoutJson = {
      ...baseLayout,
      furniture: [
        {
          catalogItemId: "desk-1",
          label: "Desk",
          x: 100,
          y: 100,
          rotation: 0,
        },
      ],
    };
    const next = applyLayoutToWorkspace(project, layout, (id) =>
      id === "desk-1" ? item : undefined,
    );
    const furniture = next.floors.flatMap((f) => f.furniture);
    expect(furniture.length).toBeGreaterThanOrEqual(1);
  });
});
