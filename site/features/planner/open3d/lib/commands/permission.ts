import type { PlannerAccessContext } from "./plannerAccessContext";
import type { PlannerCommandKey } from "./plannerAccessContext";

// Consolidated from canonical model (site/features/planner/model/plannerPermissions.ts)
// Removed local duplicate type + blocked list const (exact match); use shared to dedup logic/strings.
import type { PlannerActionKey } from "@/features/planner/model/plannerPermissions";
import { PLANNER_GUEST_BLOCKED_ACTIONS } from "@/features/planner/model/plannerPermissions";

const GUEST_BLOCKED_ACTIONS: readonly PlannerActionKey[] = PLANNER_GUEST_BLOCKED_ACTIONS;

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