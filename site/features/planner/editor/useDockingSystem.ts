"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { parsePlannerWorkspacePreferences } from "@/features/planner/store/workspacePreferences";
import {
  patchPlannerWorkspacePreferences,
  PLANNER_WORKSPACE_PREFS_STORAGE_KEY,
} from "@/features/planner/store/workspacePreferencesStorage";

import {
  buildLayoutPreset,
  clamp,
  DEFAULT_CHROME_PACKS,
  DEFAULT_PANEL_LAYOUT,
  DEFAULT_RAIL_LAYOUT,
  edgeDropZone,
  PLANNER_CHROME_PACKS_KEY,
  PLANNER_TOOL_RAIL_DOCK_KEY,
  PLANNER_WORKSPACE_LAYOUT_KEY,
  type ChromePackId,
  type ChromePackLayout,
  type ChromePackPlacement,
  type DockEdge,
  type LayoutPresetId,
  type PanelId,
  type PanelLayoutConfig,
  type PanelState,
  type RailLayoutConfig,
} from "./workspaceLayout";

export type { PanelId, PanelState, DockEdge, LayoutPresetId };
export type PanelConfig = PanelLayoutConfig;

export type ViewportTier = "desktop" | "tablet" | "small";

interface DockingSystemState {
  panels: Record<PanelId, PanelConfig>;
  chrome: ChromePackLayout[];
  rail: RailLayoutConfig;
  presetId: LayoutPresetId | "custom";
  activeDropEdge: DockEdge | null;
  dropActive: boolean;
  activePanel: PanelId | null;
  focusedPanel: PanelId | null;
  viewportTier: ViewportTier;
}

interface DockingSystemActions {
  dock: (panelId: PanelId, edge?: DockEdge) => void;
  undock: (panelId: PanelId, x?: number, y?: number) => void;
  dockToEdge: (panelId: PanelId, edge: DockEdge) => void;
  toggleCollapse: (panelId: PanelId) => void;
  move: (panelId: PanelId, x: number, y: number) => void;
  /** While dragging a floating panel — updates highlight; call with null to clear. */
  setDropProbe: (clientX: number | null, clientY?: number) => void;
  /** Commit drop at last probe or explicit point. Returns edge if docked. */
  commitDrop: (panelId: PanelId, clientX: number, clientY: number) => DockEdge | null;
  resize: (panelId: PanelId, width: number, height: number) => void;
  reset: () => void;
  applyPreset: (presetId: LayoutPresetId) => void;
  setChromePlacement: (
    packId: ChromePackId,
    placement: ChromePackPlacement,
    pos?: { x: number; y: number },
  ) => void;
  moveChromePack: (packId: ChromePackId, x: number, y: number) => void;
  setRailLayout: (patch: Partial<RailLayoutConfig>) => void;
  saveLayout: () => void;
  restoreLayout: () => void;
  setActivePanel: Dispatch<SetStateAction<PanelId | null>>;
  setFocusedPanel: Dispatch<SetStateAction<PanelId | null>>;
}

const STORAGE_KEY = "planner-workspace-docking";
const PREFS_STORAGE_KEY = PLANNER_WORKSPACE_PREFS_STORAGE_KEY;

export const PLANNER_VIEWPORT_BREAKPOINTS = {
  smallMax: 768,
  tabletMax: 1280,
} as const;

export const SSR_VIEWPORT_TIER: ViewportTier = "desktop";

function getViewportTier(): ViewportTier {
  if (typeof window === "undefined") return SSR_VIEWPORT_TIER;
  if (window.innerWidth < PLANNER_VIEWPORT_BREAKPOINTS.smallMax) return "small";
  if (window.innerWidth < PLANNER_VIEWPORT_BREAKPOINTS.tabletMax) return "tablet";
  return "desktop";
}

function getAvailableForPanels(): number {
  if (typeof window === "undefined") return 1000;
  return Math.max(600, window.innerWidth - 120);
}

function ratiosToWidths(ratios: { catalogue: number; properties: number }): {
  left: number;
  right: number;
} {
  const avail = getAvailableForPanels();
  const maxSideRatio = 0.175;
  return {
    left: clamp(Math.round(avail * ratios.catalogue), 200, Math.floor(avail * maxSideRatio)),
    right: clamp(Math.round(avail * ratios.properties), 200, Math.floor(avail * maxSideRatio)),
  };
}

