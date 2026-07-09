import { describe, expect, it } from "vitest";

import { applySelectionDelete } from "@/features/planner/open3d/editor/workspaceEntityHelpers";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import {
  addFurniture,
  addWall,
} from "@/features/planner/open3d/model/operations/pureActions";
import type { Open3dProject } from "@/features/planner/open3d/model/types";
import {
  createOpen3dHistory,
  undoOpen3dAction,
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

describe("applySelectionDelete (W3 pure)", () => {
  it("returns same project reference when selection is none", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const next = applySelectionDelete(project, { type: "none", ids: [] });
    expect(next).toBe(project);
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
