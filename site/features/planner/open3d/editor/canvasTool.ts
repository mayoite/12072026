/** Active canvas tool — mirrors donor keyboard tool set (README.md shortcuts). */
export type CanvasTool =
  | "select"
  | "wall"
  | "door"
  | "window"
  | "text"
  | "pan";

export const CANVAS_TOOL_SHORTCUTS: Record<CanvasTool, string> = {
  select: "V",
  wall: "W",
  door: "D",
  window: "T",
  text: "N",
  pan: "H",
};

export const CANVAS_TOOL_LABELS: Record<CanvasTool, string> = {
  select: "Select",
  wall: "Wall",
  door: "Door",
  window: "Window",
  text: "Text",
  pan: "Pan",
};

/** Default tool rail order (navigate, then draw). */
export const CANVAS_TOOLS: CanvasTool[] = [
  "select",
  "pan",
  "wall",
  "door",
  "window",
  "text",
];