function widthsToRatios(
  leftW: number,
  rightW: number,
): { catalogue: number; properties: number } {
  const avail = getAvailableForPanels();
  const totalRatio = (leftW + rightW) / avail;
  const safe = totalRatio > 0.35 ? 0.35 / totalRatio : 1;
  return {
    catalogue: clamp((leftW / avail) * safe, 0.15, 0.18),
    properties: clamp((rightW / avail) * safe, 0.15, 0.18),
  };
}

function normalizePanel(
  id: PanelId,
  raw: Partial<PanelConfig> | undefined,
): PanelConfig {
  const base = DEFAULT_PANEL_LAYOUT[id];
  const merged = { ...base, ...raw, id };
  if (id === "bottom") {
    merged.dockEdge = "bottom";
  } else if (merged.dockEdge !== "left" && merged.dockEdge !== "right") {
    merged.dockEdge = id === "left" ? "left" : "right";
  }
  return merged;
}

function parseStoredPanels(stored: string | null): Record<PanelId, PanelConfig> | null {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Partial<Record<PanelId, PanelConfig>>;
    const restored = {
      left: normalizePanel("left", parsed.left),
      right: normalizePanel("right", parsed.right),
      bottom: normalizePanel("bottom", parsed.bottom),
    };
    let hasChanges = false;
    for (const id of Object.keys(parsed) as PanelId[]) {
      if (parsed[id] && parsed[id]?.state !== "collapsed") {
        hasChanges = true;
      }
    }
    return hasChanges ? restored : null;
  } catch {
    return null;
  }
}

function readChrome(): ChromePackLayout[] {
  if (typeof window === "undefined") return DEFAULT_CHROME_PACKS.map((p) => ({ ...p }));
  try {
    const raw = localStorage.getItem(PLANNER_CHROME_PACKS_KEY);
    if (!raw) return DEFAULT_CHROME_PACKS.map((p) => ({ ...p }));
    const parsed = JSON.parse(raw) as ChromePackLayout[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_CHROME_PACKS.map((p) => ({ ...p }));
    }
    const byId = new Map(parsed.map((p) => [p.id, p]));
    return DEFAULT_CHROME_PACKS.map((def) => {
      const hit = byId.get(def.id);
      return hit
        ? {
            ...def,
            ...hit,
            id: def.id,
            placement:
              hit.placement === "floating" ||
              hit.placement === "overflow" ||
              hit.placement === "topbar"
                ? hit.placement
                : def.placement,
          }
        : { ...def };
    });
  } catch {
    return DEFAULT_CHROME_PACKS.map((p) => ({ ...p }));
  }
}

function readRail(): RailLayoutConfig {
  if (typeof window === "undefined") return { ...DEFAULT_RAIL_LAYOUT };
  try {
    const raw = localStorage.getItem(PLANNER_TOOL_RAIL_DOCK_KEY);
    if (!raw) return { ...DEFAULT_RAIL_LAYOUT };
    const parsed = JSON.parse(raw) as Partial<RailLayoutConfig>;
    return {
      ...DEFAULT_RAIL_LAYOUT,
      ...parsed,
      state: parsed.state === "floating" ? "floating" : "docked",
      edge: parsed.edge === "top" ? "top" : "left",
      orientation: parsed.orientation === "horizontal" ? "horizontal" : "vertical",
      splitGroups: Boolean(parsed.splitGroups),
      x: typeof parsed.x === "number" ? parsed.x : DEFAULT_RAIL_LAYOUT.x,
      y: typeof parsed.y === "number" ? parsed.y : DEFAULT_RAIL_LAYOUT.y,
    };
  } catch {
    return { ...DEFAULT_RAIL_LAYOUT };
  }
}

