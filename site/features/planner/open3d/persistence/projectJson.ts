import type { Open3dProject } from "../model/types";
import { parseOpen3dProject } from "../shared/document/projectParser";

export function exportOpen3dProjectJson(project: Open3dProject): string {
  return stableStringify(project);
}

export function importOpen3dProjectJson(json: string): Open3dProject {
  const value: unknown = JSON.parse(json);
  return parseOpen3dProject(value);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, child]) => child !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
