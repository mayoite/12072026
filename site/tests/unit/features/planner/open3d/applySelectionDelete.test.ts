import { describe, expect, it } from "vitest";

import { applySelectionDelete } from "@/features/planner/open3d/editor/workspaceEntityHelpers";
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

function activeFurniture(project: Open3dProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) throw new Error("no active floor");
  return floor.furniture;
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

    // Stamp openings on both walls (document fields only — pure path).
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
});
