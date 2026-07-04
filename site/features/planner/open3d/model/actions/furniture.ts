import type { Open3dFurnitureItem, Open3dProject } from "../types";
import type { Open3dIdFactory } from "../project";
import { normalizeDegrees } from "../units";
import { applyOpen3dProjectAction } from "./projectActions";

export function addOpen3dFurniture(
  project: Open3dProject,
  item: Omit<Open3dFurnitureItem, "id">,
  idFactory: Open3dIdFactory,
  now?: string,
): Open3dProject {
  if (!item.catalogId.trim()) throw new Error("Furniture catalog id is required.");
  if (item.scale.x <= 0 || item.scale.y <= 0 || item.scale.z <= 0) {
    throw new Error("Furniture scale must be positive.");
  }
  return applyOpen3dProjectAction(project, {
    type: "add",
    collection: "furniture",
    entity: { ...item, id: idFactory(), rotation: normalizeDegrees(item.rotation) },
  }, now);
}

export function rotateOpen3dFurniture(
  project: Open3dProject,
  id: string,
  rotation: number,
  now?: string,
): Open3dProject {
  return applyOpen3dProjectAction(project, {
    type: "update",
    collection: "furniture",
    id,
    updates: { rotation: normalizeDegrees(rotation) },
  }, now);
}
