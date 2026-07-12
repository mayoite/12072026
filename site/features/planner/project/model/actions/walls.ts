import type { PlannerPoint, PlannerProject, PlannerWall } from "../types";
import type { PlannerIdFactory } from "../project";
import { themeColorRef } from "../../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../../shared/themeColorTokens";
import { activeFloorOrThrow } from "./projectActions";

export interface AddPlannerWallInput {
  start: PlannerPoint;
  end: PlannerPoint;
  height?: number;
  thickness?: number;
  color?: string;
}

export function addPlannerWall(
  project: PlannerProject,
  input: AddPlannerWallInput,
  idFactory: PlannerIdFactory,
  now = new Date().toISOString(),
): PlannerProject {
  const activeFloor = activeFloorOrThrow(project);
  const floorIndex = project.floors.findIndex(
    (floor) => floor.id === activeFloor.id,
  );

  const wall: PlannerWall = {
    id: idFactory(),
    start: { ...input.start },
    end: { ...input.end },
    height: input.height ?? 2700,
    thickness: input.thickness ?? 150,
    color: input.color ?? themeColorRef(PLANNER_COLOR_TOKENS.wallDefault),
  };
  const floors = project.floors.map((floor, index) =>
    index === floorIndex ? { ...floor, walls: [...floor.walls, wall] } : floor,
  );

  return { ...project, floors, updatedAt: now };
}
