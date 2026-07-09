import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_LABELS } from "./canvasTool";
import type { SnapKind } from "../lib/geometry/snapping";
import type { CanvasSelection } from "./useWorkspaceCanvas";
import type { Open3dSaveStatus } from "../persistence/useOpen3dWorkspaceAutosave";

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

export function formatAutosaveStatus(
  status: Open3dSaveStatus,
  guestMode: boolean,
): string {
  // Always honest: open3d path is local IDB until cloud is wired (W6).
  switch (status) {
    case "saving":
      return "Saving locally…";
    case "saved":
      return guestMode ? "Draft saved locally" : "Saved locally";
    case "unsaved":
      return guestMode ? "Unsaved draft" : "Unsaved changes";
    case "error":
      return "Save failed";
    case "idle":
    default:
      return guestMode ? "Guest session (local)" : "Ready (local)";
  }
}
