import { describe, expect, it } from "vitest";

import {
  applySelectionDelete,
  deleteEntityFromProject,
  resolveSelectedEntity,
  selectionAfterBatchPlace,
  updateEntityInProject,
} from "@/features/planner/editor/workspaceEntityHelpers";
import type { CanvasSelection } from "@/features/planner/editor/useWorkspaceCanvas";
import { createPlannerProject } from "@/features/planner/project/model/project";
import {
  addFurniture,
  addWall,
} from "@/features/planner/project/model/operations/pureActions";
import type { PlannerFurnitureItem, PlannerProject } from "@/features/planner/project/model/types";
import {
  createPlannerHistory,
  undoPlannerAction,
  updatePlannerProject,
} from "@/features/planner/project/store/history";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFloor(project: PlannerProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) throw new Error("no active floor");
  return floor;
}

function activeFurniture(project: PlannerProject) {
  return activeFloor(project).furniture;
}

function stampFurniture(
  project: PlannerProject,
  id: string,
  patch: Partial<PlannerFurnitureItem>,
): PlannerProject {
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

function poseSnapshot(item: PlannerFurnitureItem) {
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
    const project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const next = applySelectionDelete(project, { type: "none", ids: [] });
    expect(next).toBe(project);
  });

  it("returns same project reference when furniture selection has empty ids", () => {
    let project = createPlannerProject({
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

  it("empty ids is a no-op for every selectable type (wall/door/window/room)", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 2000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("furn-1"),
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
          rooms: [
            {
              id: "room-1",
              name: "Kitchen",
              walls: ["wall-1"],
              floorTexture: "none",
              area: 10,
            },
          ],
        },
      ],
    };

    for (const type of ["wall", "door", "window", "room"] as const) {
      const next = applySelectionDelete(project, { type, ids: [] });
      expect(next).toBe(project);
    }
    expect(project.floors[0]!.walls).toHaveLength(1);
    expect(project.floors[0]!.doors).toHaveLength(1);
    expect(project.floors[0]!.windows).toHaveLength(1);
    expect(project.floors[0]!.rooms).toHaveLength(1);
    expect(activeFurniture(project).map((f) => f.id)).toEqual(["furn-1"]);
  });

  it("removes one furniture id and keeps other entities", () => {
    let project = createPlannerProject({
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

  it("furniture delete does not cascade walls, doors, or windows", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 3000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 100 }, {
      idFactory: ids("furn-gone"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 400, y: 100 }, {
      idFactory: ids("furn-keep"),
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
              position: 0.4,
              width: 900,
              height: 2100,
            },
          ],
          windows: [
            {
              id: "win-1",
              wallId: "wall-1",
              position: 0.8,
              width: 1200,
              height: 1200,
            },
          ],
        },
      ],
    };

    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["furn-gone"],
    });
    const nextFloor = next.floors[0]!;
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["furn-keep"]);
    expect(nextFloor.walls.map((w) => w.id)).toEqual(["wall-1"]);
    expect(nextFloor.doors.map((d) => d.id)).toEqual(["door-1"]);
    expect(nextFloor.windows.map((w) => w.id)).toEqual(["win-1"]);
  });

  it("skips locked furniture and returns same project reference", () => {
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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

    let history = createPlannerHistory(project);
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

    history = undoPlannerAction(history);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  /**
   * Contract doc: N selected furniture ids → N removals (unlocked).
   * Product path must NOT multi-select after batch place (see selectionAfterBatchPlace).
   */
  it("when selection has N furniture ids, applySelectionDelete removes all N", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const placed = ["seat-1", "seat-2", "seat-3"] as const;
    for (const id of placed) {
      ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
        idFactory: ids(id),
      }));
    }
    expect(activeFurniture(project)).toHaveLength(3);

    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: [...placed],
    });
    expect(activeFurniture(next)).toHaveLength(0);
    expect(activeFurniture(next).map((f) => f.id)).toEqual([]);
  });

  it("updatePlannerProject + delete + undo restores same furniture id and pose", () => {
    let project = createPlannerProject({
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

    let history = createPlannerHistory(project);
    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, {
        type: "furniture",
        ids: ["pose-keep"],
      }),
    );

    expect(history.past).toHaveLength(1);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual([]);

    history = undoPlannerAction(history);
    const restored = activeFurniture(history.present).find((f) => f.id === "pose-keep");
    expect(restored).toBeDefined();
    expect(poseSnapshot(restored!)).toEqual(expectedPose);
  });

  it("multi-id delete via updatePlannerProject pushes exactly one past entry", () => {
    let project = createPlannerProject({
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

    let history = createPlannerHistory(project);
    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, {
        type: "furniture",
        ids: ["m1", "m2"],
      }),
    );

    expect(history.past).toHaveLength(1);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["m3"]);

    history = undoPlannerAction(history);
    expect(activeFurniture(history.present).map(poseSnapshot)).toEqual(posesBefore);
  });

  it("updatePlannerProject is a no-op when delete does not change membership", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("keep"),
    }));
    const history = createPlannerHistory(project);
    const next = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, { type: "furniture", ids: ["missing"] }),
    );
    expect(next).toBe(history);
  });

  it("updatePlannerProject stamps updatedAt when updater leaves it unchanged", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("stamp"),
    }));
    const history = createPlannerHistory(project);
    const stampedAt = "2026-07-10T12:00:00.000Z";
    const next = updatePlannerProject(
      history,
      (current) =>
        applySelectionDelete(current, { type: "furniture", ids: ["stamp"] }),
      stampedAt,
    );
    expect(next.present.updatedAt).toBe(stampedAt);
    expect(next.present.updatedAt).not.toBe(history.present.updatedAt);
  });

  it("updatePlannerProject keeps updater-provided updatedAt when already changed", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("pre"),
    }));
    const history = createPlannerHistory(project);
    const custom = "2026-01-01T00:00:00.000Z";
    const next = updatePlannerProject(history, (current) => {
      const deleted = applySelectionDelete(current, {
        type: "furniture",
        ids: ["pre"],
      });
      return { ...deleted, updatedAt: custom };
    }, "ignored-now");
    expect(next.present.updatedAt).toBe(custom);
  });

  it("returns same reference when ids do not match any furniture", () => {
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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

  it("multi-id wall delete cascades doors/windows for every removed wall in one revision", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 3000, y: 0 }, {
      idFactory: ids("wall-a"),
    }));
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 0, y: 3000 }, {
      idFactory: ids("wall-b"),
    }));
    ({ project } = addWall(project, { x: 3000, y: 0 }, { x: 3000, y: 3000 }, {
      idFactory: ids("wall-keep"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 500, y: 500 }, {
      idFactory: ids("furn-keep"),
    }));

    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          doors: [
            {
              id: "door-a",
              wallId: "wall-a",
              position: 0.5,
              width: 900,
              height: 2100,
            },
            {
              id: "door-b",
              wallId: "wall-b",
              position: 0.5,
              width: 900,
              height: 2100,
            },
            {
              id: "door-keep",
              wallId: "wall-keep",
              position: 0.5,
              width: 900,
              height: 2100,
            },
          ],
          windows: [
            {
              id: "win-a",
              wallId: "wall-a",
              position: 0.2,
              width: 1000,
              height: 1000,
            },
            {
              id: "win-keep",
              wallId: "wall-keep",
              position: 0.8,
              width: 1000,
              height: 1000,
            },
          ],
        },
      ],
    };

    let history = createPlannerHistory(project);
    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, {
        type: "wall",
        ids: ["wall-a", "wall-b", "missing-wall"],
      }),
    );

    // Exactly one history step for multi-id wall delete (incl. absent id).
    expect(history.past).toHaveLength(1);

    const nextFloor = history.present.floors[0]!;
    expect(nextFloor.walls.map((w) => w.id)).toEqual(["wall-keep"]);
    expect(nextFloor.doors.map((d) => d.id)).toEqual(["door-keep"]);
    expect(nextFloor.windows.map((w) => w.id)).toEqual(["win-keep"]);
    // Furniture is independent of wall cascade.
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["furn-keep"]);

    history = undoPlannerAction(history);
    const restored = history.present.floors[0]!;
    expect(restored.walls.map((w) => w.id).sort()).toEqual([
      "wall-a",
      "wall-b",
      "wall-keep",
    ]);
    expect(restored.doors.map((d) => d.id).sort()).toEqual([
      "door-a",
      "door-b",
      "door-keep",
    ]);
    expect(restored.windows.map((w) => w.id).sort()).toEqual(["win-a", "win-keep"]);
  });

  it("multi-id furniture selection drops only matching present ids (partial miss ok)", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("keep"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 0 }, {
      idFactory: ids("gone-1"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 200, y: 0 }, {
      idFactory: ids("gone-2"),
    }));

    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["gone-1", "absent", "gone-2"],
    });
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["keep"]);
  });

  it("deletes door and window selection types without touching furniture", () => {
    let project = createPlannerProject({
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

  it("multi-id door and multi-id window delete in one revision each", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addWall(project, { x: 0, y: 0 }, { x: 4000, y: 0 }, {
      idFactory: ids("wall-1"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          doors: [
            {
              id: "d1",
              wallId: "wall-1",
              position: 0.2,
              width: 900,
              height: 2100,
            },
            {
              id: "d2",
              wallId: "wall-1",
              position: 0.5,
              width: 900,
              height: 2100,
            },
            {
              id: "d-keep",
              wallId: "wall-1",
              position: 0.8,
              width: 900,
              height: 2100,
            },
          ],
          windows: [
            {
              id: "w1",
              wallId: "wall-1",
              position: 0.15,
              width: 1000,
              height: 1000,
            },
            {
              id: "w2",
              wallId: "wall-1",
              position: 0.55,
              width: 1000,
              height: 1000,
            },
            {
              id: "w-keep",
              wallId: "wall-1",
              position: 0.9,
              width: 1000,
              height: 1000,
            },
          ],
        },
      ],
    };

    const afterDoors = applySelectionDelete(project, {
      type: "door",
      ids: ["d1", "d2"],
    });
    expect(afterDoors.floors[0]!.doors.map((d) => d.id)).toEqual(["d-keep"]);
    expect(afterDoors.floors[0]!.windows).toHaveLength(3);
    expect(afterDoors.floors[0]!.walls.map((w) => w.id)).toEqual(["wall-1"]);

    const afterWins = applySelectionDelete(afterDoors, {
      type: "window",
      ids: ["w1", "w2"],
    });
    expect(afterWins.floors[0]!.windows.map((w) => w.id)).toEqual(["w-keep"]);
    expect(afterWins.floors[0]!.doors.map((d) => d.id)).toEqual(["d-keep"]);
  });

  it("deletes a room selection without cascading walls", () => {
    let project = createPlannerProject({
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

/**
 * Workspace batch place (OOPlannerWorkspace handleWorkstationConfigBatchPlace)
 * must call this so Delete after Place N seats removes one seat, not N.
 */
describe("selectionAfterBatchPlace (W3 batch-place contract)", () => {
  it("returns none when no ids were placed", () => {
    expect(selectionAfterBatchPlace([])).toEqual({ type: "none", ids: [] });
  });

  it("selects the single placed id as furniture", () => {
    expect(selectionAfterBatchPlace(["only"])).toEqual({
      type: "furniture",
      ids: ["only"],
    });
  });

  it("keeps only the last placed id when batch place returns N ids", () => {
    const placed = ["ws-1", "ws-2", "ws-3"];
    expect(selectionAfterBatchPlace(placed)).toEqual({
      type: "furniture",
      ids: ["ws-3"],
    });
    // Never multi-select the whole batch (anti-regression for e2e wipe).
    expect(selectionAfterBatchPlace(placed).ids).toHaveLength(1);
    // Strict last-id only: first / middle never appear in selection.ids.
    expect(selectionAfterBatchPlace(placed).ids).not.toContain("ws-1");
    expect(selectionAfterBatchPlace(placed).ids).not.toContain("ws-2");
  });

  it("returns none when last id is empty (still never multi-selects prior ids)", () => {
    expect(selectionAfterBatchPlace([""])).toEqual({ type: "none", ids: [] });
    expect(selectionAfterBatchPlace(["peer-a", "peer-b", ""])).toEqual({
      type: "none",
      ids: [],
    });
  });

  it("composed: batch selection + Delete removes one of N; peers stay", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const placed = ["batch-a", "batch-b", "batch-c"] as const;
    for (const [i, id] of placed.entries()) {
      ({ project } = addFurniture(
        project,
        "cabinet-v0",
        { x: i * 100, y: 0 },
        { idFactory: ids(id) },
      ));
    }

    const selection = selectionAfterBatchPlace([...placed]);
    expect(selection).toEqual({ type: "furniture", ids: ["batch-c"] });

    const next = applySelectionDelete(project, selection);
    expect(activeFurniture(next).map((f) => f.id).sort()).toEqual([
      "batch-a",
      "batch-b",
    ]);

    // Contrast: selecting all N would wipe the batch (the known e2e bug path).
    const wiped = applySelectionDelete(project, {
      type: "furniture",
      ids: [...placed],
    });
    expect(activeFurniture(wiped)).toHaveLength(0);
  });

  it("composed: single-id delete + undo restores same id and pose", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 10, y: 20 }, {
      idFactory: ids("peer"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 700, y: 900 }, {
      idFactory: ids("last-seat"),
    }));
    project = stampFurniture(project, "last-seat", {
      rotation: 90,
      width: 1200,
      depth: 600,
    });

    const before = activeFurniture(project).find((f) => f.id === "last-seat");
    expect(before).toBeDefined();
    const expectedPose = poseSnapshot(before!);

    const selection = selectionAfterBatchPlace(["peer", "last-seat"]);
    let history = createPlannerHistory(project);
    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, selection),
    );
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["peer"]);

    history = undoPlannerAction(history);
    const restored = activeFurniture(history.present).find(
      (f) => f.id === "last-seat",
    );
    expect(restored).toBeDefined();
    expect(poseSnapshot(restored!)).toEqual(expectedPose);
  });
});

describe("resolveSelectedEntity", () => {
  it("returns null for none / empty / unknown selection types", () => {
    const project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    const project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const orphaned = { ...project, activeFloorId: "gone" };
    expect(
      updateEntityInProject(orphaned, "furniture", "x", { rotation: 10 }),
    ).toBe(orphaned);
  });

  it("rejects updates to locked entities", () => {
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    const project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const orphaned = { ...project, activeFloorId: "gone" };
    expect(deleteEntityFromProject(orphaned, "furniture", "x")).toBe(orphaned);
  });

  it("rejects delete of locked entities", () => {
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
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
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("keep"),
    }));
    const next = deleteEntityFromProject(project, "furniture", "absent");
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["keep"]);
  });
});
