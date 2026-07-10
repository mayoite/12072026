/**
 * Live 2-D plan canvas (native HTML canvas + Block2D).
 * Promoted from `_archive/canvas-feasibility` — procedural geometry only.
 */
export {
  FeasibilityCanvas as PlannerCanvasStage,
  type FeasibilityCanvasHandle as PlannerCanvasStageHandle,
  type FeasibilityCanvasProps as PlannerCanvasStageProps,
} from "@/features/planner/_archive/canvas-feasibility/FeasibilityCanvas";

export type { CanvasStatusSnapshot } from "@/features/planner/open3d/canvas-fabric-stage/canvasStageTypes";
