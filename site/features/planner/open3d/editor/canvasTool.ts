/** Active canvas tool — mirrors donor keyboard tool set (README.md shortcuts). */
export type CanvasTool = "select" | "wall" | "door" | "window" | "text" | "pan";

export type PlannerTool =
  | CanvasTool
  | "room"
  | "opening"
  | "dimension"
  | "placement";

export type CanvasRuntimeTool = "select" | "wall" | "door" | "window" | "text" | "pan";

export type PlannerToolPhase =
  | "inactive"
  | "armed"
  | "drawing"
  | "transforming"
  | "committing"
  | "cancelled"
  | "failed";

export interface PlannerToolState {
  tool: CanvasTool;
  phase: PlannerToolPhase;
  error?: string;
}

export const CANVAS_TOOL_SHORTCUTS: Record<PlannerTool, string> = {
  select: "V",
  room: "R",
  wall: "W",
  opening: "O",
  dimension: "M",
  placement: "P",
  door: "D",
  window: "N",
  text: "T",
  pan: "H",
};

export const CANVAS_TOOL_LABELS: Record<PlannerTool, string> = {
  select: "Select",
  room: "Room",
  wall: "Wall",
  opening: "Opening",
  dimension: "Dimension",
  placement: "Place",
  door: "Door",
  window: "Window",
  text: "Text",
  pan: "Pan",
};

export const CANVAS_TOOL_GUIDANCE: Record<PlannerTool, string> = {
  select: "Click an object to inspect it. Delete removes the selection.",
  pan: "Drag to move the drawing. Release Space to restore the armed tool.",
  room: "Click corners to outline a room. Enter accepts; Escape cancels.",
  wall: "Click start and end points. Alt temporarily bypasses snapping. (Shift+click multi; Space pan)",
  opening: "Click a wall to add an opening.",
  dimension: "Pick two points to annotate a measured span.",
  placement: "Choose a catalogue item, then click the canvas to place it.",
  door: "Click a wall to add a door.",
  window: "Click a wall to add a window.",
  text: "Click the canvas to add an annotation.",
};

/** Default tool rail order (navigate, then draw). */
export const CANVAS_TOOLS: PlannerTool[] = [
  "select",
  "pan",
  "room",
  "wall",
  "opening",
  "dimension",
  "placement",
];

export function runtimeToolFor(tool: PlannerTool): CanvasRuntimeTool {
  if (tool === "room") return "wall";
  if (tool === "opening") return "door";
  if (tool === "dimension") return "text";
  if (tool === "placement") return "select";
  return tool;
}
