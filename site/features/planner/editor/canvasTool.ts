/**
 * Canvas tool authority — single map for rail, keyboard, palette labels.
 *
 * Requirement tiers (owner: restore honesty — require differently):
 * - live: geometry or nav works on Fabric host today (W1 / W8 shell)
 * - keyboard: arms via shortcut; may alias to a live tool
 * - deferred: may appear on rail for UX; no full geometry until card says so
 */

export type CanvasTool = "select" | "wall" | "door" | "window" | "text" | "pan";

export type PlannerTool =
  | CanvasTool
  | "room"
  | "opening"
  | "dimension"
  | "placement";

/** Runtime path the Fabric stage understands for pointer geometry. */
export type CanvasRuntimeTool =
  | "select"
  | "wall"
  | "door"
  | "window"
  | "text"
  | "pan"
  | "opening"
  | "placement";

export type PlannerToolPhase =
  | "inactive"
  | "armed"
  | "drawing"
  | "transforming"
  | "committing"
  | "cancelled"
  | "failed";

export type ToolRequirementTier = "live" | "keyboard" | "deferred";

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

/** Honest guidance — no claim of geometry that Fabric does not implement. */
export const CANVAS_TOOL_GUIDANCE: Record<PlannerTool, string> = {
  select: "Click an object to inspect it. Delete removes the selection.",
  pan: "Drag to move the drawing. Release Space to restore the armed tool.",
  room: "Room outline is deferred — use Wall segments or Starter room for now.",
  wall: "Press and drag to draw a wall segment; release to commit.",
  opening: "Click a wall to add a door opening.",
  dimension: "Dimension annotations are deferred — measure via properties for now.",
  placement: "Choose a catalogue item, then click the canvas to place it.",
  door: "Click a wall to add a door (same path as Opening).",
  window: "Click a wall to add a window.",
  text: "Text annotations are deferred.",
};

/**
 * Requirement tier per tool — plan law / W8 green-when uses this.
 * live = buyer path on Fabric today · deferred = not W1 geometry · keyboard = shortcut only
 */
export const CANVAS_TOOL_REQUIREMENT: Record<PlannerTool, ToolRequirementTier> = {
  select: "live",
  pan: "live",
  wall: "live",
  opening: "live",
  placement: "live",
  door: "live",
  window: "live",
  room: "deferred",
  dimension: "deferred",
  text: "deferred",
};

/** Tools on the RAC rail (nav group). */
export const RAIL_NAV_TOOLS: readonly PlannerTool[] = ["select", "pan"];

/** Tools on the RAC rail (draw group). Room/dimension stay visible but deferred. */
export const RAIL_DRAW_TOOLS: readonly PlannerTool[] = [
  "room",
  "wall",
  "opening",
  "dimension",
  "placement",
];

/** Full rail order (nav + draw). Palette tool list must match this + keyboard extras. */
export const CANVAS_TOOLS: PlannerTool[] = [...RAIL_NAV_TOOLS, ...RAIL_DRAW_TOOLS];

/** Palette / keyboard-only extras not duplicated on the rail (still live when armed). */
export const PALETTE_EXTRA_TOOLS: readonly PlannerTool[] = ["door", "window", "text"];

/** All tools that appear in palette tool section = rail + extras. */
export const PALETTE_TOOLS: readonly PlannerTool[] = [
  ...CANVAS_TOOLS,
  ...PALETTE_EXTRA_TOOLS,
];

/** Live geometry tools required for W1 shell proof. */
export const LIVE_GEOMETRY_TOOLS: readonly PlannerTool[] = (
  Object.entries(CANVAS_TOOL_REQUIREMENT) as [PlannerTool, ToolRequirementTier][]
)
  .filter(([, tier]) => tier === "live")
  .map(([id]) => id);

/**
 * Map UI tool → Fabric pointer path.
 * Room/dimension/text are deferred: arm as select so clicks do not fake geometry.
 */
export function runtimeToolFor(tool: PlannerTool): CanvasRuntimeTool {
  if (tool === "opening" || tool === "door") return "door";
  if (tool === "window") return "window";
  if (tool === "placement") return "placement";
  if (tool === "room" || tool === "dimension" || tool === "text") return "select";
  return tool;
}

export function isLiveGeometryTool(tool: PlannerTool): boolean {
  return CANVAS_TOOL_REQUIREMENT[tool] === "live";
}

/** Accessible name for RAC toggles — deferred tools mark honesty in the name. */
export function toolAccessibleName(tool: PlannerTool): string {
  const base = `${CANVAS_TOOL_LABELS[tool]} (${CANVAS_TOOL_SHORTCUTS[tool]})`;
  if (CANVAS_TOOL_REQUIREMENT[tool] === "deferred") {
    return `${base}, deferred`;
  }
  return base;
}

/** Tooltip / status body — maps to guidance authority. */
export function toolTooltipText(tool: PlannerTool): string {
  return CANVAS_TOOL_GUIDANCE[tool];
}
