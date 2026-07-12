import type { PlannerFloor, PlannerProject, PlannerWall } from "./types";

export interface PlannerInvariantIssue {
  code: "missing-active-floor" | "duplicate-id" | "invalid-dimension" | "missing-wall";
  path: string;
  message: string;
}

function hasPositiveDimensions(wall: PlannerWall): boolean {
  return wall.height > 0 && wall.thickness > 0 && (
    wall.start.x !== wall.end.x || wall.start.y !== wall.end.y
  );
}

function inspectFloor(floor: PlannerFloor, floorIndex: number): PlannerInvariantIssue[] {
  const issues: PlannerInvariantIssue[] = [];
  const ids = new Set<string>();
  const collections = [
    floor.walls, floor.rooms, floor.doors, floor.windows, floor.furniture,
    floor.stairs, floor.columns, floor.guides, floor.measurements,
    floor.annotations, floor.textAnnotations, floor.groups,
  ];
  for (const collection of collections) {
    for (const entity of collection) {
      if (ids.has(entity.id)) {
        issues.push({
          code: "duplicate-id",
          path: `floors[${floorIndex}]`,
          message: `Entity id "${entity.id}" is duplicated on the floor.`,
        });
      }
      ids.add(entity.id);
    }
  }
  floor.walls.forEach((wall, wallIndex) => {
    if (!hasPositiveDimensions(wall)) {
      issues.push({
        code: "invalid-dimension",
        path: `floors[${floorIndex}].walls[${wallIndex}]`,
        message: "Wall must have positive dimensions and distinct endpoints.",
      });
    }
  });
  [...floor.doors, ...floor.windows].forEach((opening, openingIndex) => {
    if (!floor.walls.some((wall) => wall.id === opening.wallId)) {
      issues.push({
        code: "missing-wall",
        path: `floors[${floorIndex}].openings[${openingIndex}]`,
        message: `Opening references missing wall "${opening.wallId}".`,
      });
    }
  });
  return issues;
}

export function inspectPlannerProject(project: PlannerProject): PlannerInvariantIssue[] {
  const issues = project.floors.flatMap(inspectFloor);
  if (!project.floors.some((floor) => floor.id === project.activeFloorId)) {
    issues.unshift({
      code: "missing-active-floor",
      path: "activeFloorId",
      message: "Active floor must reference a floor in the project.",
    });
  }
  return issues;
}

export function assertPlannerProject(project: PlannerProject): void {
  const issue = inspectPlannerProject(project)[0];
  if (issue) throw new Error(`${issue.path}: ${issue.message}`);
}
