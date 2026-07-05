export type PlannerSelectionType =
  | "door"
  | "window"
  | "wall"
  | "furniture"
  | "room"
  | "none";

export type PlannerSelection =
  | { type: "none"; ids: readonly [] }
  | { type: Exclude<PlannerSelectionType, "none">; ids: readonly [string, ...string[]] };

export const EMPTY_PLANNER_SELECTION: PlannerSelection = { type: "none", ids: [] };

export function createPlannerSelection(
  type: PlannerSelectionType,
  ids: readonly string[],
): PlannerSelection {
  const uniqueIds = [...new Set(ids.filter((id) => id.trim().length > 0))];
  if (type === "none" || uniqueIds.length === 0) return EMPTY_PLANNER_SELECTION;
  return {
    type,
    ids: uniqueIds as [string, ...string[]],
  };
}
