import { describe, expect, it, afterEach } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import {
  useWorkspaceCanvas,
  useCanvasDrawing,
} from "@/features/planner/editor/useWorkspaceCanvas";
import type { PlannerWall } from "@/features/planner/model/types";

afterEach(() => cleanup());

describe("useWorkspaceCanvas", () => {
  it("creates a project and supports undo after wall add", () => {
    const { result } = renderHook(() => useWorkspaceCanvas({ projectName: "Canvas Test" }));
    expect(result.current.project.name).toBe("Canvas Test");
    expect(result.current.canUndo).toBe(false);

    const wall: PlannerWall = {
      id: "wall-test",
      start: { x: 0, y: 0 },
      end: { x: 2000, y: 0 },
      thickness: 120,
      height: 2400,
    };

    act(() => {
      result.current.dispatch({ type: "add", collection: "walls", entity: wall });
    });
    expect(result.current.activeFloor.walls).toHaveLength(1);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.activeFloor.walls).toHaveLength(0);
  });
});

describe("useCanvasDrawing", () => {
  it("exposes drawing lifecycle methods", () => {
    const { result } = renderHook(() => useCanvasDrawing());
    expect(typeof result.current.startDrawing).toBe("function");
    expect(typeof result.current.commitDrawing).toBe("function");
    expect(typeof result.current.updateDrawing).toBe("function");
  });
});
