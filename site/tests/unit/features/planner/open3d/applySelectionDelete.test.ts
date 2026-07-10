import { describe, expect, it } from "vitest";

import {
  applySelectionDelete,
  deleteEntityFromProject,
  resolveSelectedEntity,
  updateEntityInProject,
} from "@/features/planner/open3d/editor/workspaceEntityHelpers";
import type { CanvasSelection } from "@/features/planner/open3d/editor/useWorkspaceCanvas";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import {
  addFurniture,
  addWall,
} from "@/features/planner/open3d/model/operations/pureActions";
import type { Open3dFurnitureItem, Open3dProject } from "@/features/planner/open3d/model/types";
import {
  createOpen3dHistory,
  undoOpen3dAction,
  updateOpen3dProject,
} from "@/features/planner/open3d/store/history";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFloor(project: Open3dProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) throw new Error("no active floor");
  return floor;
}

function activeFurniture(project: Open3dProject) {
  return activeFloor(project).furniture;
}

function stampFurniture(
  project: Open3dProject,
  id: string,
  patch: Partial<Open3dFurnitureItem>,
): Open3dProject {
  const floorIndex = project.floors.findIndex((f) => f.id === project.activeFloorId);
  if (floorIndex === -1) throw new Error("no active floor");
  return {
    ...project,
    floors: project.floors.map((f, i) =>
      i === floorIndex
        ? {
            ...f,
            furniture: f.furniture.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          }
        : f,
    ),
  };
}

function poseSnapshot(item: Open3dFurnitureItem) {
  return {
    id: item.id,
    catalogId: item.catalogId,
    position: { ...item.position },
    rotation: item.rotation,
    width: item.width,
    depth: item.depth,
  };
}

