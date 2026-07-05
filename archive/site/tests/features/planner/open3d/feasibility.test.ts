import { describe, expect, it } from "vitest";

import {
  addOpen3dWall,
  boundsMmToOpen3dCm,
  boundsOpen3dCmToMm,
  createOpen3dGuestProjectRepository,
  createOpen3dProject,
  createRectangularRoomProject,
  exportOpen3dProjectJson,
  importOpen3dProjectJson,
  mmToOpen3dCm,
  normalizeDegrees,
  open3dCmToMm,
} from "@/features/planner/open3d";

function ids(...values: string[]): () => string {
  let index = 0;
  return () => values[index++] ?? `id-${index}`;
}

function memoryStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("native Open3D feasibility slice", () => {
  it("creates an empty project and adds a wall without mutation", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      now: "2026-07-03T00:00:00.000Z",
    });
    const updated = addOpen3dWall(
      project,
      { start: { x: 0, y: 0 }, end: { x: 400, y: 0 } },
      ids("wall-1"),
      "2026-07-03T00:01:00.000Z",
    );

    expect(project.floors[0].walls).toEqual([]);
    expect(updated.floors[0].walls[0]).toMatchObject({
      id: "wall-1",
      height: 2700,
      thickness: 150,
    });
  });

  it("creates a four-wall rectangular room in canonical millimetres", () => {
    const project = createRectangularRoomProject({
      widthMm: 6000,
      depthMm: 4000,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    expect(project.floors[0].walls).toHaveLength(4);
    expect(project.floors[0].walls[1].end).toEqual({ x: 6000, y: 4000 });
  });

  it("round-trips units, bounds, angles, and project JSON", () => {
    expect(open3dCmToMm(mmToOpen3dCm(1250))).toBe(1250);
    expect(boundsOpen3dCmToMm(boundsMmToOpen3dCm({
      minX: -100,
      minY: 0,
      maxX: 2000,
      maxY: 1500,
    }))).toEqual({ minX: -100, minY: 0, maxX: 2000, maxY: 1500 });
    expect(normalizeDegrees(-90)).toBe(270);

    const project = createOpen3dProject({ idFactory: ids("floor", "project") });
    expect(importOpen3dProjectJson(exportOpen3dProjectJson(project))).toEqual(project);
  });

  it("saves and loads guest projects using only the supplied local storage", () => {
    const project = createOpen3dProject({ idFactory: ids("floor", "project") });
    const repository = createOpen3dGuestProjectRepository(memoryStorage());
    repository.save(project);
    expect(repository.load(project.id)).toEqual(project);
  });
});