function readInitialPanels(): Record<PanelId, PanelConfig> {
  if (typeof window === "undefined") return { ...DEFAULT_PANEL_LAYOUT };
  try {
    const v2 = localStorage.getItem(PLANNER_WORKSPACE_LAYOUT_KEY);
    if (v2) {
      const snap = JSON.parse(v2) as { panels?: Record<PanelId, PanelConfig> };
      if (snap.panels) {
        return {
          left: normalizePanel("left", snap.panels.left),
          right: normalizePanel("right", snap.panels.right),
          bottom: normalizePanel("bottom", snap.panels.bottom),
        };
      }
    }
    const restored = parseStoredPanels(localStorage.getItem(STORAGE_KEY));
    if (restored) return restored;
    const prefsRaw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (prefsRaw) {
      const prefs = parsePlannerWorkspacePreferences(JSON.parse(prefsRaw));
      const ws = ratiosToWidths(prefs.panelRatios);
      return {
        ...DEFAULT_PANEL_LAYOUT,
        left: { ...DEFAULT_PANEL_LAYOUT.left, width: ws.left },
        right: { ...DEFAULT_PANEL_LAYOUT.right, width: ws.right },
      };
    }
  } catch {
    /* ignore */
  }
  return {
    left: { ...DEFAULT_PANEL_LAYOUT.left },
    right: { ...DEFAULT_PANEL_LAYOUT.right },
    bottom: { ...DEFAULT_PANEL_LAYOUT.bottom },
  };
}

function allowedEdgesFor(panelId: PanelId): DockEdge[] {
  if (panelId === "bottom") return ["bottom"];
  return ["left", "right"];
}

/**
 * When docking panel A to an edge occupied by docked panel B, swap edges
 * (side panels) or leave B floating if edges are incompatible.
 */
function resolveEdgeConflict(
  panels: Record<PanelId, PanelConfig>,
  panelId: PanelId,
  edge: DockEdge,
): Record<PanelId, PanelConfig> {
  const next = {
    left: { ...panels.left },
    right: { ...panels.right },
    bottom: { ...panels.bottom },
  };

  next[panelId] = {
    ...next[panelId],
    state: "docked",
    dockEdge: edge,
    x: 0,
    y: 0,
  };

  for (const otherId of Object.keys(next) as PanelId[]) {
    if (otherId === panelId) continue;
    const other = next[otherId];
    if (other.state !== "docked") continue;
    if (other.dockEdge !== edge) continue;

    if (edge === "bottom") {
      next[otherId] = {
        ...other,
        state: "floating",
        width: other.width || 400,
        height: other.height || 200,
        x: 120,
        y: 360,
        zIndex: 100,
      };
      continue;
    }

    // Swap side edges
    const previousEdge = panels[panelId].dockEdge;
    const swapTo: DockEdge =
      previousEdge === "left" || previousEdge === "right"
        ? previousEdge === edge
          ? edge === "left"
            ? "right"
            : "left"
          : previousEdge
        : edge === "left"
          ? "right"
          : "left";

    if (allowedEdgesFor(otherId).includes(swapTo) && swapTo !== edge) {
      next[otherId] = { ...other, dockEdge: swapTo };
    } else {
      next[otherId] = {
        ...other,
        state: "floating",
        width: other.width || 290,
        height: other.height || 400,
        x: 100,
        y: 100,
        zIndex: 100,
      };
    }
  }

  return next;
}

