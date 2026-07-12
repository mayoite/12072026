/**
 * W4: document is pose authority — 3D scene nodes rebuild without mutating project.
 * Document rotation = degrees; scene node rotation = radians.
 */
import { describe, expect, it } from "vitest";

import { buildPlannerSceneNodes } from "@/features/planner/3d/buildPlannerSceneNodes";
import { addFurniture } from "@/features/planner/project/model/operations/pureActions";
import { createPlannerProject } from "@/features/planner/project/model/project";
import { degreesToRadians } from "@/features/planner/project/model/units";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("W4 pose continuity (document ↔ scene nodes)", () => {
  it("rebuilds furniture pose without mutating document ids/position/rotation", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
      name: "W4 continuity",
      now: "2026-07-09T22:00:00.000Z",
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 1200, y: 800 }, {
      idFactory: ids("furn-w4"),
      width: 600,
      depth: 580,
      height: 720,
    }));

    // Stamp plan rotation in degrees (document convention)
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((item) =>
            item.id === "furn-w4" ? { ...item, rotation: 90 } : item,
          ),
        },
      ],
    };

    const before = structuredClone(project.floors[0]!.furniture.find((f) => f.id === "furn-w4")!);
    const nodesA = buildPlannerSceneNodes(project);
    const nodesB = buildPlannerSceneNodes(project);
    const furnA = nodesA.find((n) => n.id === "furn-w4");
    const furnB = nodesB.find((n) => n.id === "furn-w4");

    expect(furnA).toBeDefined();
    expect(furnA?.kind).toBe("furniture");
    expect(furnA?.xMm).toBe(1200);
    expect(furnA?.yMm).toBe(800);
    expect(furnA?.rotation).toBeCloseTo(degreesToRadians(90), 8);
    expect(furnB?.rotation).toBeCloseTo(furnA!.rotation, 8);

    // Document unchanged after rebuilds (view toggle must not rewrite pose)
    const after = project.floors[0]!.furniture.find((f) => f.id === "furn-w4")!;
    expect(after.id).toBe(before.id);
    expect(after.position).toEqual(before.position);
    expect(after.rotation).toBe(90);
  });
});
