import type { Open3dProject } from "../model/types";
import { exportOpen3dProjectJson, importOpen3dProjectJson } from "./projectJson";

export interface Open3dGuestLoadResult {
  project: Open3dProject | null;
  recoveredFromBackup: boolean;
  error?: string;
}

export interface Open3dGuestProjectRepository {
  load(id: string): Open3dProject | null;
  loadSafely(id: string): Open3dGuestLoadResult;
  save(project: Open3dProject): void;
  restoreBackup(id: string): Open3dProject | null;
  remove(id: string): void;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Project data is invalid.";
}

export function createOpen3dGuestProjectRepository(): Open3dGuestProjectRepository {
  const projects = new Map<string, string>();
  const backups = new Map<string, string>();

  const parse = (value: string | undefined): Open3dProject | null =>
    value === undefined ? null : importOpen3dProjectJson(value);

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
      projects.set(project.id, exportOpen3dProjectJson(project));
    },
    restoreBackup: (id) => parse(backups.get(id)),
    remove: (id) => {
      projects.delete(id);
      backups.delete(id);
    },
  };
}
