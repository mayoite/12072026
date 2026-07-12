import { describe, expect, it } from "vitest";
import {
  buildPlannerSceneNodes,
  mmToMeters,
} from "@/features/planner/3d/buildPlannerSceneNodes";
import type {
  PlannerFurnitureItem,
  PlannerProject,
} from "@/features/planner/project/model/types";

function sampleProject(
  furnitureOverrides?: PlannerFurnitureItem[],
): PlannerProject {
  return {
    id: "proj-1",
    name: "Test",
    floors: [
      {
        id: "floor-1",
        name: "Ground",
        level: 0,
        walls: [
          {
            id: "wall-a",
            start: { x: 0, y: 0 },
            end: { x: 4000, y: 0 },
            thickness: 100,
            height: 2700,
            color: "#888888",
          },
        ],
        rooms: [],
        doors: [],
        windows: [],
        furniture:
          furnitureOverrides ??
          [
            {
              id: "furn-1",
              catalogId: "cabinet-v0",
              position: { x: 1000, y: 500 },
              rotation: 0,
              scale: { x: 1, y: 1, z: 1 },
              width: 600,
              depth: 580,
              height: 720,
              geometryMode: "modular-cabinet-v0",
              modularOptions: {
                widthMm: 600,
                depthMm: 580,
                heightMm: 720,
                doorStyle: "slab",
                material: "white",
              },
            },
          ],
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      },
    ],
    activeFloorId: "floor-1",
    displayUnit: "mm",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("buildPlannerSceneNodes", () => {
  it("maps walls and furniture with stable entity ids", () => {
    const nodes = buildPlannerSceneNodes(sampleProject());
    expect(nodes).toHaveLength(2);

    const wall = nodes.find((n) => n.kind === "wall");
    const furn = nodes.find((n) => n.kind === "furniture");
    expect(wall?.id).toBe("wall-a");
    expect(wall?.widthMm).toBe(4000);
    expect(wall?.xMm).toBe(2000);
    expect(wall?.yMm).toBe(0);

    expect(furn?.id).toBe("furn-1");
    expect(furn?.xMm).toBe(1000);
    expect(furn?.yMm).toBe(500);
    expect(furn?.widthMm).toBe(600);
    expect(furn?.catalogId).toBe("cabinet-v0");
    expect(furn?.geometryMode).toBe("modular-cabinet-v0");
    expect(furn?.modularOptions).toEqual({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
  });

  it("omits geometry fields for plain box furniture", () => {
    const project = sampleProject([
      {
        id: "furn-box",
        catalogId: "sample-sofa-1",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 2200,
        depth: 900,
        height: 850,
      },
    ]);
    const furn = buildPlannerSceneNodes(project).find(
      (n) => n.kind === "furniture",
    );
    expect(furn?.geometryMode).toBeUndefined();
    expect(furn?.modularOptions).toBeUndefined();
    expect(furn?.widthMm).toBe(2200);
  });

  it("propagates modular geometryMode + modularOptions copy", () => {
    const modularOptions = {
      widthMm: 900,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "pair" as const,
      material: "oak" as const,
    };
    const project = sampleProject([
      {
        id: "furn-mod",
        catalogId: "cabinet-v0",
        position: { x: 200, y: 300 },
        rotation: 45, // plan degrees
        scale: { x: 1, y: 1, z: 1 },
        width: 900,
        depth: 580,
        height: 720,
        geometryMode: "modular-cabinet-v0",
        modularOptions,
      },
    ]);
    const furn = buildPlannerSceneNodes(project).find((n) => n.id === "furn-mod");
    expect(furn?.kind).toBe("furniture");
    expect(furn?.geometryMode).toBe("modular-cabinet-v0");
    expect(furn?.modularOptions).toEqual(modularOptions);
    // Shallow copy — mutating source options must not mutate node
    modularOptions.material = "white";
    expect(furn?.modularOptions?.material).toBe("oak");
    expect(furn?.rotation).toBeCloseTo(Math.PI / 4, 8); // scene radians
    expect(furn?.xMm).toBe(200);
    expect(furn?.yMm).toBe(300);
  });

  it("propagates policy-allowed generatedGlbUrl onto furniture node", () => {
    const url = "catalog-assets/generated/cab-abc.glb";
    const project = sampleProject([
      {
        id: "furn-glb",
        catalogId: "cabinet-v0",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 580,
        height: 720,
        generatedGlbUrl: url,
      },
    ]);
    const furn = buildPlannerSceneNodes(project).find((n) => n.id === "furn-glb");
    expect(furn?.generatedGlbUrl).toBe(url);
    expect(furn?.geometryMode).toBeUndefined();
  });

  it("propagates modular fields together with generatedGlbUrl", () => {
    const url = "catalog-assets/generated/modular-cab.glb";
    const modularOptions = {
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab" as const,
      material: "white" as const,
    };
    const project = sampleProject([
      {
        id: "furn-mod-glb",
        catalogId: "cabinet-v0",
        position: { x: 1200, y: 800 },
        rotation: 90, // plan degrees
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 580,
        height: 720,
        geometryMode: "modular-cabinet-v0",
        modularOptions,
        generatedGlbUrl: url,
      },
    ]);
    const furn = buildPlannerSceneNodes(project).find(
      (n) => n.id === "furn-mod-glb",
    );
    expect(furn).toMatchObject({
      id: "furn-mod-glb",
      kind: "furniture",
      catalogId: "cabinet-v0",
      geometryMode: "modular-cabinet-v0",
      modularOptions,
      generatedGlbUrl: url,
      xMm: 1200,
      yMm: 800,
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
    });
    expect(furn?.rotation).toBeCloseTo(Math.PI / 2, 8);
  });

  it("converts furniture plan degrees to scene radians (walls stay atan2 radians)", () => {
    const project = sampleProject([
      {
        id: "furn-90",
        catalogId: "box",
        position: { x: 0, y: 0 },
        rotation: 90,
        scale: { x: 1, y: 1, z: 1 },
        width: 800,
        depth: 400,
        height: 750,
      },
      {
        id: "furn-neg",
        catalogId: "box",
        position: { x: 1, y: 1 },
        rotation: -90,
        scale: { x: 1, y: 1, z: 1 },
        width: 800,
        depth: 400,
        height: 750,
      },
    ]);
    const f90 = buildPlannerSceneNodes(project).find((n) => n.id === "furn-90");
    const fNeg = buildPlannerSceneNodes(project).find((n) => n.id === "furn-neg");
    expect(f90?.rotation).toBeCloseTo(Math.PI / 2, 8);
    expect(fNeg?.rotation).toBeCloseTo((270 * Math.PI) / 180, 8); // normalizeDegrees(-90)=270
  });

  it("drops designer static meshUrl and blank generatedGlbUrl", () => {
    const project = sampleProject([
      {
        id: "furn-static",
        catalogId: "sofa",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        meshUrl: "https://cdn.example.com/models/sofa.glb",
      },
      {
        id: "furn-blank",
        catalogId: "desk",
        position: { x: 1, y: 1 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        generatedGlbUrl: "   ",
      },
    ]);
    const nodes = buildPlannerSceneNodes(project);
    expect(nodes.find((n) => n.id === "furn-static")?.generatedGlbUrl).toBeUndefined();
    expect(nodes.find((n) => n.id === "furn-blank")?.generatedGlbUrl).toBeUndefined();
  });

  it("prefers generatedGlbUrl over glbUrl and meshUrl", () => {
    const project = sampleProject([
      {
        id: "furn-pref",
        catalogId: "cab",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        generatedGlbUrl: "catalog-assets/generated/a.glb",
        glbUrl: "catalog-assets/generated/b.glb",
        meshUrl: "catalog-assets/generated/c.glb",
      },
    ]);
    const furn = buildPlannerSceneNodes(project).find((n) => n.id === "furn-pref");
    expect(furn?.generatedGlbUrl).toBe("catalog-assets/generated/a.glb");
  });

  it("applies scale multipliers to furniture dimensions and defaults", () => {
    const project = sampleProject([
      {
        id: "furn-scaled",
        catalogId: "box",
        position: { x: 10, y: 20 },
        rotation: 0,
        scale: { x: 2, y: 0.5, z: 1.5 },
        width: 800,
        depth: 400,
        height: 600,
      },
      {
        id: "furn-defaults",
        catalogId: "box-default",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
      },
    ]);
    const scaled = buildPlannerSceneNodes(project).find(
      (n) => n.id === "furn-scaled",
    );
    expect(scaled?.widthMm).toBe(1600);
    expect(scaled?.depthMm).toBe(200);
    expect(scaled?.heightMm).toBe(900);

    const defaults = buildPlannerSceneNodes(project).find(
      (n) => n.id === "furn-defaults",
    );
    // DEFAULT_FURNITURE_W/D/H = 800/800/750
    expect(defaults?.widthMm).toBe(800);
    expect(defaults?.depthMm).toBe(800);
    expect(defaults?.heightMm).toBe(750);
  });

  it("returns [] for empty floors and maps wall center/rotation", () => {
    expect(
      buildPlannerSceneNodes({ floors: [], activeFloorId: "missing" }),
    ).toEqual([]);

    const project = sampleProject([]);
    project.floors[0].walls = [
      {
        id: "wall-diag",
        start: { x: 0, y: 0 },
        end: { x: 3000, y: 4000 },
        thickness: 10,
        height: 0,
        color: "#111111",
      },
    ];
    const wall = buildPlannerSceneNodes(project).find((n) => n.id === "wall-diag");
    expect(wall?.kind).toBe("wall");
    expect(wall?.xMm).toBe(1500);
    expect(wall?.yMm).toBe(2000);
    expect(wall?.widthMm).toBe(5000);
    // thickness floored at 50
    expect(wall?.depthMm).toBe(50);
    // height 0 falls back to DEFAULT_WALL_HEIGHT 2700
    expect(wall?.heightMm).toBe(2700);
    expect(wall?.rotation).toBeCloseTo(Math.atan2(4000, 3000), 8);
  });

  it("converts mm to metres for Three world", () => {
    expect(mmToMeters(1000)).toBe(1);
    expect(mmToMeters(600)).toBeCloseTo(0.6);
  });
});
