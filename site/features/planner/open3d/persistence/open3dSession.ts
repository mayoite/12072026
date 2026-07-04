import type { Open3dProject } from "../model/types";
import { importOpen3dProjectJson } from "./projectJson";

export const OPEN3D_SESSION_VERSION = "open3d-1" as const;

export type Open3dSessionEnvelope = {
  version: typeof OPEN3D_SESSION_VERSION;
  engine: "open3d";
  project: Open3dProject;
  updatedAt: string;
};

export function buildOpen3dSessionEnvelope(project: Open3dProject): Open3dSessionEnvelope {
  return {
    version: OPEN3D_SESSION_VERSION,
    engine: "open3d",
    project,
    updatedAt: new Date().toISOString(),
  };
}

export function parseOpen3dSessionSnapshot(raw: string): Open3dProject | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

    if (parsed.version === OPEN3D_SESSION_VERSION && parsed.engine === "open3d" && parsed.project) {
      return importOpen3dProjectJson(JSON.stringify(parsed.project));
    }

    // Legacy: raw Open3dProject JSON in snapshot slot
    return importOpen3dProjectJson(raw);
  } catch {
    return null;
  }
}
