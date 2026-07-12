import type { PlannerProject } from "../model/types";
import { importPlannerProjectJson } from "./projectJson";

export const PLANNER_SESSION_VERSION = "open3d-1" as const;

export type PlannerSessionEnvelope = {
  version: typeof PLANNER_SESSION_VERSION;
  engine: "open3d";
  project: PlannerProject;
  updatedAt: string;
};

export function buildPlannerSessionEnvelope(project: PlannerProject): PlannerSessionEnvelope {
  return {
    version: PLANNER_SESSION_VERSION,
    engine: "open3d",
    project,
    updatedAt: new Date().toISOString(),
  };
}

export function parsePlannerSessionSnapshot(raw: string): PlannerProject | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

    if (parsed.version === PLANNER_SESSION_VERSION && parsed.engine === "open3d" && parsed.project) {
      return importPlannerProjectJson(JSON.stringify(parsed.project));
    }

    // Legacy: raw PlannerProject JSON in snapshot slot
    return importPlannerProjectJson(raw);
  } catch {
    return null;
  }
}
