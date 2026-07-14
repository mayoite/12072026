import { describe, expect, it } from "vitest";
import type {
  CanvasDrawingState,
  CanvasStatusSnapshot,
  PlannerCanvasStageHandle,
} from "@/features/planner/canvas/canvasStageTypes";

describe("canvasStageTypes", () => {
  it("accepts status snapshot and handle shapes", () => {
    const state: CanvasDrawingState = "ready";
    const snapshot: CanvasStatusSnapshot = {
      snapKind: "none",
      activeTool: "select",
      drawingState: state,
      wallCount: 0,
      previewLengthMm: null,
      zoomPercent: 100,
      transform: { origin: { x: 0, y: 0 }, scale: 0.1 },
    };
    expect(snapshot.drawingState).toBe("ready");

    const handle: PlannerCanvasStageHandle = {
      undo: () => false,
      redo: () => false,
      cancel: () => undefined,
      commit: () => undefined,
      resetZoom: () => undefined,
      fitToView: () => undefined,
      setTool: () => undefined,
      getProject: () =>
        ({
          id: "p",
          name: "n",
          activeFloorId: "f",
          displayUnit: "mm",
          createdAt: "",
          updatedAt: "",
          floors: [],
        }) as ReturnType<PlannerCanvasStageHandle["getProject"]>,
      focusOnPoint: () => undefined,
    };
    expect(handle.undo()).toBe(false);
  });
});
