import type { Open3dFloor, Open3dProject, Open3dWall } from "./types";

export interface Open3dInvariantIssue {
  code: "missing-active-floor" | "duplicate-id" | "invalid-dimension" | "missing-wall";
  path: string;
  message: string;
}

function hasPositiveDimensions(wall: Open3dWall): boolean {
  return wall.height > 0 && wall.thickness > 0 && (
    wall.start.x !== wall.end.x || wall.start.y !== wall.end.y
  );
}

function inspectFloor(floor: Open3dFloor, floorIndex: number): Open3dInvariantIssue[] {
  const issues: Open3dInvariantIssue[] = [];
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

export function inspectOpen3dProject(project: Open3dProject): Open3dInvariantIssue[] {
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

export function assertOpen3dProject(project: Open3dProject): void {
  const issue = inspectOpen3dProject(project)[0];
  if (issue) throw new Error(`${issue.path}: ${issue.message}`);
}