describe("applySelectionDelete (W3 pure)", () => {
  it("returns same project reference when selection is none", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const next = applySelectionDelete(project, { type: "none", ids: [] });
    expect(next).toBe(project);
  });

  it("returns same project reference when furniture selection has empty ids", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("furn-1"),
    }));
    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: [],
    });
    expect(next).toBe(project);
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["furn-1"]);
  });

  it("removes one furniture id and keeps other entities", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 2000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 500, y: 500 }, {
      idFactory: ids("furn-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 900, y: 500 }, {
      idFactory: ids("furn-2"),
    }));

    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["furn-1"],
    });
    expect(next).not.toBe(project);
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["furn-2"]);
    expect(next.floors[0]?.walls).toHaveLength(1);
  });

  it("skips locked furniture and returns same project reference", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 200 }, {
      idFactory: ids("locked-1"),
    }));
    project = stampFurniture(project, "locked-1", { locked: true });

    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["locked-1"],
    });
    expect(next).toBe(project);
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["locked-1"]);
    expect(activeFurniture(next)[0]?.locked).toBe(true);
  });

  it("deletes unlocked furniture while keeping locked peers in the same multi-id selection", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("free"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 200, y: 0 }, {
      idFactory: ids("locked"),
    }));
    project = stampFurniture(project, "locked", { locked: true });

    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["free", "locked"],
    });
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["locked"]);
    expect(activeFurniture(next)[0]?.locked).toBe(true);
  });

  it("returns same project when active floor id is missing", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("furn-1"),
    }));
    const orphaned = { ...project, activeFloorId: "missing-floor" };
    const next = applySelectionDelete(orphaned, {
      type: "furniture",
      ids: ["furn-1"],
    });
    expect(next).toBe(orphaned);
  });

  it("returns same project for unknown selection type (defensive branch)", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("furn-1"),
    }));
    // Runtime-only invalid type — not expressible in CanvasSelection union.
    const next = applySelectionDelete(project, {
      type: "measurement" as CanvasSelection["type"],
      ids: ["furn-1"],
    });
    expect(next).toBe(project);
  });

  it("removes multi-id furniture in one project revision (single history step)", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 100 }, {
      idFactory: ids("a"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 200, y: 100 }, {
      idFactory: ids("b"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 300, y: 100 }, {
      idFactory: ids("c"),
    }));

    let history = createOpen3dHistory(project);
    const afterDelete = applySelectionDelete(project, {
      type: "furniture",
      ids: ["a", "b"],
    });
    history = {
      past: [...history.past, history.present],
      present: afterDelete,
      future: [],
      dragStart: null,
    };
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["c"]);

    history = undoOpen3dAction(history);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("updateOpen3dProject + delete + undo restores same furniture id and pose", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 420, y: 880 }, {
      idFactory: ids("pose-keep"),
    }));
    project = stampFurniture(project, "pose-keep", {
      rotation: 45,
      width: 800,
      depth: 400,
    });

    const before = activeFurniture(project).find((f) => f.id === "pose-keep");
    expect(before).toBeDefined();
    const expectedPose = poseSnapshot(before!);

    let history = createOpen3dHistory(project);
    history = updateOpen3dProject(history, (current) =>
      applySelectionDelete(current, {
        type: "furniture",
        ids: ["pose-keep"],
      }),
    );

    expect(history.past).toHaveLength(1);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual([]);

    history = undoOpen3dAction(history);
    const restored = activeFurniture(history.present).find((f) => f.id === "pose-keep");
    expect(restored).toBeDefined();
    expect(poseSnapshot(restored!)).toEqual(expectedPose);
  });

  it("multi-id delete via updateOpen3dProject pushes exactly one past entry", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 100 }, {
      idFactory: ids("m1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 200, y: 100 }, {
      idFactory: ids("m2"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 300, y: 100 }, {
      idFactory: ids("m3"),
    }));

    const posesBefore = activeFurniture(project).map(poseSnapshot);

    let history = createOpen3dHistory(project);
    history = updateOpen3dProject(history, (current) =>
      applySelectionDelete(current, {
        type: "furniture",
        ids: ["m1", "m2"],
      }),
    );

    expect(history.past).toHaveLength(1);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["m3"]);

    history = undoOpen3dAction(history);
    expect(activeFurniture(history.present).map(poseSnapshot)).toEqual(posesBefore);
  });

  it("updateOpen3dProject is a no-op when delete does not change membership", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("keep"),
    }));
    const history = createOpen3dHistory(project);
    const next = updateOpen3dProject(history, (current) =>
      applySelectionDelete(current, { type: "furniture", ids: ["missing"] }),
    );
    expect(next).toBe(history);
  });

  it("updateOpen3dProject stamps updatedAt when updater leaves it unchanged", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("stamp"),
    }));
    const history = createOpen3dHistory(project);
    const stampedAt = "2026-07-10T12:00:00.000Z";
    const next = updateOpen3dProject(
      history,
      (current) =>
        applySelectionDelete(current, { type: "furniture", ids: ["stamp"] }),
      stampedAt,
    );
    expect(next.present.updatedAt).toBe(stampedAt);
    expect(next.present.updatedAt).not.toBe(history.present.updatedAt);
  });

  it("updateOpen3dProject keeps updater-provided updatedAt when already changed", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("pre"),
    }));
    const history = createOpen3dHistory(project);
    const custom = "2026-01-01T00:00:00.000Z";
    const next = updateOpen3dProject(history, (current) => {
      const deleted = applySelectionDelete(current, {
        type: "furniture",
        ids: ["pre"],
      });
      return { ...deleted, updatedAt: custom };
    }, "ignored-now");
    expect(next.present.updatedAt).toBe(custom);
  });

  it("returns same reference when ids do not match any furniture", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("furn-1"),
    }));
    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["missing"],
    });
    expect(next).toBe(project);
  });

  it("deleting a wall cascades doors and windows on that wall (no orphans)", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 3000, y: 0 }, {
      idFactory: ids("wall-keep"),
    }));
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 0, y: 3000 }, {
      idFactory: ids("wall-gone"),
    }));

    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          doors: [
            {
              id: "door-gone",
              wallId: "wall-gone",
              position: 0.5,
              width: 900,
              height: 2100,
            },
            {
              id: "door-keep",
              wallId: "wall-keep",
              position: 0.4,
              width: 900,
              height: 2100,
            },
          ],
          windows: [
            {
              id: "win-gone",
              wallId: "wall-gone",
              position: 0.7,
              width: 1200,
              height: 1200,
            },
          ],
        },
      ],
    };

    const next = applySelectionDelete(project, {
      type: "wall",
      ids: ["wall-gone"],
    });
    const nextFloor = next.floors[0]!;
    expect(nextFloor.walls.map((w) => w.id)).toEqual(["wall-keep"]);
    expect(nextFloor.doors.map((d) => d.id)).toEqual(["door-keep"]);
    expect(nextFloor.windows).toEqual([]);
  });

  it("deletes door and window selection types without touching furniture", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 3000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 100 }, {
      idFactory: ids("f1"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          doors: [
            {
              id: "door-1",
              wallId: "wall-1",
              position: 0.3,
              width: 900,
              height: 2100,
            },
          ],
          windows: [
            {
              id: "win-1",
              wallId: "wall-1",
              position: 0.7,
              width: 1200,
              height: 1200,
            },
          ],
        },
      ],
    };

    const afterDoor = applySelectionDelete(project, {
      type: "door",
      ids: ["door-1"],
    });
    expect(afterDoor.floors[0]!.doors).toEqual([]);
    expect(afterDoor.floors[0]!.windows).toHaveLength(1);
    expect(activeFurniture(afterDoor).map((f) => f.id)).toEqual(["f1"]);

    const afterWin = applySelectionDelete(afterDoor, {
      type: "window",
      ids: ["win-1"],
    });
    expect(afterWin.floors[0]!.windows).toEqual([]);
    expect(activeFurniture(afterWin).map((f) => f.id)).toEqual(["f1"]);
  });

  it("deletes a room selection without cascading walls", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 2000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          rooms: [
            {
              id: "room-1",
              name: "Kitchen",
              walls: ["wall-1"],
              floorTexture: "none",
              area: 12,
            },
          ],
        },
      ],
    };
    const next = applySelectionDelete(project, {
      type: "room",
      ids: ["room-1"],
    });
    expect(next.floors[0]!.rooms).toEqual([]);
    expect(next.floors[0]!.walls.map((w) => w.id)).toEqual(["wall-1"]);
  });
});

