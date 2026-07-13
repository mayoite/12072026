import type {
  ValidationIssue,
  PlacedFurniture,
} from "./types";
import { detectFurnitureOverlaps } from "./furnitureOverlap";
import type { PlannerFloor, PlannerFurnitureItem } from "@/features/planner/project/model/types";

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

export function runFloorValidation(floor: PlannerFloor): ValidationResult {
  const furnitureList: PlacedFurniture[] = [];
  for (const item of floor.furniture) {
    if (item.catalogId && item.catalogId !== "unknown") {
      furnitureList.push(toPlacedFurniture(item));
    }
  }

  const issues: ValidationIssue[] = [
    ...detectFurnitureOverlaps(furnitureList),
  ];

  return {
    issues,
    ...countBySeverity(issues),
  };
}
