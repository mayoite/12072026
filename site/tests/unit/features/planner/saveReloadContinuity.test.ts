import { describe, expect, it } from "vitest";

import { defaultCabinetV0Options } from "@/features/planner/project/catalog/modularCabinetV0";
import {
  addFurniture,
  addWall,
  updateFurniture,
} from "@/features/planner/project/model/operations/pureActions";
import { createOpen3dProject } from "@/features/planner/project/model/project";
import type { Open3dProject } from "@/features/planner/project/model/types";
import {
  envelopeToJsonString,
  exportToJson,
} from "@/features/planner/project/shared/export/jsonExport";
import { importFromJson } from "@/features/planner/project/shared/export/jsonImport";
import {
  exportOpen3dProjectJson,
  importOpen3dProjectJson,
} from "@/features/planner/project/persistence/projectJson";

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

/**
 * 2B.4 slice: draw wall + modular furniture → save envelope JSON → reload.
 * Pure unit path (no browser): createOpen3dProject, pureActions, export/import.
 */
describe("open3d draw → save envelope → reload continuity (2B.4)", () => {
  it("preserves wall ends, furniture ids, and modular geometryMode/options through envelope JSON", () => {
    const modularOptions = defaultCabinetV0Options({
      widthMm: 800,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "pair",
      material: "oak",
    });

    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Save Reload Continuity",
      now: "2026-07-09T12:00:00.000Z",
    });

    const wallStart = { x: 0, y: 0 };
    const wallEnd = { x: 4000, y: 0 };
    const furniturePosition = { x: 1200, y: 800 };

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
    }));

    const drawnFloor = activeFloor(project);
    expect(drawnFloor.walls).toHaveLength(1);
    expect(drawnFloor.furniture).toHaveLength(1);
    expect(drawnFloor.walls[0]?.id).toBe("wall-1");
    expect(drawnFloor.furniture[0]?.id).toBe("furn-1");
    expect(drawnFloor.furniture[0]?.geometryMode).toBe("modular-cabinet-v0");
    expect(drawnFloor.furniture[0]?.modularOptions).toEqual(modularOptions);

    const exportResult = exportToJson(project);
    expect(exportResult.success).toBe(true);
    expect(exportResult.envelope.type).toBe("open3d-floorplan-project");
    expect(exportResult.envelope.version).toBe(1);

    const jsonString = envelopeToJsonString(exportResult.envelope, true);
    expect(jsonString.length).toBeGreaterThan(0);
    expect(jsonString).toContain("open3d-floorplan-project");
    expect(jsonString).toContain("modular-cabinet-v0");

    const importResult = importFromJson(jsonString);
    expect(importResult.success).toBe(true);
    expect(importResult.project).not.toBeNull();

    const reloaded = importResult.project!;
    expect(reloaded.id).toBe("project-1");
    expect(reloaded.name).toBe("Save Reload Continuity");
    expect(reloaded.activeFloorId).toBe("floor-1");

    const reloadedFloor = activeFloor(reloaded);
    expect(reloadedFloor.id).toBe("floor-1");
    expect(reloadedFloor.walls).toHaveLength(1);
    expect(reloadedFloor.furniture).toHaveLength(1);

    const wall = reloadedFloor.walls[0];
    expect(wall).toBeDefined();
    expect(wall!.id).toBe("wall-1");
    expect(wall!.start).toEqual(wallStart);
    expect(wall!.end).toEqual(wallEnd);

    const furniture = reloadedFloor.furniture[0];
    expect(furniture).toBeDefined();
    expect(furniture!.id).toBe("furn-1");
    expect(furniture!.catalogId).toBe("cabinet-v0");
    expect(furniture!.position).toEqual(furniturePosition);
    expect(furniture!.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture!.modularOptions).toEqual(modularOptions);
    expect(furniture!.width).toBe(800);
    expect(furniture!.depth).toBe(580);
    expect(furniture!.height).toBe(720);
  });

  it("also preserves modular furniture through exportOpen3dProjectJson round-trip", () => {
    const modularOptions = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });

    let project = createOpen3dProject({
      idFactory: ids("floor-a", "project-a"),
      name: "Project JSON Continuity",
      now: "2026-07-09T12:30:00.000Z",
    });

    ({ project } = addWall(
      project,
      { x: 100, y: 200 },
      { x: 3100, y: 200 },
      { idFactory: ids("wall-a") },
    ));
    ({ project } = addFurniture(
      project,
      "cabinet-v0",
      { x: 500, y: 600 },
      { idFactory: ids("furn-a") },
    ));
    ({ project } = updateFurniture(project, "furn-a", {
      geometryMode: "modular-cabinet-v0",
      modularOptions,
      width: modularOptions.widthMm,
      depth: modularOptions.depthMm,
      height: modularOptions.heightMm,
    }));

    const json = exportOpen3dProjectJson(project);
    const reloaded = importOpen3dProjectJson(json);

    expect(reloaded.id).toBe("project-a");
    expect(reloaded.activeFloorId).toBe("floor-a");

    const floor = activeFloor(reloaded);
    expect(floor.walls[0]?.id).toBe("wall-a");
    expect(floor.walls[0]?.start).toEqual({ x: 100, y: 200 });
    expect(floor.walls[0]?.end).toEqual({ x: 3100, y: 200 });

    const furniture = floor.furniture[0];
    expect(furniture?.id).toBe("furn-a");
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.modularOptions).toEqual(modularOptions);
  });
});