describe("resolveSelectedEntity", () => {
  it("returns null for none / empty / unknown selection types", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const floor = activeFloor(project);
    expect(resolveSelectedEntity({ type: "none", ids: [] }, floor)).toBeNull();
    expect(resolveSelectedEntity({ type: "furniture", ids: [] }, floor)).toBeNull();
    expect(
      resolveSelectedEntity(
        { type: "measurement" as CanvasSelection["type"], ids: ["x"] },
        floor,
      ),
    ).toBeNull();
  });

  it("returns null when the entity id is not on the floor", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("furn-1"),
    }));
    expect(
      resolveSelectedEntity({ type: "furniture", ids: ["missing"] }, activeFloor(project)),
    ).toBeNull();
  });

  it("resolves wall, furniture, door, window, and room by first selected id", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 2000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 50, y: 50 }, {
      idFactory: ids("furn-1"),
    }));
    const floor = {
      ...activeFloor(project),
      doors: [
        {
          id: "door-1",
          wallId: "wall-1",
          position: 0.5,
          width: 900,
          height: 2100,
        },
      ],
      windows: [
        {
          id: "win-1",
          wallId: "wall-1",
          position: 0.2,
          width: 1000,
          height: 1000,
        },
      ],
      rooms: [
        {
          id: "room-1",
          name: "Living",
          walls: ["wall-1"],
              floorTexture: "none",
          area: 20,
        },
      ],
    };

    expect(resolveSelectedEntity({ type: "wall", ids: ["wall-1", "other"] }, floor)).toMatchObject({
      collection: "walls",
      id: "wall-1",
    });
    expect(resolveSelectedEntity({ type: "furniture", ids: ["furn-1"] }, floor)).toMatchObject({
      collection: "furniture",
      id: "furn-1",
    });
    expect(resolveSelectedEntity({ type: "door", ids: ["door-1"] }, floor)).toMatchObject({
      collection: "doors",
      id: "door-1",
    });
    expect(resolveSelectedEntity({ type: "window", ids: ["win-1"] }, floor)).toMatchObject({
      collection: "windows",
      id: "win-1",
    });
    expect(resolveSelectedEntity({ type: "room", ids: ["room-1"] }, floor)).toMatchObject({
      collection: "rooms",
      id: "room-1",
    });
  });
});

