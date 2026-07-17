/**
 * Planner workspace layout: edges, chrome packs, rail, and named presets.
 * Persisted separately from panel geometry where noted.
 */

export type DockEdge = "left" | "right" | "bottom";
export type RailEdge = "left" | "top";
export type RailOrientation = "vertical" | "horizontal";

export type ChromePackId = "history" | "view" | "file" | "prefs" | "layout";
export type ChromePackPlacement = "topbar" | "floating" | "overflow";

export type LayoutPresetId = "default" | "catalog" | "review" | "canvas" | "floating";

export type PanelId = "left" | "right" | "bottom";
export type PanelState = "docked" | "floating" | "collapsed";

export interface PanelLayoutConfig {
  id: PanelId;
  state: PanelState;
  /** Edge used when state === "docked". Side panels: left|right. Bottom: bottom. */
  dockEdge: DockEdge;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
}

export interface ChromePackLayout {
  id: ChromePackId;
  placement: ChromePackPlacement;
  x: number;
  y: number;
}

export interface RailLayoutConfig {
  state: "docked" | "floating";
  edge: RailEdge;
  orientation: RailOrientation;
  /** When true, Nav / Draw / Deferred float as separate modules. */
  splitGroups: boolean;
  x: number;
  y: number;
}

export interface WorkspaceLayoutSnapshot {
  panels: Record<PanelId, PanelLayoutConfig>;
  chrome: ChromePackLayout[];
  rail: RailLayoutConfig;
  presetId: LayoutPresetId | "custom";
}

export const PLANNER_WORKSPACE_LAYOUT_KEY = "planner-workspace-layout-v2";
export const PLANNER_TOOL_RAIL_DOCK_KEY = "planner-tool-rail-dock";
export const PLANNER_CHROME_PACKS_KEY = "planner-chrome-packs-v1";

export const DEFAULT_PANEL_LAYOUT: Record<PanelId, PanelLayoutConfig> = {
  left: {
    id: "left",
    state: "docked",
    dockEdge: "left",
    width: 260,
    height: 0,
    x: 0,
    y: 0,
    zIndex: 55,
  },
  right: {
    id: "right",
    state: "docked",
    dockEdge: "right",
    width: 240,
    height: 0,
    x: 0,
    y: 0,
    zIndex: 55,
  },
  bottom: {
    id: "bottom",
    state: "collapsed",
    dockEdge: "bottom",
    width: 0,
    height: 200,
    x: 0,
    y: 0,
    zIndex: 55,
  },
};

export const DEFAULT_CHROME_PACKS: ChromePackLayout[] = [
  { id: "history", placement: "topbar", x: 80, y: 56 },
  { id: "view", placement: "topbar", x: 220, y: 56 },
  { id: "file", placement: "topbar", x: 400, y: 56 },
  { id: "prefs", placement: "topbar", x: 560, y: 56 },
  { id: "layout", placement: "topbar", x: 680, y: 56 },
];

export const DEFAULT_RAIL_LAYOUT: RailLayoutConfig = {
  state: "docked",
  edge: "left",
  orientation: "vertical",
  splitGroups: false,
  x: 12,
  y: 72,
};

export const LAYOUT_PRESET_LABELS: Record<LayoutPresetId, string> = {
  default: "Default",
  catalog: "Catalog focus",
  review: "Review focus",
  canvas: "Canvas focus",
  floating: "Floating",
};

function clonePanels(
  source: Record<PanelId, PanelLayoutConfig>,
): Record<PanelId, PanelLayoutConfig> {
  return {
    left: { ...source.left },
    right: { ...source.right },
    bottom: { ...source.bottom },
  };
}

