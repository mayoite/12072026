import type { Open3dProject } from "../model/types";
import { parseOpen3dProject } from "../shared/document/projectParser";

export function exportOpen3dProjectJson(project: Open3dProject): string {
  return JSON.stringify(project);
}

export function importOpen3dProjectJson(json: string): Open3dProject {
  const value: unknown = JSON.parse(json);
  return parseOpen3dProject(value);
}
