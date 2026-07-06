import type { Project } from '$lib/models/types';

export interface DataStore {
  save(project: Project): Promise<void>;
  load(id: string): Promise<Project | null>;
  list(): Promise<{ id: string; name: string; updatedAt: string }[]>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<Project | null>;
  saveThumbnail(id: string, dataUrl: string): void;
  getThumbnail(id: string): string | null;
}

const KEY = 'floorplan_projects';

function getAll(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export const localStore: DataStore = {
  async save(project) {
    const all = getAll();
    all[project.id] = JSON.stringify(project);
    try {
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch (error: unknown) {
      const domError = error as { name?: string; code?: number } | null;
      if (
        domError?.name === 'QuotaExceededError'
        || domError?.code === 22
        || domError?.code === 1014
      ) {
        console.warn('[DataStore] localStorage quota exceeded');
        const minimal: Record<string, string> = {};
        minimal[project.id] = all[project.id];
        try {
          localStorage.setItem(KEY, JSON.stringify(minimal));
          alert('Storage quota exceeded. Other projects were removed to save this one. Consider exporting important projects as JSON.');
        } catch {
          alert('Storage quota exceeded. Please export your project as JSON and clear browser data.');
        }
        return;
      }
      throw error;
    }
  },

  async load(id) {
    const all = getAll();
    const raw = all[id];
    if (!raw) return null;
    const project = JSON.parse(raw) as Project & {
      createdAt?: string | Date;
      updatedAt?: string | Date;
    };
    project.createdAt = new Date(project.createdAt ?? Date.now());
    project.updatedAt = new Date(project.updatedAt ?? Date.now());
    for (const floor of (project.floors ?? [])) {
      if (!floor.rooms) floor.rooms = [];
      if (!floor.doors) floor.doors = [];
      if (!floor.windows) floor.windows = [];
      if (!floor.furniture) floor.furniture = [];
      if (!floor.stairs) floor.stairs = [];
      if (!floor.columns) floor.columns = [];
      if (!floor.guides) floor.guides = [];
      if (!floor.measurements) floor.measurements = [];
      if (!floor.annotations) floor.annotations = [];
      if (!floor.textAnnotations) floor.textAnnotations = [];
      if (!floor.groups) floor.groups = [];
    }
    return project as Project;
  },

  async list() {
    const all = getAll();
    return Object.values(all).map((raw) => {
      const project = JSON.parse(raw) as { id: string; name: string; updatedAt: string };
      return { id: project.id, name: project.name, updatedAt: project.updatedAt };
    });
  },

  async delete(id) {
    const all = getAll();
    delete all[id];
    localStorage.setItem(KEY, JSON.stringify(all));
    try {
      localStorage.removeItem(`floorplan_thumb_${id}`);
    } catch {
      // Ignore thumbnail cleanup failures.
    }
  },

  async duplicate(id) {
    const original = await this.load(id);
    if (!original) return null;
    const duplicateId = Math.random().toString(36).slice(2, 10);
    const duplicate: Project = {
      ...original,
      id: duplicateId,
      name: `${original.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.save(duplicate);
    try {
      const thumbnail = localStorage.getItem(`floorplan_thumb_${id}`);
      if (thumbnail) localStorage.setItem(`floorplan_thumb_${duplicateId}`, thumbnail);
    } catch {
      // Ignore thumbnail copy failures.
    }
    return duplicate;
  },

  saveThumbnail(id, dataUrl) {
    try {
      localStorage.setItem(`floorplan_thumb_${id}`, dataUrl);
    } catch {
      // Ignore thumbnail cache failures.
    }
  },

  getThumbnail(id) {
    try {
      return localStorage.getItem(`floorplan_thumb_${id}`);
    } catch {
      return null;
    }
  },
};