/** Named layouts — applied atomically. */
export function buildLayoutPreset(presetId: LayoutPresetId): WorkspaceLayoutSnapshot {
  switch (presetId) {
    case "default":
      return {
        panels: clonePanels(DEFAULT_PANEL_LAYOUT),
        chrome: DEFAULT_CHROME_PACKS.map((p) => ({ ...p, placement: "topbar" as const })),
        rail: { ...DEFAULT_RAIL_LAYOUT },
        presetId: "default",
      };
    case "catalog":
      return {
        panels: {
          left: { ...DEFAULT_PANEL_LAYOUT.left, state: "docked", dockEdge: "left", width: 320 },
          right: { ...DEFAULT_PANEL_LAYOUT.right, state: "collapsed" },
          bottom: { ...DEFAULT_PANEL_LAYOUT.bottom, state: "collapsed" },
        },
        chrome: DEFAULT_CHROME_PACKS.map((p) =>
          p.id === "prefs" || p.id === "layout"
            ? { ...p, placement: "topbar" as const }
            : { ...p, placement: "topbar" as const },
        ),
        rail: { ...DEFAULT_RAIL_LAYOUT, state: "docked", edge: "left", orientation: "vertical" },
        presetId: "catalog",
      };
    case "review":
      return {
        panels: {
          left: { ...DEFAULT_PANEL_LAYOUT.left, state: "collapsed" },
          right: { ...DEFAULT_PANEL_LAYOUT.right, state: "docked", width: 280 },
          bottom: { ...DEFAULT_PANEL_LAYOUT.bottom, state: "collapsed" },
        },
        chrome: DEFAULT_CHROME_PACKS.map((p) => ({ ...p, placement: "topbar" as const })),
        rail: { ...DEFAULT_RAIL_LAYOUT },
        presetId: "review",
      };
    case "canvas":
      return {
        panels: {
          left: { ...DEFAULT_PANEL_LAYOUT.left, state: "collapsed" },
          right: { ...DEFAULT_PANEL_LAYOUT.right, state: "collapsed" },
          bottom: { ...DEFAULT_PANEL_LAYOUT.bottom, state: "collapsed" },
        },
        chrome: DEFAULT_CHROME_PACKS.map((p) =>
          p.id === "history" || p.id === "view"
            ? { ...p, placement: "topbar" as const }
            : { ...p, placement: "overflow" as const },
        ),
        rail: {
          ...DEFAULT_RAIL_LAYOUT,
          state: "floating",
          edge: "left",
          orientation: "vertical",
          x: 16,
          y: 80,
        },
        presetId: "canvas",
      };
    case "floating":
      return {
        panels: {
          left: {
            ...DEFAULT_PANEL_LAYOUT.left,
            state: "floating",
            width: 310,
            height: 420,
            x: 24,
            y: 72,
            zIndex: 100,
          },
          right: {
            ...DEFAULT_PANEL_LAYOUT.right,
            state: "floating",
            width: 290,
            height: 400,
            x: 360,
            y: 72,
            zIndex: 100,
          },
          bottom: {
            ...DEFAULT_PANEL_LAYOUT.bottom,
            state: "floating",
            width: 480,
            height: 220,
            x: 120,
            y: 420,
            zIndex: 100,
          },
        },
        chrome: DEFAULT_CHROME_PACKS.map((p, i) => ({
          ...p,
          placement: "floating" as const,
          x: 24 + i * 140,
          y: 52,
        })),
        rail: {
          ...DEFAULT_RAIL_LAYOUT,
          state: "floating",
          orientation: "horizontal",
          edge: "top",
          x: 200,
          y: 100,
          splitGroups: false,
        },
        presetId: "floating",
      };
    default: {
      const _exhaustive: never = presetId;
      return _exhaustive;
    }
  }
}

export function edgeDropZone(
  clientX: number,
  clientY: number,
  viewportW: number,
  viewportH: number,
  bandPx = 56,
): DockEdge | null {
  if (clientY > viewportH - bandPx) return "bottom";
  if (clientX < bandPx) return "left";
  if (clientX > viewportW - bandPx) return "right";
  return null;
}

export function railSnapFromPoint(
  clientX: number,
  clientY: number,
  viewportW: number,
  bandPx = 56,
): { state: "docked" | "floating"; edge: RailEdge; orientation: RailOrientation } | null {
  if (clientY < bandPx + 48) {
    return { state: "docked", edge: "top", orientation: "horizontal" };
  }
  if (clientX < bandPx) {
    return { state: "docked", edge: "left", orientation: "vertical" };
  }
  if (clientX > viewportW - bandPx) {
    return { state: "floating", edge: "left", orientation: "vertical" };
  }
  return null;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
