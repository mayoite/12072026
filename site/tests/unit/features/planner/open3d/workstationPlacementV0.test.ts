import { describe, expect, it } from "vitest";

import {
  placeWorkstationConfigOnProject,
  placeWorkstationInstancesOnProject,
} from "@/features/planner/open3d/catalog/placementAction";
import {
  createWorkstationConfigV0,
  layoutWorkstationInstances,
  workstationConfigKey,
  workstationFootprintMm,
} from "@/features/planner/open3d/catalog/workstationSystemV0";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import type { Open3dProject } from "@/features/planner/open3d/model/types";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFloor(project: Open3dProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) {
    throw new Error(`Active floor not found: ${project.activeFloorId}`);
  }
  return floor;
}

describe("placeWorkstationConfigOnProject", () => {
  it("places linear 1500×600 as one furniture with footprint width/depth and box geometry", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const fp = workstationFootprintMm(config);
    expect(fp).toEqual({ widthMm: 1500, depthMm: 600 });

    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "WS Place Linear",
      now: "2026-07-09T16:00:00.000Z",
    });

    const position = { x: 1000, y: 500 };
    const placed = placeWorkstationConfigOnProject(project, config, position, {
      idFactory: ids("ws-furn-1"),
    });
    project = placed.project;

    const furniture = activeFloor(project).furniture;
    expect(furniture).toHaveLength(1);

    const item = furniture[0]!;
    expect(item.id).toBe("ws-furn-1");
    expect(item.catalogId).toBe(workstationConfigKey(config));
    expect(item.catalogId).toMatch(/^ws-v0-linear-1500x600-/);
    expect(item.position).toEqual(position);
    expect(item.width).toBe(1500);
    expect(item.depth).toBe(600);
    expect(item.height).toBe(config.heightMm);
    expect(item.geometryMode).toBe("box");
    expect(placed.action.type).toBe("PLACE_WORKSTATION_V0");
  });

  it("places 3 instances via layoutWorkstationInstances coordinates", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
    });
    const layouts = layoutWorkstationInstances(config, 3, { columns: 3 });
    expect(layouts).toHaveLength(3);

    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "WS Place Grid",
      now: "2026-07-09T16:00:00.000Z",
    });

    const idFactory = ids("ws-0", "ws-1", "ws-2");
    for (const layout of layouts) {
      const result = placeWorkstationConfigOnProject(
        project,
        config,
        { x: layout.xMm, y: layout.yMm },
        { idFactory },
      );
      project = result.project;
    }

    const furniture = activeFloor(project).furniture;
    expect(furniture).toHaveLength(3);

    const catalogId = workstationConfigKey(config);
    for (let i = 0; i < 3; i += 1) {
      const item = furniture[i]!;
      expect(item.id).toBe(`ws-${i}`);
      expect(item.catalogId).toBe(catalogId);
      expect(item.position).toEqual({
        x: layouts[i]!.xMm,
        y: layouts[i]!.yMm,
      });
      expect(item.width).toBe(1500);
      expect(item.depth).toBe(600);
      expect(item.geometryMode).toBe("box");
    }

    // Distinct grid coords (first col/row origin; others spaced)
    expect(furniture[0]!.position).toEqual({ x: 0, y: 0 });
    expect(furniture[1]!.position.x).toBeGreaterThan(0);
    expect(furniture[2]!.position.x).toBeGreaterThan(furniture[1]!.position.x);
  });
});

describe("placeWorkstationInstancesOnProject", () => {
  it("places 50 instances in one batch action", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "panel"],
    });
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "WS Batch",
      now: "2026-07-09T18:00:00.000Z",
    });

    const batchIds = Array.from({ length: 50 }, (_, i) => `batch-${i}`);
    const result = placeWorkstationInstancesOnProject(project, config, 50, {
      columns: 10,
      originMm: { x: 500, y: 200 },
      idFactory: ids(...batchIds),
    });
    project = result.project;

    expect(result.action.type).toBe("PLACE_WORKSTATION_V0_BATCH");
    expect(result.action.payload?.count).toBe(50);
    expect(activeFloor(project).furniture).toHaveLength(50);
    expect(activeFloor(project).furniture[0]!.position).toEqual({
      x: 500,
      y: 200,
    });
    expect(activeFloor(project).furniture[0]!.width).toBe(1200);
  });
});
