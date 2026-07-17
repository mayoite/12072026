import { describe, expect, it } from "vitest";
import {
  buildPlannerSceneNodes,
  mmToMeters,
} from "@/features/planner/3d/buildPlannerSceneNodes";
import type { PlannerProject } from "@/features/planner/model/types";

function projectWith(
  floor: Partial<PlannerProject["floors"][number]> & { id: string },
): PlannerProject {
  return {
    id: "proj-1",
    name: "Scene",
    activeFloorId: floor.id,
    displayUnit: "mm",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    floors: [
      {
        id: floor.id,
        name: "Ground",
        level: 0,
        walls: floor.walls ?? [],
        rooms: floor.rooms ?? [],
        doors: floor.doors ?? [],
        windows: floor.windows ?? [],
        furniture: floor.furniture ?? [],
        stairs: floor.stairs ?? [],
        columns: floor.columns ?? [],
        guides: floor.guides ?? [],
        measurements: floor.measurements ?? [],
        annotations: floor.annotations ?? [],
        textAnnotations: floor.textAnnotations ?? [],
        groups: floor.groups ?? [],
      },
    ],
  };
}

describe("buildPlannerSceneNodes", () => {
  it("converts mm to metres", () => {
    expect(mmToMeters(1000)).toBeCloseTo(1, 6);
    expect(mmToMeters(0)).toBe(0);
  });

  it("returns empty array when no floors", () => {
    expect(
      buildPlannerSceneNodes({ floors: [], activeFloorId: "missing" }),
    ).toEqual([]);
  });

  it("builds wall nodes from start/end", () => {
    const project = projectWith({
      id: "f1",
      walls: [
        {
          id: "w1",
          start: { x: 0, y: 0 },
          end: { x: 4000, y: 0 },
          thickness: 100,
          height: 2700,
          color: "#888",
        },
      ],
    });
    const nodes = buildPlannerSceneNodes(project);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({
      id: "w1",
      kind: "wall",
      xMm: 2000,
      yMm: 0,
      widthMm: 4000,
      depthMm: 100,
      heightMm: 2700,
      rotation: 0,
    });
  });

  it("builds furniture with degrees→radians and defaults", () => {
    const project = projectWith({
      id: "f1",
      furniture: [
        {
          id: "desk-1",
          catalogId: "desk",
          position: { x: 1000, y: 500 },
          rotation: 90,
          scale: { x: 1, y: 1, z: 1 },
        },
      ],
    });
    const node = buildPlannerSceneNodes(project)[0];
    expect(node.kind).toBe("furniture");
    expect(node.widthMm).toBe(800);
    expect(node.rotation).toBeCloseTo(Math.PI / 2, 5);
  });

  it("passes policy-allowed generatedGlbUrl and drops designer static meshUrl", () => {
    const project = projectWith({
      id: "f1",
      furniture: [
        {
          id: "cab",
          catalogId: "cabinet-v0",
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          generatedGlbUrl: "catalog-assets/generated/cab.glb",
        },
        {
          id: "sofa",
          catalogId: "sofa",
          position: { x: 100, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          meshUrl: "https://cdn.example.com/models/sofa.glb",
        },
      ],
    });
    const nodes = buildPlannerSceneNodes(project);
    expect(nodes.find((n) => n.id === "cab")?.generatedGlbUrl).toBe(
      "catalog-assets/generated/cab.glb",
    );
    expect(nodes.find((n) => n.id === "sofa")?.generatedGlbUrl).toBeUndefined();
  });
});
