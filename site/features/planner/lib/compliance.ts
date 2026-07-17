/**
 * Legacy archive-fabric compliance entry.
 * Live workspace validation is `lib/validation/runValidation` via `useValidation`.
 * This stub remains for import compatibility only — it never claims a clean plan.
 */
export function runPlannerComplianceCheck(
  _editor: null,
  _shapes: unknown[],
): string[] {
  // No fabric draft exists. Callers must use runFloorValidation for real issues.
  return [
    "Legacy compliance check is not wired. Use planner lib/validation/runFloorValidation.",
  ];
}
