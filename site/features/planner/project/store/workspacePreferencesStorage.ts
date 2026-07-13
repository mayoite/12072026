import {
  DEFAULT_PLANNER_WORKSPACE_PREFERENCES,
  parsePlannerWorkspacePreferences,
  type PlannerWorkspacePreferencesV1,
} from "./workspacePreferences";

export const PLANNER_WORKSPACE_PREFS_STORAGE_KEY = "planner-workspace-preferences";

export function readPlannerWorkspacePreferencesFromStorage():
  | PlannerWorkspacePreferencesV1
  | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLANNER_WORKSPACE_PREFS_STORAGE_KEY);
    return parsePlannerWorkspacePreferences(raw ? JSON.parse(raw) : null);
  } catch {
    return null;
  }
}

export function writePlannerWorkspacePreferencesToStorage(
  prefs: PlannerWorkspacePreferencesV1,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLANNER_WORKSPACE_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage may be blocked — caller keeps in-memory state.
  }
}

export function patchPlannerWorkspacePreferences(
  patch: Partial<PlannerWorkspacePreferencesV1>,
): PlannerWorkspacePreferencesV1 {
  const base =
    readPlannerWorkspacePreferencesFromStorage() ??
    DEFAULT_PLANNER_WORKSPACE_PREFERENCES;
  const updated: PlannerWorkspacePreferencesV1 = {
    ...base,
    ...patch,
    panelRatios: { ...base.panelRatios, ...patch.panelRatios },
    collapsedPanels: patch.collapsedPanels ?? base.collapsedPanels,
  };
  writePlannerWorkspacePreferencesToStorage(updated);
  return updated;
}