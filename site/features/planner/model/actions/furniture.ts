import type { PlannerFurnitureItem, PlannerProject } from "../types";
import type { PlannerIdFactory } from "../project";
import { normalizeDegrees } from "../units";
import { applyPlannerProjectAction } from "./projectActions";

export function addPlannerFurniture(
  project: PlannerProject,
  item: Omit<PlannerFurnitureItem, "id">,
  idFactory: PlannerIdFactory,
  now?: string,
): PlannerProject {
  if (!item.catalogId.trim()) throw new Error("Furniture catalog id is required.");
  if (item.scale.x <= 0 || item.scale.y <= 0 || item.scale.z <= 0) {
    throw new Error("Furniture scale must be positive.");
  }
  return applyPlannerProjectAction(project, {
    type: "add",
    collection: "furniture",
    entity: { ...item, id: idFactory(), rotation: normalizeDegrees(item.rotation) },
  }, now);
}

export function rotatePlannerFurniture(
  project: PlannerProject,
  id: string,
  rotation: number,
  now?: string,
): PlannerProject {
  return applyPlannerProjectAction(project, {
    type: "update",
    collection: "furniture",
    id,
    updates: { rotation: normalizeDegrees(rotation) },
  }, now);
}
