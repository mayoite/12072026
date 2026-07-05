import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  executePlannerCommand,
  type PlannerCommand,
} from "@/features/planner/open3d/lib/commands/plannerCommand";
import { useWorkspaceCanvas } from "@/features/planner/open3d/editor/useWorkspaceCanvas";
import { createOpen3dHistory } from "@/features/planner/open3d/store/history";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import type { Open3dProject } from "@/features/planner/open3d/model/types";

function projectWithFurniture(locked: boolean): Open3dProject {
  const project = createOpen3dProject({
    idFactory: (() => {
      const ids = ["floor", "project"];
      return () => ids.shift() ?? "generated";
    })(),
    now: "2026-07-05T00:00:00.000Z",
  });
  project.floors[0].furniture.push({
    id: "chair",
    catalogId: "catalog-chair",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    locked,
  });
  return project;
}

/**
 * 1A P0 wiring proof: `executePlannerCommand` is the sole document write
 * authority behind `useWorkspaceCanvas`. The strongest evidence is that the
 * locked-item gate — which lives only in the command layer — now blocks
 * mutations through the hook's `dispatch`/`updateProject` surfaces, which
 * previously called the history reducer directly and were ungated.
 */
describe("planner command wiring — document.update command branch", () => {
  it("records a functional update and reports noop for an unchanged updater", () => {
    const history = createOpen3dHistory(projectWithFurniture(false));

    const noop = executePlannerCommand(history, {
      type: "document.update",
      updater: (project) => project,
    });
    expect(noop.status).toBe("noop");
    expect(noop.history).toBe(history);

    const changed = executePlannerCommand(history, {
      type: "document.update",
      updater: (project) => ({ ...project, name: "Renamed" }),
      now: "2026-07-05T02:00:00.000Z",
    });
    expect(changed.status).toBe("applied");
    expect(changed.history.past).toHaveLength(1);
    expect(changed.history.present.name).toBe("Renamed");
    // updatedAt is stamped when the updater did not advance it.
    expect(changed.history.present.updatedAt).toBe("2026-07-05T02:00:00.000Z");
  });

  it("preserves an updater-supplied updatedAt without restamping", () => {
    const history = createOpen3dHistory(projectWithFurniture(false));
    const command: PlannerCommand = {
      type: "document.update",
      updater: (project) => ({ ...project, updatedAt: "2030-01-01T00:00:00.000Z" }),
      now: "2026-07-05T02:00:00.000Z",
    };
    const result = executePlannerCommand(history, command);
    expect(result.history.present.updatedAt).toBe("2030-01-01T00:00:00.000Z");
  });
});

describe("useWorkspaceCanvas routes every mutation through executePlannerCommand", () => {
  afterEach(() => {
    cleanup();
  });

  it("blocks dispatch mutations targeting a locked item (command-layer gate)", () => {
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: projectWithFurniture(true) }),
    );

    act(() => {
      result.current.dispatch({
        type: "update",
        collection: "furniture",
        id: "chair",
        updates: { rotation: 90 },
      });
    });

    // Rejected by the command gate → no mutation, no history entry.
    expect(result.current.activeFloor.furniture[0].rotation).toBe(0);
    expect(result.current.canUndo).toBe(false);
  });

  it("blocks a locked delete through dispatch but allows adds", () => {
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: projectWithFurniture(true) }),
    );

    act(() => {
      result.current.dispatch({ type: "delete", collection: "furniture", id: "chair" });
    });
    expect(result.current.activeFloor.furniture).toHaveLength(1);
    expect(result.current.canUndo).toBe(false);

    act(() => {
      result.current.dispatch({
        type: "add",
        collection: "walls",
        entity: {
          id: "wall-1",
          start: { x: 0, y: 0 },
          end: { x: 1000, y: 0 },
          thickness: 120,
          height: 2400,
          color: "#333",
        },
      });
    });
    expect(result.current.activeFloor.walls).toHaveLength(1);
    expect(result.current.canUndo).toBe(true);
  });

  it("routes functional updates through the command layer and records history", () => {
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: projectWithFurniture(false) }),
    );

    // No-op updater must not create a history entry.
    act(() => {
      result.current.updateProject((project) => project);
    });
    expect(result.current.canUndo).toBe(false);

    act(() => {
      result.current.updateProject((project) => ({ ...project, name: "Via Command" }));
    });
    expect(result.current.project.name).toBe("Via Command");
    expect(result.current.canUndo).toBe(true);
  });

  it("undo and redo flow through the command layer", () => {
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: projectWithFurniture(false) }),
    );

    act(() => {
      result.current.dispatch({
        type: "update",
        collection: "furniture",
        id: "chair",
        updates: { rotation: 45 },
      });
    });
    expect(result.current.activeFloor.furniture[0].rotation).toBe(45);

    act(() => {
      result.current.undo();
    });
    expect(result.current.activeFloor.furniture[0].rotation).toBe(0);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });
    expect(result.current.activeFloor.furniture[0].rotation).toBe(45);
  });

  // TDD for task 4: prove document undo excludes panels/search/loading/camera/notifications
  it("document undo/redo leaves transient non-document state (selection example; panels/search/camera/notif excluded by ownership)", () => {
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: projectWithFurniture(false) }),
    );

    act(() => {
      result.current.setSelection({ type: "furniture", ids: ["chair"] });
      result.current.dispatch({
        type: "update",
        collection: "furniture",
        id: "chair",
        updates: { rotation: 90 },
      });
    });
    expect(result.current.selection.type).toBe("furniture");
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });
    // selection (transient) is not cleared by document undo; panels/search/loading/camera/notifications live outside history
    expect(result.current.selection.type).toBe("furniture");
    expect(result.current.activeFloor.furniture[0].rotation).toBe(0);
  });

  it("replaceProject resets history and clears selection", () => {
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: projectWithFurniture(false) }),
    );

    act(() => {
      result.current.dispatch({
        type: "update",
        collection: "furniture",
        id: "chair",
        updates: { rotation: 45 },
      });
      result.current.setSelection({ type: "furniture", ids: ["chair"] });
    });
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.replaceProject(createOpen3dProject({ name: "Fresh" }));
    });
    expect(result.current.project.name).toBe("Fresh");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.selection).toEqual({ type: "none", ids: [] });
  });
});