export function useDockingSystem(): DockingSystemState & DockingSystemActions {
  const [panels, setPanels] = useState<Record<PanelId, PanelConfig>>(readInitialPanels);
  const [chrome, setChrome] = useState<ChromePackLayout[]>(readChrome);
  const [rail, setRail] = useState<RailLayoutConfig>(readRail);
  const [presetId, setPresetId] = useState<LayoutPresetId | "custom">("custom");
  const [activeDropEdge, setActiveDropEdge] = useState<DockEdge | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [focusedPanel, setFocusedPanel] = useState<PanelId | null>(null);
  const [viewportTier, setViewportTier] = useState<ViewportTier>(SSR_VIEWPORT_TIER);

  useEffect(() => {
    const applyTier = () => {
      const newTier = getViewportTier();
      setViewportTier((current) => (current !== newTier ? newTier : current));
    };
    applyTier();
    window.addEventListener("resize", applyTier);
    return () => window.removeEventListener("resize", applyTier);
  }, []);

  const markCustom = useCallback(() => setPresetId("custom"), []);

  const dockToEdge = useCallback(
    (panelId: PanelId, edge: DockEdge) => {
      const allowed = allowedEdgesFor(panelId);
      const target = allowed.includes(edge) ? edge : allowed[0];
      setPanels((current) => resolveEdgeConflict(current, panelId, target));
      setActiveDropEdge(null);
      markCustom();
    },
    [markCustom],
  );

  const dock = useCallback(
    (panelId: PanelId, edge?: DockEdge) => {
      setPanels((current) => {
        const target =
          edge && allowedEdgesFor(panelId).includes(edge)
            ? edge
            : current[panelId].dockEdge;
        return resolveEdgeConflict(current, panelId, target);
      });
      setActiveDropEdge(null);
      markCustom();
    },
    [markCustom],
  );

  const undock = useCallback(
    (panelId: PanelId, x?: number, y?: number) => {
      const defaultWidth = panelId === "left" ? 310 : panelId === "right" ? 290 : 400;
      const defaultHeight = panelId === "bottom" ? 200 : 400;

      setPanels((current) => ({
        ...current,
        [panelId]: {
          ...current[panelId],
          state: "floating",
          width:
            current[panelId].state === "docked" ? defaultWidth : current[panelId].width,
          height:
            current[panelId].state === "docked"
              ? defaultHeight
              : current[panelId].height,
          x: typeof x === "number" ? x : viewportTier === "small" ? 20 : 100,
          y: typeof y === "number" ? y : viewportTier === "small" ? 80 : 100,
          zIndex: 100,
        },
      }));
      markCustom();
    },
    [viewportTier, markCustom],
  );

  const toggleCollapse = useCallback(
    (panelId: PanelId) => {
      setPanels((current) => {
        const isOpening = current[panelId].state === "collapsed";
        const nextState: PanelState = isOpening ? "docked" : "collapsed";

        const nextPanels = {
          ...current,
          [panelId]: {
            ...current[panelId],
            state: nextState,
          },
        };

        if (isOpening && viewportTier === "small") {
          const otherPanelId = panelId === "left" ? "right" : "left";
          if (nextPanels[otherPanelId]) {
            nextPanels[otherPanelId] = {
              ...nextPanels[otherPanelId],
              state: "collapsed",
            };
          }
        }

        return nextPanels;
      });
      markCustom();
    },
    [viewportTier, markCustom],
  );

  const move = useCallback(
    (panelId: PanelId, x: number, y: number) => {
      setPanels((current) => {
        const panel = current[panelId];
        const maxX = window.innerWidth - panel.width - 20;
        const maxY = window.innerHeight - 120;

        return {
          ...current,
          [panelId]: {
            ...panel,
            x: clamp(x, 8, maxX),
            y: clamp(y, 48, maxY),
          },
        };
      });
      markCustom();
    },
    [markCustom],
  );

  const setDropProbe = useCallback((clientX: number | null, clientY?: number) => {
    if (clientX === null || typeof clientY !== "number") {
      setActiveDropEdge(null);
      setDropActive(false);
      return;
    }
    setDropActive(true);
    setActiveDropEdge(edgeDropZone(clientX, clientY, window.innerWidth, window.innerHeight));
  }, []);

  const commitDrop = useCallback(
    (panelId: PanelId, clientX: number, clientY: number): DockEdge | null => {
      const edge = edgeDropZone(clientX, clientY, window.innerWidth, window.innerHeight);
      setActiveDropEdge(null);
      setDropActive(false);
      if (!edge) return null;
      if (!allowedEdgesFor(panelId).includes(edge)) {
        return null;
      }
      dockToEdge(panelId, edge);
      return edge;
    },
    [dockToEdge],
  );

  const resize = useCallback(
    (panelId: PanelId, width: number, height: number) => {
      const minWidth = 200;
      const minHeight = 150;
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 120;

      setPanels((current) => {
        let nextW = clamp(width, minWidth, maxWidth);
        const nextH = clamp(height, minHeight, maxHeight);
        const avail = Math.max(600, window.innerWidth - 120);
        const other =
          panelId === "left"
            ? current.right.width
            : panelId === "right"
              ? current.left.width
              : 0;
        const thisSide = panelId === "left" || panelId === "right" ? nextW : 0;
        if (thisSide + other > avail * 0.35) {
          nextW = Math.max(200, Math.floor(avail * 0.35 - other));
        }
        const next = {
          ...current,
          [panelId]: {
            ...current[panelId],
            width: nextW,
            height: nextH,
          },
        };
        try {
          const ratios = widthsToRatios(next.left.width, next.right.width);
          patchPlannerWorkspacePreferences({ panelRatios: ratios });
        } catch {
          /* ignore */
        }
        return next;
      });
      markCustom();
    },
    [markCustom],
  );

  const applyPreset = useCallback((id: LayoutPresetId) => {
    const snap = buildLayoutPreset(id);
    setPanels(snap.panels);
    setChrome(snap.chrome);
    setRail(snap.rail);
    setPresetId(id);
    setActiveDropEdge(null);
    try {
      localStorage.setItem(PLANNER_WORKSPACE_LAYOUT_KEY, JSON.stringify(snap));
      localStorage.setItem(PLANNER_CHROME_PACKS_KEY, JSON.stringify(snap.chrome));
      localStorage.setItem(PLANNER_TOOL_RAIL_DOCK_KEY, JSON.stringify(snap.rail));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snap.panels));
    } catch {
      /* ignore */
    }
  }, []);

  const reset = useCallback(() => {
    applyPreset("default");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [applyPreset]);

  const setChromePlacement = useCallback(
    (
      packId: ChromePackId,
      placement: ChromePackPlacement,
      pos?: { x: number; y: number },
    ) => {
      setChrome((current) =>
        current.map((pack) =>
          pack.id === packId
            ? {
                ...pack,
                placement,
                x: pos?.x ?? pack.x,
                y: pos?.y ?? pack.y,
              }
            : pack,
        ),
      );
      markCustom();
    },
    [markCustom],
  );

  const moveChromePack = useCallback(
    (packId: ChromePackId, x: number, y: number) => {
      setChrome((current) =>
        current.map((pack) =>
          pack.id === packId
            ? { ...pack, x: clamp(x, 8, window.innerWidth - 80), y: clamp(y, 40, window.innerHeight - 80) }
            : pack,
        ),
      );
      markCustom();
    },
    [markCustom],
  );

  const setRailLayout = useCallback(
    (patch: Partial<RailLayoutConfig>) => {
      setRail((current) => {
        const next = { ...current, ...patch };
        try {
          localStorage.setItem(PLANNER_TOOL_RAIL_DOCK_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      markCustom();
    },
    [markCustom],
  );

  const saveLayout = useCallback(() => {
    try {
      const toSave: Record<PanelId, PanelConfig> = {} as Record<PanelId, PanelConfig>;
      for (const id of Object.keys(panels) as PanelId[]) {
        if (panels[id].state !== "collapsed") {
          toSave[id] = panels[id];
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      localStorage.setItem(PLANNER_CHROME_PACKS_KEY, JSON.stringify(chrome));
      localStorage.setItem(PLANNER_TOOL_RAIL_DOCK_KEY, JSON.stringify(rail));
      localStorage.setItem(
        PLANNER_WORKSPACE_LAYOUT_KEY,
        JSON.stringify({ panels, chrome, rail, presetId }),
      );
      const ratios = widthsToRatios(panels.left.width, panels.right.width);
      patchPlannerWorkspacePreferences({ panelRatios: ratios });
    } catch {
      /* ignore */
    }
  }, [panels, chrome, rail, presetId]);

  const restoreLayout = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const restored = parseStoredPanels(stored);
    if (restored) setPanels(restored);
    setChrome(readChrome());
    setRail(readRail());
  }, []);

  return {
    panels,
    chrome,
    rail,
    presetId,
    activeDropEdge,
    dropActive,
    activePanel,
    focusedPanel,
    viewportTier,
    dock,
    undock,
    dockToEdge,
    toggleCollapse,
    move,
    setDropProbe,
    commitDrop,
    resize,
    reset,
    applyPreset,
    setChromePlacement,
    moveChromePack,
    setRailLayout,
    saveLayout,
    restoreLayout,
    setActivePanel,
    setFocusedPanel,
  };
}
