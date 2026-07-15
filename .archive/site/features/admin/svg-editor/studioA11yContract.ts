/**
 * ADM-A11Y-02/03/04 — SVG studio accessibility contract.
 *
 * Documents keyboard completion, non-drag alternatives for every drag gesture,
 * and announcement surfaces. Tests assert these ids/roles exist on the live UI.
 */

/** Drag gestures the engine supports on the stage. */
export const STUDIO_DRAG_ACTIONS = ["move", "resize", "pan", "zoom"] as const;
export type StudioDragAction = (typeof STUDIO_DRAG_ACTIONS)[number];

/**
 * Non-drag alternative control test ids / labels for each drag action.
 * Move/resize: inspector numbers + arrow-key nudge.
 * Pan/zoom: Fit / Reset / Zoom in / Zoom out toolbar buttons.
 */
export const STUDIO_NON_DRAG_ALTERNATIVES: Record<
  StudioDragAction,
  readonly string[]
> = {
  move: [
    "admin-studio-geom-x",
    "admin-studio-geom-y",
    "admin-studio-geom-cx",
    "admin-studio-geom-cy",
    "admin-studio-geom-x1",
    "admin-studio-geom-y1",
    "admin-studio-geom-x2",
    "admin-studio-geom-y2",
    "admin-studio-nudge-hint",
  ],
  resize: [
    "admin-studio-geom-w",
    "admin-studio-geom-h",
    "admin-studio-geom-r",
  ],
  pan: ["admin-studio-zoom-fit", "admin-studio-zoom-reset"],
  zoom: [
    "admin-studio-zoom-in",
    "admin-studio-zoom-out",
    "admin-studio-zoom-fit",
    "admin-studio-zoom-reset",
  ],
};

/** Keyboard path roles on the author→publish journey (studio portion). */
export const STUDIO_KEYBOARD_CONTROL_LABELS = [
  "Add rectangle",
  "Add circle",
  "Add line",
  "Add text",
  "Undo unavailable",
  "Zoom to fit",
  "Zoom in",
  "Zoom out",
  "Reset viewport",
] as const;

/** Scene units moved per Arrow key press (Shift = 10×). */
export const STUDIO_NUDGE_STEP = 1;
export const STUDIO_NUDGE_STEP_FAST = 10;

/** Zoom multiplier for toolbar Zoom in / Zoom out. */
export const STUDIO_ZOOM_STEP = 1.25;
export const STUDIO_ZOOM_MIN = 0.1;
export const STUDIO_ZOOM_MAX = 40;
