import type { ValidationIssue, PlacedFurniture } from "./types";
import { detectFurnitureOverlaps } from "./furnitureOverlap";
import {
  detectFurnitureOutsideRoom,
  floorRoomPolygons,
} from "./furnitureRoomBoundary";
import { detectFurnitureClearance } from "./furnitureClearance";
import { detectFurnitureWallCollisions } from "./furnitureWallCollision";
import { detectOpeningClearanceConflicts } from "./openingClearance";
import type { PlannerFloor, PlannerFurnitureItem } from "@/features/planner/model/types";

function toPlacedFurniture(item: PlannerFurnitureItem): PlacedFurniture {
  return {
    id: item.id,
    xMm: item.position.x,
    yMm: item.position.y,
    widthMm: item.width ?? 600,
    depthMm: item.depth ?? 600,
    rotationDeg: item.rotation,
  };
}

export type ValidationResult = {
  issues: ValidationIssue[];
  errors: number;
  warnings: number;
  advisories: number;
};

export function countBySeverity(issues: readonly ValidationIssue[]): {
  errors: number;
  warnings: number;
  advisories: number;
} {
  let errors = 0;
  let warnings = 0;
  let advisories = 0;
  for (const issue of issues) {
    if (issue.severity === "error") errors += 1;
    else if (issue.severity === "warning") warnings += 1;
    else if (issue.severity === "advisory") advisories += 1;
  }
  return { errors, warnings, advisories };
}

/**
 * Live floor validation for Review + ValidationPanel.
 * Rules: furniture-overlap (error), wall-collision (error), room-boundary
 * (error/warning), aisle-clearance (warning), opening-obstruction (warning).
 */
export function runFloorValidation(floor: PlannerFloor): ValidationResult {
  const furnitureList: PlacedFurniture[] = [];
  for (const item of floor.furniture) {
    if (item.catalogId && item.catalogId !== "unknown") {
      furnitureList.push(toPlacedFurniture(item));
    }
  }

  const roomPolygons = floorRoomPolygons(floor);

  const issues: ValidationIssue[] = [
    ...detectFurnitureOverlaps(furnitureList),
    ...detectFurnitureWallCollisions(furnitureList, floor.walls),
    ...detectFurnitureOutsideRoom(furnitureList, roomPolygons),
    ...detectFurnitureClearance(furnitureList),
    ...detectOpeningClearanceConflicts(
      furnitureList,
      floor.walls,
      floor.doors,
      floor.windows,
    ),
  ];

  // Deterministic order for UI stability: errors first, then warnings, then id.
  issues.sort((a, b) => {
    const severityRank = (s: ValidationIssue["severity"]) =>
      s === "error" ? 0 : s === "warning" ? 1 : 2;
    const bySeverity = severityRank(a.severity) - severityRank(b.severity);
    if (bySeverity !== 0) return bySeverity;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  return {
    issues,
    ...countBySeverity(issues),
  };
}
