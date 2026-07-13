import type { PlannerTool } from "@/features/planner/editor/canvasTool";
import type { CanvasTransform, SnapKind } from "@/features/planner/project/lib/geometry/snapping";
import type { PlannerProject } from "@/features/planner/project/model/types";

export type CanvasDrawingState = "ready" | "drawing" | "panning";

/** Live viewport snapshot from PlannerCanvasStage (2-D plan canvas). */
export interface CanvasStatusSnapshot {
  snapKind: SnapKind;
  activeTool: PlannerTool;
  drawingState: CanvasDrawingState;
  wallCount: number;
  previewLengthMm: number | null;
  zoomPercent: number;
  transform: CanvasTransform;
}

/** Imperative handle for workspace chrome (zoom, undo, tool arm). */
export interface PlannerCanvasStageHandle {
  undo: () => boolean;
  redo: () => boolean;
  cancel: () => void;
  commit: () => void;
  resetZoom: () => void;
  fitToView: () => void;
  setTool: (tool: PlannerTool) => void;
  getProject: () => PlannerProject;
  /** Pan the viewport so that project-space point is centered at current zoom. */
  focusOnPoint: (xMm: number, yMm: number) => void;
}
