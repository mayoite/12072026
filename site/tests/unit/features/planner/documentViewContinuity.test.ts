import { describe, expect, it } from "vitest";

import { buildPlannerSceneNodes } from "@/features/planner/3d/buildPlannerSceneNodes";
import {
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
} from "@/features/planner/project/catalog/modularCabinetV0";
import { resolveFurniture2DFootprint } from "@/features/planner/project/catalog/parametricBuilder";
import {
  addFurniture,
  addWall,
  updateFurniture,
} from "@/features/planner/project/model/operations/pureActions";
import { createPlannerProject } from "@/features/planner/project/model/project";
import type { PlannerProject } from "@/features/planner/project/model/types";
import { degreesToRadians } from "@/features/planner/project/model/units";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFloor(project: PlannerProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) {
    throw new Error(`Active floor not found: ${project.activeFloorId}`);
  }
  return floor;
}

/**
 * 2D↔3D continuity via the same PlannerProject document (source of truth).
 * Pure unit path: create → place wall/furniture → buildPlannerSceneNodes →
 * updateFurniture pose → rebuild; modular footprint still resolves after place.
 */
describe("open3d document view continuity (2D↔3D same project)", () => {
  it("buildPlannerSceneNodes ids match wall/furniture; pose updates rebuild; modular footprint works after place", () => {
    const modularOptions = defaultCabinetV0Options({
      widthMm: 800,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "pair",
      material: "oak",
    });

    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Document View Continuity",
      now: "2026-07-09T14:00:00.000Z",
    });

    const wallStart = { x: 0, y: 0 };
    const wallEnd = { x: 4000, y: 0 };
    const furniturePosition = { x: 1200, y: 800 };
    // Document convention = degrees (not radians)
    const furnitureRotationDeg = 45;

    ({ project } = addWall(project, wallStart, wallEnd, {
      idFactory: ids("wall-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", furniturePosition, {
      idFactory: ids("furn-1"),
    }));
    ({ project } = updateFurniture(project, "furn-1", {
      geometryMode: "modular-cabinet-v0",
      modularOptions,
      width: modularOptions.widthMm,
      depth: modularOptions.depthMm,
      height: modularOptions.heightMm,
      rotation: furnitureRotationDeg,
    }));

    const floor = activeFloor(project);
    expect(floor.walls).toHaveLength(1);
    expect(floor.furniture).toHaveLength(1);
    expect(floor.walls[0]?.id).toBe("wall-1");
    expect(floor.furniture[0]?.id).toBe("furn-1");

    // 3D rebuild from document: node ids match entity ids; pose from document
    const nodes = buildPlannerSceneNodes(project);
    expect(nodes).toHaveLength(2);

    const wallNode = nodes.find((n) => n.kind === "wall");
    const furnNode = nodes.find((n) => n.kind === "furniture");

    expect(wallNode).toBeDefined();
    expect(wallNode!.id).toBe("wall-1");
    expect(wallNode!.id).toBe(floor.walls[0]!.id);
    expect(wallNode!.xMm).toBe(2000);
    expect(wallNode!.yMm).toBe(0);
    expect(wallNode!.widthMm).toBe(4000);

    expect(furnNode).toBeDefined();
    expect(furnNode!.id).toBe("furn-1");
    expect(furnNode!.id).toBe(floor.furniture[0]!.id);
    expect(furnNode!.xMm).toBe(furniturePosition.x);
    expect(furnNode!.yMm).toBe(furniturePosition.y);
    // Scene nodes convert document degrees → radians
    expect(furnNode!.rotation).toBeCloseTo(
      degreesToRadians(furnitureRotationDeg),
      8,
    );
    expect(furnNode!.widthMm).toBe(800);
    expect(furnNode!.depthMm).toBe(580);
    expect(furnNode!.heightMm).toBe(720);
    expect(furnNode!.catalogId).toBe("cabinet-v0");
    expect(furnNode!.geometryMode).toBe("modular-cabinet-v0");
    expect(furnNode!.modularOptions).toEqual(modularOptions);

    // After updateFurniture position (+ rotation deg), rebuild reflects new pose
    const newPosition = { x: 2500, y: 1500 };
    const newRotationDeg = 90;
    ({ project } = updateFurniture(project, "furn-1", {
      position: newPosition,
      rotation: newRotationDeg,
    }));

    const floorAfter = activeFloor(project);
    expect(floorAfter.furniture[0]?.position).toEqual(newPosition);
    expect(floorAfter.furniture[0]?.rotation).toBe(newRotationDeg);
    // Wall and furniture entity ids stable across pose edit
    expect(floorAfter.walls[0]?.id).toBe("wall-1");
    expect(floorAfter.furniture[0]?.id).toBe("furn-1");

    const rebuilt = buildPlannerSceneNodes(project);
    expect(rebuilt).toHaveLength(2);

    const wallAfter = rebuilt.find((n) => n.kind === "wall");
    const furnAfter = rebuilt.find((n) => n.kind === "furniture");

    expect(wallAfter?.id).toBe("wall-1");
    expect(furnAfter?.id).toBe("furn-1");
    expect(furnAfter?.xMm).toBe(newPosition.x);
    expect(furnAfter?.yMm).toBe(newPosition.y);
    expect(furnAfter?.rotation).toBeCloseTo(
      degreesToRadians(newRotationDeg),
      8,
    );
    // Modular fields survive pose-only update
    expect(furnAfter?.geometryMode).toBe("modular-cabinet-v0");
    expect(furnAfter?.modularOptions).toEqual(modularOptions);
    expect(furnAfter?.widthMm).toBe(800);

    // 2D footprint for modular still works after place (same document item)
    const placed = floorAfter.furniture[0]!;
    const footprint = resolveFurniture2DFootprint(placed);
    expect(footprint).toBe(generateCabinetV0Footprint(modularOptions));
    expect(footprint).toBe("M -400 -290 L 400 -290 L 400 290 L -400 290 Z");
  });
});
