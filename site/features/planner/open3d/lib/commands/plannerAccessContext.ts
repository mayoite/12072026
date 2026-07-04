import { isCommandBlocked } from "./permission";

export type PlannerAccessContext = "guest" | "authenticated" | "admin";

export type PlannerCommandKey =
  | "draw-wall"
  | "cancel"
  | "undo"
  | "zoom-in"
  | "zoom-out"
  | "zoom-reset"
  | "save"
  | "export-plan"
  | "import-plan"
  | "open-file"
  | "print";

/** Actions blocked for guests. Matches site/features/planner/model/plannerPermissions.ts PLANNER_GUEST_BLOCKED_ACTIONS */
export const GUEST_BLOCKED_COMMAND_KEYS: ReadonlySet<PlannerCommandKey> = new Set([
  "save",
  "export-plan",
  "import-plan",
  "open-file",
  "print",
]);

/**
 * Checks if a command is blocked for the given access context.
 * Uses the planner permissions system to determine blocking.
 */
export function isCommandBlockedForContext(
  context: PlannerAccessContext,
  commandKey: PlannerCommandKey,
): boolean {
  return isCommandBlocked(context, commandKey);
}
