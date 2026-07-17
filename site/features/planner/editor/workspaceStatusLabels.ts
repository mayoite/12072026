import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_LABELS, CANVAS_TOOL_SHORTCUTS } from "./canvasTool";
import type { SnapKind } from "@/features/planner/lib/geometry/snapping";
import type { CanvasSelection } from "./useWorkspaceCanvas";
import type { PlannerSaveStatus } from "@/features/planner/persistence/usePlannerWorkspaceAutosave";

const SELECTION_LABELS: Record<Exclude<CanvasSelection["type"], "none">, string> = {
  wall: "Wall",
  door: "Door",
  window: "Window",
  furniture: "Furniture",
  room: "Room",
};

/** Compact status-strip tool line: label · shortcut · view (guidance stays on rail/tooltip). */
export function formatToolStatus(tool: PlannerTool, viewMode: "2d" | "3d"): string {
  return `${CANVAS_TOOL_LABELS[tool]} · ${CANVAS_TOOL_SHORTCUTS[tool]} · ${viewMode.toUpperCase()}`;
}

export function formatSnapStatus(snapKind: SnapKind): string | null {
  if (snapKind === "none") return null;
  return `Snap: ${snapKind}`;
}

export function formatSelectionStatus(selection: CanvasSelection): string | null {
  if (selection.type === "none" || selection.ids.length === 0) return null;
  const label = SELECTION_LABELS[selection.type];
  const count = selection.ids.length;
  return count === 1 ? `${label} selected` : `${count} ${label.toLowerCase()}s selected`;
}

export type PlannerPersistStorage = "local" | "cloud";

export type PlannerSaveStatusLabelInput = {
  status: PlannerSaveStatus;
  storage: PlannerPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
  isOffline?: boolean;
};

/**
 * Resolve effective storage for labeling.
 * When cloudEnabled is false, always local — never imply account save.
 */
function resolveLabelStorage(input: PlannerSaveStatusLabelInput): PlannerPersistStorage {
  return input.cloudEnabled && input.storage === "cloud" ? "cloud" : "local";
}

/**
 * Single source of truth for TopBar save copy (W6).
 * When cloudEnabled is false, storage is forced to local for labeling.
 * Status strip uses plannerSaveStatusBarLabel (short) to avoid dual essay.
 * TopBar is the sole customer-facing save authority — do not mirror these
 * full strings into the status bar.
 */
export function plannerSaveStatusLabel(input: PlannerSaveStatusLabelInput): string {
  if (input.isOffline) {
    return `Offline · ${plannerSaveStatusLabel({ ...input, isOffline: false })}`;
  }
  const guestMode = input.guestMode ?? false;
  const storage = resolveLabelStorage(input);

  if (storage === "cloud") {
    switch (input.status) {
      case "saving":
        return "Saving to account…";
      case "saved":
        return "Saved to account";
      case "error":
        return "Account save failed";
      case "unsaved":
        return guestMode ? "Unsaved draft" : "Unsaved changes";
      case "idle":
      default:
        // Cloud path idle: ready to persist to account (not "local").
        return guestMode ? "Guest session" : "Ready (account)";
    }
  }

  switch (input.status) {
    case "saving":
      return "Saving locally…";
    case "saved":
      return guestMode ? "Draft saved locally" : "Saved locally";
    case "unsaved":
      return guestMode ? "Unsaved draft" : "Unsaved changes";
    case "error":
      return "Local save failed";
    case "idle":
    default:
      return guestMode ? "Guest session (local)" : "Ready (local)";
  }
}

/**
 * Short status-strip save pill (e2e: open3d-save-status-bar).
 * Honest local/account wording — never bare "Saved". TopBar keeps full labels.
 * Prefer not rendering this next to TopBar's full pill (one save chrome only).
 */
export function plannerSaveStatusBarLabel(input: PlannerSaveStatusLabelInput): string {
  if (input.isOffline) {
    return `Offline · ${plannerSaveStatusBarLabel({ ...input, isOffline: false })}`;
  }
  const guestMode = input.guestMode ?? false;
  const storage = resolveLabelStorage(input);

  if (storage === "cloud") {
    switch (input.status) {
      case "saving":
        return "Saving…";
      case "saved":
        return "Account OK";
      case "error":
        return "Save failed";
      case "unsaved":
        return "Unsaved";
      case "idle":
      default:
        return guestMode ? "Guest" : "Account";
    }
  }

  switch (input.status) {
    case "saving":
      return "Saving…";
    case "saved":
      return guestMode ? "Draft local" : "Saved local";
    case "unsaved":
      return "Unsaved";
    case "error":
      return "Save failed";
    case "idle":
    default:
      return guestMode ? "Guest · local" : "Local";
  }
}

/** Back-compat wrapper — always local-only path used by open3d today. */
export function formatAutosaveStatus(
  status: PlannerSaveStatus,
  guestMode: boolean,
): string {
  return plannerSaveStatusLabel({
    status,
    storage: "local",
    lastSavedAt: null,
    cloudEnabled: false,
    guestMode,
  });
}
