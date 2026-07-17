import type { PlannerProject } from "../model/types";
import { exportPlannerProjectJson, importPlannerProjectJson } from "./projectJson";

export interface PlannerGuestLoadResult {
  project: PlannerProject | null;
  recoveredFromBackup: boolean;
  error?: string;
}

export interface PlannerGuestProjectRepository {
  load(id: string): PlannerProject | null;
  loadSafely(id: string): PlannerGuestLoadResult;
  save(project: PlannerProject): void;
  restoreBackup(id: string): PlannerProject | null;
  remove(id: string): void;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Project data is invalid.";
}

export function createPlannerGuestProjectRepository(): PlannerGuestProjectRepository {
  const projects = new Map<string, string>();
  const backups = new Map<string, string>();

  const parse = (value: string | undefined): PlannerProject | null =>
    value === undefined ? null : importPlannerProjectJson(value);

  return {
    load: (id) => parse(projects.get(id)),
    loadSafely: (id) => {
      const primary = projects.get(id);
      if (primary === undefined) return { project: null, recoveredFromBackup: false };
      try {
        return { project: parse(primary), recoveredFromBackup: false };
      } catch (primaryError) {
        const backup = backups.get(id);
        if (backup === undefined) {
          return {
            project: null,
            recoveredFromBackup: false,
            error: errorMessage(primaryError),
          };
        }
        try {
          return {
            project: parse(backup),
            recoveredFromBackup: true,
            error: errorMessage(primaryError),
          };
        } catch {
          return {
            project: null,
            recoveredFromBackup: false,
            error: "Project and backup data are invalid.",
          };
        }
      }
    },
    save: (project) => {
      const previous = projects.get(project.id);
      if (previous !== undefined) backups.set(project.id, previous);
      projects.set(project.id, exportPlannerProjectJson(project));
    },
    restoreBackup: (id) => parse(backups.get(id)),
    remove: (id) => {
      projects.delete(id);
      backups.delete(id);
    },
  };
}
