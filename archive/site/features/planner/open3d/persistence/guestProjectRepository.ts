import type { Open3dProject } from "../model/types";
import {
  exportOpen3dProjectJson,
  importOpen3dProjectJson,
} from "./projectJson";

const STORAGE_PREFIX = "oando:open3d:guest:v1:";

export interface Open3dGuestProjectRepository {
  load(projectId: string): Open3dProject | null;
  save(project: Open3dProject): void;
  remove(projectId: string): void;
}

export function createOpen3dGuestProjectRepository(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
): Open3dGuestProjectRepository {
  return {
    load(projectId) {
      const json = storage.getItem(`${STORAGE_PREFIX}${projectId}`);
      return json ? importOpen3dProjectJson(json) : null;
    },
    save(project) {
      storage.setItem(
        `${STORAGE_PREFIX}${project.id}`,
        exportOpen3dProjectJson(project),
      );
    },
    remove(projectId) {
      storage.removeItem(`${STORAGE_PREFIX}${projectId}`);
    },
  };
}
