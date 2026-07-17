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

export type PlannerStepCompletion = "complete" | "incomplete";

export type PlannerStepCompletionMap = Record<PlannerStep, PlannerStepCompletion>;

export interface PlannerWorkflowMetrics {
  walls: number;
  furniture: number;
  boqReady: boolean;
  closedRoom?: boolean;
  planWidthMm?: number;
  planDepthMm?: number;
}

/**
 * Customer workflow completion is derived from the plan.
 * Navigation never mutates these values and never fakes completion.
 */
export function derivePlannerStepCompletion(
  metrics?: PlannerWorkflowMetrics,
): PlannerStepCompletionMap {
  const measuredRoom = Boolean(
    metrics &&
      metrics.walls >= 4 &&
      metrics.closedRoom === true &&
      (metrics.planWidthMm ?? 0) > 0 &&
      (metrics.planDepthMm ?? 0) > 0,
  );
  const furniturePlaced = (metrics?.furniture ?? 0) > 0;

  return {
    draw: measuredRoom ? "complete" : "incomplete",
    place: furniturePlaced ? "complete" : "incomplete",
    review: metrics?.boqReady ? "complete" : "incomplete",
  };
}

export function plannerForwardWarning(
  target: PlannerStep,
  completion: PlannerStepCompletionMap,
): string | null {
  const targetIndex = PLANNER_STEPS.indexOf(target);
  if (targetIndex <= 0) return null;

  const incomplete = PLANNER_STEPS.slice(0, targetIndex).filter(
    (step) => completion[step] !== "complete",
  );
  if (incomplete.length === 0) return null;

  const labels = incomplete.map((step) => PLANNER_STEP_LABELS[step]).join(" and ");
  const verb = incomplete.length === 1 ? "is" : "are";
  return `${labels} ${verb} incomplete. You can continue, but review and quote may remain blocked.`;
}
