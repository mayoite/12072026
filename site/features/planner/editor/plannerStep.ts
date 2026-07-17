/**
 * Live planner step types — used by workspace store / onboarding.
 * No archive Fabric runtime — `_archive` deleted; live tools only.
 */

export type PlannerStep = "draw" | "place" | "review";

export const PLANNER_STEPS: PlannerStep[] = ["draw", "place", "review"];

export const PLANNER_STEP_LABELS: Record<PlannerStep, string> = {
  draw: "Draw room",
  place: "Place furniture",
  review: "Review & quote",
};

export const PLANNER_STEP_DETAILS: Record<PlannerStep, string> = {
  draw: "Walls, openings, measurements",
  place: "Choose and position furniture",
  review: "Check dimensions, validate, generate quote",
};
