import { addPlannerWall } from "@/features/planner/model/actions/walls";
import type { PlannerIdFactory } from "@/features/planner/model/project";
import type { PlannerProject } from "@/features/planner/model/types";

export type SketchWallLike = {
  type: "wall";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/**
 * Apply Sketch-to-Plan wall objects as one document mutation.
 * Callers should wrap this in a single history update so Accept is undoable.
 */
export function applySketchWallObjects(
  project: PlannerProject,
  objects: readonly SketchWallLike[],
  idFactory: PlannerIdFactory,
  now = new Date().toISOString(),
): PlannerProject {
  let next = project;
  for (const object of objects) {
    if (object.type !== "wall") continue;
    next = addPlannerWall(
      next,
      {
        start: { x: object.x1, y: object.y1 },
        end: { x: object.x2, y: object.y2 },
      },
      idFactory,
      now,
    );
  }
  return next;
}
