import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_LABELS } from "./canvasTool";
import type { SnapKind } from "@/features/planner/project/lib/geometry/snapping";
import type { CanvasSelection } from "./useWorkspaceCanvas";
import type { Open3dSaveStatus } from "@/features/planner/project/persistence/useOpen3dWorkspaceAutosave";

const SELECTION_LABELS: Record<Exclude<CanvasSelection["type"], "none">, string> = {
  wall: "Wall",
  door: "Door",
  window: "Window",
  furniture: "Furniture",
  room: "Room",
};

export function formatToolStatus(tool: PlannerTool, viewMode: "2d" | "3d"): string {
  return `${CANVAS_TOOL_LABELS[tool]} · ${viewMode.toUpperCase()}`;
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

export type Open3dPersistStorage = "local" | "cloud";

export type Open3dSaveStatusLabelInput = {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
};

/**
 * Single source of truth for TopBar + status-bar save copy (W6).
 * When cloudEnabled is false, storage is forced to local for labeling.
 */
export function open3dSaveStatusLabel(input: Open3dSaveStatusLabelInput): string {
  const guestMode = input.guestMode ?? false;
  const storage: Open3dPersistStorage =
    input.cloudEnabled && input.storage === "cloud" ? "cloud" : "local";

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
        return guestMode ? "Guest session (local)" : "Ready (local)";
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

/** Back-compat wrapper — always local-only path used by open3d today. */
export function formatAutosaveStatus(
  status: Open3dSaveStatus,
  guestMode: boolean,
): string {
  return open3dSaveStatusLabel({
    status,
    storage: "local",
    lastSavedAt: null,
    cloudEnabled: false,
    guestMode,
  });
}
