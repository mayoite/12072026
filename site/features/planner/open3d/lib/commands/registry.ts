import {
  isCommandBlockedForContext,
  type PlannerAccessContext,
  type PlannerCommandKey,
} from "./plannerAccessContext";

// Backward-compat alias — existing code that imports FeasibilityCommandId keeps working.
export type FeasibilityCommandId = PlannerCommandKey;
export type { PlannerCommandKey, PlannerAccessContext };

export type CommandOutcome =
  | { status: "activated"; commandId: FeasibilityCommandId }
  | { status: "completed"; commandId: FeasibilityCommandId }
  | { status: "unavailable"; commandId: FeasibilityCommandId; reason?: string };

export interface FeasibilityCommandContext {
  activateDrawWall: () => void;
  cancel: () => void;
  undo: () => boolean;
  zoomBy: (factor: number) => void;
  resetZoom: () => void;
}

export interface FeasibilityCommand {
  id: FeasibilityCommandId;
  label: string;
  shortcut: string;
  execute: (context: FeasibilityCommandContext) => CommandOutcome;
}

/**
 * Core drawing/navigation commands (Phase 01 set).
 * Kept at exactly 6 entries so existing tests remain stable.
 * Phase 05 stub commands are in the internal registry below.
 */
export const feasibilityCommands: readonly FeasibilityCommand[] = [
  {
    id: "draw-wall",
    label: "Draw wall",
    shortcut: "W",
    execute: (context) => {
      context.activateDrawWall();
      return { status: "activated", commandId: "draw-wall" };
    },
  },
  {
    id: "cancel",
    label: "Cancel",
    shortcut: "Esc",
    execute: (context) => {
      context.cancel();
      return { status: "completed", commandId: "cancel" };
    },
  },
  {
    id: "undo",
    label: "Undo",
    shortcut: "Ctrl+Z",
    execute: (context) =>
      context.undo()
        ? { status: "completed", commandId: "undo" }
        : { status: "unavailable", commandId: "undo" },
  },
  {
    id: "zoom-in",
    label: "Zoom in",
    shortcut: "+",
    execute: (context) => {
      context.zoomBy(1.2);
      return { status: "completed", commandId: "zoom-in" };
    },
  },
  {
    id: "zoom-out",
    label: "Zoom out",
    shortcut: "−",
    execute: (context) => {
      context.zoomBy(1 / 1.2);
      return { status: "completed", commandId: "zoom-out" };
    },
  },
  {
    id: "zoom-reset",
    label: "Reset view",
    shortcut: "0",
    execute: (context) => {
      context.resetZoom();
      return { status: "completed", commandId: "zoom-reset" };
    },
  },
];

/**
 * Phase 05 stub commands — blocked for guests via the permission gate.
 * Not added to `feasibilityCommands` to keep existing tests stable.
 * `executeCommand` merges both sets when dispatching.
 */
const phase05StubCommands: readonly FeasibilityCommand[] = [
  {
    id: "save",
    label: "Save",
    shortcut: "Ctrl+S",
    execute: (_context) => ({ status: "unavailable", commandId: "save" }),
  },
  {
    id: "export-plan",
    label: "Export plan",
    shortcut: "Ctrl+Shift+E",
    execute: (_context) => ({ status: "unavailable", commandId: "export-plan" }),
  },
  {
    id: "import-plan",
    label: "Import plan",
    shortcut: "Ctrl+Shift+I",
    execute: (_context) => ({ status: "unavailable", commandId: "import-plan" }),
  },
  {
    id: "open-file",
    label: "Open file",
    shortcut: "Ctrl+O",
    execute: (_context) => ({ status: "unavailable", commandId: "open-file" }),
  },
  {
    id: "print",
    label: "Print",
    shortcut: "Ctrl+P",
    execute: (_context) => ({ status: "unavailable", commandId: "print" }),
  },
];

/** Full command registry used by executeCommand. */
const allCommands: readonly FeasibilityCommand[] = [
  ...feasibilityCommands,
  ...phase05StubCommands,
];

export function getFeasibilityCommand(id: FeasibilityCommandId): FeasibilityCommand {
  const command = feasibilityCommands.find((candidate) => candidate.id === id);
  if (!command) throw new Error(`Unknown feasibility command: ${id}`);
  return command;
}

export function executeCommand(
  context: PlannerAccessContext,
  id: PlannerCommandKey,
  cmdContext: FeasibilityCommandContext,
): CommandOutcome {
  if (isCommandBlockedForContext(context, id)) {
    return { status: "unavailable", commandId: id, reason: "blocked-for-guest" };
  }
  const command = allCommands.find((candidate) => candidate.id === id);
  if (!command) {
    return { status: "unavailable", commandId: id };
  }
  return command.execute(cmdContext);
}
