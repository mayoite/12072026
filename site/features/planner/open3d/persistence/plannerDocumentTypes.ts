/** Minimal staging mirror of site PlannerDocument — full type lives in site/features/planner/model */
export interface StagingPlannerDocument {
  id: string;
  name: string;
  unit_system: "metric" | "imperial";
  sceneJson: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export function isStagingPlannerDocument(value: unknown): value is StagingPlannerDocument {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.name === "string" && typeof v.sceneJson === "string";
}
