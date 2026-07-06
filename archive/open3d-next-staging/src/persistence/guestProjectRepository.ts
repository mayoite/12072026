import type { Open3dProject } from "../model/types";
import {
  exportOpen3dProjectJson,
  importOpen3dProjectJson,
} from "./projectJson";

export interface Open3dGuestLoadResult {
  project: Open3dProject | null;
  recoveredFromBackup: boolean;
  error?: string;
}

export interface Open3dGuestProjectRepository {
  load(projectId: string): Open3dProject | null;
  loadSafely(projectId: string): Open3dGuestLoadResult;
  save(project: Open3dProject): void;
  restoreBackup(projectId: string): Open3dProject | null;
  remove(projectId: string): void;
}

/**
 * In-memory guest repository.
 *
 * Phase 04 forbids guest local saves, IndexedDB writes, browser cache, and
 * downloads. This repository intentionally stores only inside the current
 * JavaScript object lifetime. Creating a new repository loses guest work.
 */
export function createOpen3dGuestProjectRepository(): Open3dGuestProjectRepository {
  const current = new Map<string, string>();
  const backups = new Map<string, string>();

  return {
    load(projectId) {
      const json = current.get(projectId);
      return json ? importOpen3dProjectJson(json) : null;
    },
    loadSafely(projectId) {
      const json = current.get(projectId);
      if (!json) return { project: null, recoveredFromBackup: false };
      try {
        return { project: importOpen3dProjectJson(json), recoveredFromBackup: false };
      } catch (error: unknown) {
        const backup = backups.get(projectId);
        if (!backup) {
          return {
            project: null,
            recoveredFromBackup: false,
            error: error instanceof Error ? error.message : "Project data is invalid.",
          };
        }
        try {
          return {
            project: importOpen3dProjectJson(backup),
            recoveredFromBackup: true,
            error: error instanceof Error ? error.message : "Project data is invalid.",
          };
        } catch {
          return { project: null, recoveredFromBackup: false, error: "Project and backup data are invalid." };
        }
      }
    },
    save(project) {
      const previous = current.get(project.id);
      if (previous) backups.set(project.id, previous);
      current.set(project.id, exportOpen3dProjectJson(project));
    },
    restoreBackup(projectId) {
      const backup = backups.get(projectId);
      if (!backup) return null;
      const project = importOpen3dProjectJson(backup);
      current.set(projectId, backup);
      return project;
    },
    remove(projectId) {
      current.delete(projectId);
      backups.delete(projectId);
    },
  };
}
