/**
 * Live planner step types — used by open3d workspace store / onboarding.
 * No archive Fabric runtime. Gate helpers that need archive canvas stay under _archive.
 */

export type PlannerStep = "draw" | "place" | "review";

export const PLANNER_STEPS: PlannerStep[] = ["draw", "place", "review"];

export const PLANNER_STEP_LABELS: Record<PlannerStep, string> = {
  draw: "Draw",
  place: "Place",
  review: "Review",
};

export const PLANNER_STEP_DETAILS: Record<PlannerStep, string> = {
  draw: "Walls, rooms",
  place: "Furniture, doors, windows",
  review: "Measurements, properties, export",
};
