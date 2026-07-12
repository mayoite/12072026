import { canvasUnitsToMillimeters } from "@/features/planner/lib/canvasBounds";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";
import { placeCatalogItemInProject } from "@/features/planner/project/catalog/placementAction";
import {
  addRectangularRoom,
  addWall,
} from "@/features/planner/project/model/operations/pureActions";
import type { PlannerProject } from "@/features/planner/project/model/types";

import { validateLayoutSchema } from "./aiStatus";
import type { SuggestedLayoutJson } from "./types";

export function applyLayoutToWorkspace(
  project: PlannerProject,
  layout: SuggestedLayoutJson,
  resolveCatalogItem: (id: string) => PlannerCatalogItem | undefined,
): PlannerProject {
  if (!validateLayoutSchema(layout)) {
    console.error("[applyLayoutToWorkspace] Schema validation failed for layout:", layout);
    return project;
  }

  let next = project;

  if (layout.walls.length === 0 && layout.room) {
    const start = {
      x: canvasUnitsToMillimeters(layout.room.x),
      y: canvasUnitsToMillimeters(layout.room.y),
    };
    const end = {
      x: start.x + layout.room.widthMm,
      y: start.y + layout.room.depthMm,
    };
    next = addRectangularRoom(next, start, end, { name: layout.room.label }).project;
  }

  for (const wall of layout.walls) {
    const start = {
      x: canvasUnitsToMillimeters(wall.x),
      y: canvasUnitsToMillimeters(wall.y),
    };
    const end = {
      x: canvasUnitsToMillimeters(wall.x + wall.endX),
      y: canvasUnitsToMillimeters(wall.y + wall.endY),
    };
    next = addWall(next, start, end).project;
  }

  for (const item of layout.furniture) {
    const catalogItem = resolveCatalogItem(item.catalogItemId);
    if (!catalogItem) continue;

    const position = {
      x: canvasUnitsToMillimeters(item.x),
      y: canvasUnitsToMillimeters(item.y),
    };
    const placed = placeCatalogItemInProject(next, catalogItem, null, {
      placedFrom: "api",
      position,
      rotation: item.rotation ?? 0,
    });
    next = placed.result.project;
  }

  return next;
}
