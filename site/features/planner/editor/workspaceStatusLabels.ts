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

/**
 * Authoritative save UI state machine (benchmark: one map, not competing verbs).
 *
 * - `dirty` maps from persistence `unsaved`
 * - `offline` is connection overlay (reported when isOffline; labels still carry base persist state)
 * Persistence machine stays: idle | unsaved | saving | saved | error
 */
export type PlannerSaveUiState =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error"
  | "offline";

export type PlannerSaveStatusLabelInput = {
  status: PlannerSaveStatus;
  storage: PlannerPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
  isOffline?: boolean;
};

export type PlannerSaveChrome = {
  /** data-status / machine value (unsaved not dirty) */
  dataStatus: PlannerSaveStatus;
  /** UI state for the single map (dirty aliases unsaved; offline when disconnected) */
  uiState: PlannerSaveUiState;
  /** Primary save CTA only — exclusive home for "Saving…" / "Save draft" / "Retry save" */
  buttonLabel: string;
  /** Short status pill next to the button — never a second "Saving" verb */
  statusLabel: string;
  buttonAriaLabel: string;
  storage: PlannerPersistStorage;
  isOffline: boolean;
  guestMode: boolean;
};

/**
 * Resolve effective storage for labeling.
 * When cloudEnabled is false, always local — never imply account save.
 */
function resolveLabelStorage(input: PlannerSaveStatusLabelInput): PlannerPersistStorage {
  return input.cloudEnabled && input.storage === "cloud" ? "cloud" : "local";
}

/** Map persistence status → UI state (offline wins when disconnected). */
export function toPlannerSaveUiState(
  status: PlannerSaveStatus,
  isOffline = false,
): PlannerSaveUiState {
  if (isOffline) return "offline";
  if (status === "unsaved") return "dirty";
  return status;
}

/**
 * ONE label table for TopBar save chrome.
 *
 * Button (CTA) — only user-facing save action copy:
 * | state   | guest        | member       |
 * |---------|--------------|--------------|
 * | idle    | Save draft   | Save         |
 * | dirty   | Save draft   | Save         |
 * | saving  | Saving…      | Saving…      |
 * | saved   | Save draft   | Save         |
 * | error   | Retry save   | Retry save   |
 * | offline | (same as base persist state CTA) |
 *
 * Status (short, non-CTA) — pill only; never duplicates button save verbs:
 * | state   | local guest     | local member   | account        |
 * |---------|-----------------|----------------|----------------|
 * | idle    | Guest · local   | Ready · local  | Guest / Ready · account |
 * | dirty   | Unsaved         | Unsaved        | Unsaved        |
 * | saving  | Local           | Local          | Account        |  ← no "Saving"
 * | saved   | Draft local     | Saved local    | Account OK     |
 * | error   | Save failed     | Save failed    | Save failed    |
 * | offline | Offline · {base short status without Offline prefix} |
 *
 * TopBar is sole customer-facing save authority. Status bar must not mirror these.
 */
export function resolvePlannerSaveChrome(
  input: PlannerSaveStatusLabelInput,
): PlannerSaveChrome {
  const guestMode = input.guestMode ?? false;
  const isOffline = input.isOffline ?? false;
  const storage = resolveLabelStorage(input);
  const dataStatus = input.status;
  const uiState = toPlannerSaveUiState(dataStatus, isOffline);

  const buttonLabel = resolveButtonLabel(dataStatus, guestMode);
  const baseStatusLabel = resolveShortStatusLabel(dataStatus, storage, guestMode);
  const statusLabel = isOffline
    ? dataStatus === "idle"
      ? "Offline"
      : `Offline · ${baseStatusLabel}`
    : baseStatusLabel;

  const buttonAriaLabel =
    dataStatus === "error"
      ? `Retry save — ${statusLabel}`
      : dataStatus === "saving"
        ? `Saving — ${statusLabel}`
        : guestMode
          ? "Save draft to this device"
          : "Save project";

  return {
    dataStatus,
    uiState,
    buttonLabel,
    statusLabel,
    buttonAriaLabel,
    storage,
    isOffline,
    guestMode,
  };
}

function resolveButtonLabel(
  status: PlannerSaveStatus,
  guestMode: boolean,
): string {
  switch (status) {
    case "error":
      return "Retry save";
    case "saving":
      return "Saving…";
    case "idle":
    case "unsaved":
    case "saved":
    default:
      return guestMode ? "Save draft" : "Save";
  }
}

/**
 * Short status for the TopBar pill.
 * When status is "saving", return storage only — button owns the sole "Saving…" verb.
 */
function resolveShortStatusLabel(
  status: PlannerSaveStatus,
  storage: PlannerPersistStorage,
  guestMode: boolean,
): string {
  if (storage === "cloud") {
    switch (status) {
      case "saving":
        return "Account";
      case "saved":
        return "Account OK";
      case "error":
        return "Save failed";
      case "unsaved":
        return "Unsaved";
      case "idle":
      default:
        return guestMode ? "Guest" : "Ready · account";
    }
  }

  switch (status) {
    case "saving":
      // Storage only — do not say "Saving" here (button already does).
      return "Local";
    case "saved":
      return guestMode ? "Draft local" : "Saved local";
    case "unsaved":
      return "Unsaved";
    case "error":
      return "Save failed";
    case "idle":
    default:
      return guestMode ? "Guest · local" : "Ready · local";
  }
}

/**
 * Short status label from the single map (TopBar pill / parent pass-through).
 * Prefer resolvePlannerSaveChrome when both button + status are needed.
 */
export function plannerSaveStatusLabel(input: PlannerSaveStatusLabelInput): string {
  return resolvePlannerSaveChrome(input).statusLabel;
}

/**
 * Compact status-strip save label — same short map as the pill.
 * Prefer not rendering this in the bottom status bar next to TopBar (one save chrome only).
 * Kept for callers/tests that need a short string without a CTA verb.
 */
export function plannerSaveStatusBarLabel(input: PlannerSaveStatusLabelInput): string {
  return resolvePlannerSaveChrome(input).statusLabel;
}

/** Button CTA from the same map (tests + TopBar). */
export function plannerSaveButtonLabel(input: PlannerSaveStatusLabelInput): string {
  return resolvePlannerSaveChrome(input).buttonLabel;
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
