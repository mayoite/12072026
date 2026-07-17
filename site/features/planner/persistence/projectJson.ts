import type { PlannerProject } from "../model/types";
import { parsePlannerProject } from "../shared/document/projectParser";

export function exportPlannerProjectJson(project: PlannerProject): string {
  return stableStringify(project);
}

export function importPlannerProjectJson(json: string): PlannerProject {
  const value: unknown = JSON.parse(json);
  return parsePlannerProject(value);
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