describe("updateEntityInProject", () => {
  it("returns same project when active floor is missing", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const orphaned = { ...project, activeFloorId: "gone" };
    expect(
      updateEntityInProject(orphaned, "furniture", "x", { rotation: 10 }),
    ).toBe(orphaned);
  });

  it("rejects updates to locked entities", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("locked"),
    }));
    project = stampFurniture(project, "locked", { locked: true, rotation: 0 });
    const next = updateEntityInProject(project, "furniture", "locked", { rotation: 90 });
    expect(next).toBe(project);
    expect(activeFurniture(next)[0]?.rotation).toBe(0);
  });

  it("merges updates into the matching unlocked entity", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 10, y: 20 }, {
      idFactory: ids("a"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 30, y: 40 }, {
      idFactory: ids("b"),
    }));
    const next = updateEntityInProject(project, "furniture", "a", {
      rotation: 45,
      width: 900,
    });
    expect(next).not.toBe(project);
    const a = activeFurniture(next).find((f) => f.id === "a");
    const b = activeFurniture(next).find((f) => f.id === "b");
    expect(a?.rotation).toBe(45);
    expect(a?.width).toBe(900);
    expect(b?.rotation).toBe(0);
  });

  it("returns project with unchanged membership when id is missing", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("only"),
    }));
    const next = updateEntityInProject(project, "furniture", "missing", {
      rotation: 10,
    });
    // map still runs → new project/floor references, but furniture content equal
    expect(activeFurniture(next)).toEqual(activeFurniture(project));
  });
});

describe("deleteEntityFromProject", () => {
  it("returns same project when active floor is missing", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const orphaned = { ...project, activeFloorId: "gone" };
    expect(deleteEntityFromProject(orphaned, "furniture", "x")).toBe(orphaned);
  });

  it("rejects delete of locked entities", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("locked"),
    }));
    project = stampFurniture(project, "locked", { locked: true });
    const next = deleteEntityFromProject(project, "furniture", "locked");
    expect(next).toBe(project);
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["locked"]);
  });

  it("removes a single furniture entity", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("gone"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 0 }, {
      idFactory: ids("keep"),
    }));
    const next = deleteEntityFromProject(project, "furniture", "gone");
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["keep"]);
  });

  it("cascades doors and windows when deleting a wall", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 3000, y: 0 }, {
      idFactory: ids("wall-keep"),
    }));
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 0, y: 3000 }, {
      idFactory: ids("wall-gone"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          doors: [
            {
              id: "d-gone",
              wallId: "wall-gone",
              position: 0.5,
              width: 900,
              height: 2100,
            },
            {
              id: "d-keep",
              wallId: "wall-keep",
              position: 0.5,
              width: 900,
              height: 2100,
            },
          ],
          windows: [
            {
              id: "w-gone",
              wallId: "wall-gone",
              position: 0.2,
              width: 1000,
              height: 1000,
            },
          ],
        },
      ],
    };
    const next = deleteEntityFromProject(project, "walls", "wall-gone");
    expect(next.floors[0]!.walls.map((w) => w.id)).toEqual(["wall-keep"]);
    expect(next.floors[0]!.doors.map((d) => d.id)).toEqual(["d-keep"]);
    expect(next.floors[0]!.windows).toEqual([]);
  });

  it("no-ops membership when entity id is absent", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("keep"),
    }));
    const next = deleteEntityFromProject(project, "furniture", "absent");
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["keep"]);
  });
});
