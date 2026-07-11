/**
 * Live 2-D plan canvas entry — Fabric stage only.
 * Implementation lives outside open3d: `features/planner/canvas-fabric-stage`.
 */
export {
  Open3dFabricStage as PlannerCanvasStage,
  type Open3dFabricStageProps as PlannerCanvasStageProps,
} from "@/features/planner/canvas-fabric-stage/Open3dFabricStage";

export type {
  Open3dCanvasStageHandle as PlannerCanvasStageHandle,
  CanvasStatusSnapshot,
} from "@/features/planner/canvas-fabric-stage/canvasStageTypes";
