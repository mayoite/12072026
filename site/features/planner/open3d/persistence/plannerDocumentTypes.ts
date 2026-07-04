// Dead (used only by dead promotion code). Stub for PLAN-FAIL-0408.
export interface StagingPlannerDocument { id: string; name: string; unit_system: "metric" | "imperial"; sceneJson: string; created_at?: string; updated_at?: string; [key: string]: unknown; }
export function isStagingPlannerDocument(_v: unknown): _v is StagingPlannerDocument { return false; }
