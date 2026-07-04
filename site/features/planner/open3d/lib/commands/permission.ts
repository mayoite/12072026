import type { PlannerAccessContext } from "./plannerAccessContext";
import type { PlannerCommandKey } from "./plannerAccessContext";

// Local permission types - mirrors site/features/planner/model/plannerPermissions.ts
// Staging is isolated from site until promotion, so we duplicate the types here.
export type PlannerActionKey =
  | "view"
  | "select"
  | "mutate"
  | "persist"
  | "import"
  | "export"
  | "publish"
  | "share";

const GUEST_BLOCKED_ACTIONS: readonly PlannerActionKey[] = [
  "persist",
  "import",
  "export",
  "publish",
  "share",
] as const;

/**
 * Maps command IDs to planner action keys.
 * This defines which planner permissions apply to each command.
 */
const COMMAND_TO_ACTION_MAP: Record<PlannerCommandKey, PlannerActionKey> = {
  // Drawing/navigation commands - allowed for guests
  "draw-wall": "view",
  "cancel": "view",
  "undo": "view",
  "zoom-in": "view",
  "zoom-out": "view",
  "zoom-reset": "view",

  // Phase 05 commands - blocked for guests
  "save": "persist",
  "export-plan": "export",
  "import-plan": "import",
  "open-file": "import",
  "print": "export",
} as const;

/**
 * Checks if a command is blocked for the given access context.
 * Uses the guest blocked actions list to determine blocking.
 */
export function isCommandBlocked(
  context: PlannerAccessContext,
  commandKey: PlannerCommandKey,
): boolean {
  if (context === "guest") {
    const action = COMMAND_TO_ACTION_MAP[commandKey];
    return GUEST_BLOCKED_ACTIONS.includes(action);
  }
  return false;
}

/**
 * Returns the planner action key associated with a command.
 * Useful for debugging or more granular permission checks.
 */
export function getPlannerActionForCommand(commandKey: PlannerCommandKey): PlannerActionKey {
  return COMMAND_TO_ACTION_MAP[commandKey];
}