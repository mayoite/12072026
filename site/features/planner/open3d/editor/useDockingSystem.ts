"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

export type PanelId = "left" | "right" | "bottom";
export type PanelState = "docked" | "floating" | "collapsed";
export type ViewportTier = "desktop" | "tablet" | "small";

interface PanelConfig {
  id: PanelId;
  state: PanelState;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
}

interface DockingSystemState {
  panels: Record<PanelId, PanelConfig>;
  activePanel: PanelId | null;
  focusedPanel: PanelId | null;
  viewportTier: ViewportTier;
}

interface DockingSystemActions {
  dock: (panelId: PanelId) => void;
  undock: (panelId: PanelId) => void;
  toggleCollapse: (panelId: PanelId) => void;
  move: (panelId: PanelId, x: number, y: number) => void;
  resize: (panelId: PanelId, width: number, height: number) => void;
  reset: () => void;
  saveLayout: () => void;
  restoreLayout: () => void;
  setActivePanel: Dispatch<SetStateAction<PanelId | null>>;
  setFocusedPanel: Dispatch<SetStateAction<PanelId | null>>;
}

const STORAGE_KEY = "open3d-workspace-docking";

const DEFAULT_PANEL_CONFIG: Record<PanelId, PanelConfig> = {
  left: {
    id: "left",
    state: "docked",
    width: 310,
    height: 0, // 0 means fill remaining height
    x: 0,
    y: 0,
    zIndex: 55,
  },
  right: {
    id: "right",
    state: "docked",
    width: 290,
    height: 0,
    x: 0,
    y: 0,
    zIndex: 55,
  },
  bottom: {
    id: "bottom",
    state: "collapsed",
    width: 0,
    height: 200,
    x: 0,
    y: 0,
    zIndex: 55,
  },
};

function getViewportTier(): ViewportTier {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "small";
  if (window.innerWidth < 1280) return "tablet";
  return "desktop";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useDockingSystem(): DockingSystemState & DockingSystemActions {
  const [panels, setPanels] = useState<Record<PanelId, PanelConfig>>(DEFAULT_PANEL_CONFIG);
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [focusedPanel, setFocusedPanel] = useState<PanelId | null>(null);
  const [viewportTier, setViewportTier] = useState<ViewportTier>(getViewportTier);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      const newTier = getViewportTier();
      setViewportTier((current) => {
        if (current !== newTier) {
          return newTier;
        }
        return current;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Shared restore parser (consolidates dupe logic from mount + restoreLayout; fixes seam for coverage)
  const parseStoredLayout = (stored: string | null): Record<PanelId, PanelConfig> | null => {
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as Partial<Record<PanelId, PanelConfig>>;
      const restored = { ...DEFAULT_PANEL_CONFIG };
      let hasChanges = false;

      for (const id of Object.keys(parsed) as PanelId[]) {
        if (parsed[id] && DEFAULT_PANEL_CONFIG[id]) {
          // Don't restore collapsed state by default, keep docked
          if (parsed[id]?.state !== "collapsed") {
            restored[id] = { ...DEFAULT_PANEL_CONFIG[id], ...parsed[id] };
            hasChanges = true;
          }
        }
      }

      return hasChanges ? restored : null;
    } catch {
      // Ignore storage errors
      return null;
    }
  };

  // Load persisted layout on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const restored = parseStoredLayout(stored);
    if (restored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- conditional set from localStorage restore on mount; reason: one-time hydration of persisted layout; owner: Resolve Failures Agent (PLAN-FAIL-0411); removal: use useSyncExternalStore or init state from storage when docking system revised
      setPanels(restored);
    }
  }, []);

  const dock = useCallback((panelId: PanelId) => {
    setPanels((current) => ({
      ...current,
      [panelId]: {
        ...current[panelId],
        state: "docked",
        x: 0,
        y: 0,
      },
    }));
  }, []);

  const undock = useCallback((panelId: PanelId) => {
    const defaultWidth = panelId === "left" ? 310 : panelId === "right" ? 290 : 400;
    const defaultHeight = panelId === "bottom" ? 200 : 400;

    setPanels((current) => ({
      ...current,
      [panelId]: {
        ...current[panelId],
        state: "floating",
        width: current[panelId].state === "docked" ? defaultWidth : current[panelId].width,
        height: current[panelId].state === "docked" ? defaultHeight : current[panelId].height,
        x: viewportTier === "small" ? 20 : 100,
        y: viewportTier === "small" ? 80 : 100,
        zIndex: 100,
      },
    }));
  }, [viewportTier]);

  const toggleCollapse = useCallback((panelId: PanelId) => {
    setPanels((current) => ({
      ...current,
      [panelId]: {
        ...current[panelId],
        state: current[panelId].state === "collapsed" ? "docked" : "collapsed",
      },
    }));
  }, []);

  const move = useCallback(
    (panelId: PanelId, x: number, y: number) => {
      setPanels((current) => {
        const panel = current[panelId];
        const maxX = window.innerWidth - panel.width - 20;
        const maxY = window.innerHeight - 120; // Account for topbar

        return {
          ...current,
          [panelId]: {
            ...panel,
            x: clamp(x, 20, maxX),
            y: clamp(y, 60, maxY),
          },
        };
      });
    },
    [],
  );

  const resize = useCallback(
    (panelId: PanelId, width: number, height: number) => {
      const minWidth = 200;
      const minHeight = 150;
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 120;

      setPanels((current) => ({
        ...current,
        [panelId]: {
          ...current[panelId],
          width: clamp(width, minWidth, maxWidth),
          height: clamp(height, minHeight, maxHeight),
        },
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setPanels(DEFAULT_PANEL_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveLayout = useCallback(() => {
    try {
      const toSave: Record<PanelId, PanelConfig> = {} as Record<PanelId, PanelConfig>;
      for (const id of Object.keys(panels) as PanelId[]) {
        // Only save non-collapsed state
        if (panels[id].state !== "collapsed") {
          toSave[id] = panels[id];
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore storage errors
    }
  }, [panels]);

  const restoreLayout = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const restored = parseStoredLayout(stored);
    if (restored) {
      setPanels(restored);
    }
  }, []);

  return {
    panels,
    activePanel,
    focusedPanel,
    viewportTier,
    dock,
    undock,
    toggleCollapse,
    move,
    resize,
    reset,
    saveLayout,
    restoreLayout,
    setActivePanel,
    setFocusedPanel,
  };
}