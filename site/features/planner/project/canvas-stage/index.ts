/**
 * Live 2-D plan canvas entry — Fabric stage only.
 * Implementation: `features/planner/canvas` (PlannerFabricStage).
 */
export {
  PlannerFabricStage as PlannerCanvasStage,
  type PlannerFabricStageProps as PlannerCanvasStageProps,
} from "@/features/planner/canvas/PlannerFabricStage";

export type {
  PlannerCanvasStageHandle as PlannerCanvasStageHandle,
  CanvasStatusSnapshot,
} from "@/features/planner/canvas/canvasStageTypes";
