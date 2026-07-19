"use client";

import { useCallback, useMemo, useReducer } from "react";

/**
 * Dock layout state for the Studio shell.
 *
 * Panels are assigned to a zone (left / right / bottom around the always-present
 * canvas) and can be collapsed (header-only) or hidden (removed from layout).
 * This hook is the single source of truth; StudioShell renders from it and
 * exposes an imperative handle (showPanel / hidePanel / movePanel / …) that
 * dispatches these same actions. Consumers that drive layout from app state
 * (e.g. the planner's step + selection) use that handle.
 */

export type DockZoneId = "left" | "right" | "bottom";

export interface StudioPanelDef {
  readonly id: string;
  readonly title: string;
  /** Zone the panel starts in and returns to on reset. */
  readonly defaultZone: DockZoneId;
  /** Whether the panel can be collapsed to a header. Defaults to true. */
  readonly collapsible?: boolean;
  /** Start collapsed. Defaults to false. */
  readonly defaultCollapsed?: boolean;
  /** Start hidden (not shown until showPanel). Defaults to false. */
  readonly defaultHidden?: boolean;
}

export interface PanelLayoutState {
  readonly zone: DockZoneId;
  readonly collapsed: boolean;
  readonly hidden: boolean;
}

export type DockLayout = Readonly<Record<string, PanelLayoutState>>;

/** Partial per-panel patch used by applyArrangement. */
export type DockArrangement = Readonly<
  Record<string, Partial<PanelLayoutState>>
>;

type Action =
  | { type: "show"; id: string }
  | { type: "hide"; id: string }
  | { type: "toggleCollapse"; id: string }
  | { type: "setCollapsed"; id: string; collapsed: boolean }
  | { type: "move"; id: string; zone: DockZoneId }
  | { type: "apply"; arrangement: DockArrangement }
  | { type: "reset"; initial: DockLayout };

function buildInitial(panels: readonly StudioPanelDef[]): DockLayout {
  const next: Record<string, PanelLayoutState> = {};
  for (const panel of panels) {
    next[panel.id] = {
      zone: panel.defaultZone,
      collapsed: panel.defaultCollapsed ?? false,
      hidden: panel.defaultHidden ?? false,
    };
  }
  return next;
}

function reducer(state: DockLayout, action: Action): DockLayout {
  switch (action.type) {
    case "show": {
      const cur = state[action.id];
      if (!cur || (!cur.hidden && !cur.collapsed)) return state;
      return { ...state, [action.id]: { ...cur, hidden: false, collapsed: false } };
    }
    case "hide": {
      const cur = state[action.id];
      if (!cur || cur.hidden) return state;
      return { ...state, [action.id]: { ...cur, hidden: true } };
    }
    case "toggleCollapse": {
      const cur = state[action.id];
      if (!cur) return state;
      return { ...state, [action.id]: { ...cur, collapsed: !cur.collapsed } };
    }
    case "setCollapsed": {
      const cur = state[action.id];
      if (!cur || cur.collapsed === action.collapsed) return state;
      return { ...state, [action.id]: { ...cur, collapsed: action.collapsed } };
    }
    case "move": {
      const cur = state[action.id];
      if (!cur || cur.zone === action.zone) return state;
      // Moving a panel implies making it visible.
      return {
        ...state,
        [action.id]: { ...cur, zone: action.zone, hidden: false },
      };
    }
    case "apply": {
      let changed = false;
      const next: Record<string, PanelLayoutState> = { ...state };
      for (const [id, patch] of Object.entries(action.arrangement)) {
        const cur = state[id];
        if (!cur) continue;
        const merged = { ...cur, ...patch };
        if (
          merged.zone !== cur.zone ||
          merged.collapsed !== cur.collapsed ||
          merged.hidden !== cur.hidden
        ) {
          next[id] = merged;
          changed = true;
        }
      }
      return changed ? next : state;
    }
    case "reset":
      return action.initial;
    default:
      return state;
  }
}

export interface DockLayoutController {
  readonly layout: DockLayout;
  showPanel: (id: string) => void;
  hidePanel: (id: string) => void;
  toggleCollapse: (id: string) => void;
  setCollapsed: (id: string, collapsed: boolean) => void;
  movePanel: (id: string, zone: DockZoneId) => void;
  applyArrangement: (arrangement: DockArrangement) => void;
  resetArrangement: () => void;
}

export function useDockLayout(
  panels: readonly StudioPanelDef[],
): DockLayoutController {
  // Recompute the reset target when the panel set changes identity.
  const initial = useMemo(() => buildInitial(panels), [panels]);
  const [layout, dispatch] = useReducer(reducer, initial);

  const showPanel = useCallback((id: string) => dispatch({ type: "show", id }), []);
  const hidePanel = useCallback((id: string) => dispatch({ type: "hide", id }), []);
  const toggleCollapse = useCallback(
    (id: string) => dispatch({ type: "toggleCollapse", id }),
    [],
  );
  const setCollapsed = useCallback(
    (id: string, collapsed: boolean) =>
      dispatch({ type: "setCollapsed", id, collapsed }),
    [],
  );
  const movePanel = useCallback(
    (id: string, zone: DockZoneId) => dispatch({ type: "move", id, zone }),
    [],
  );
  const applyArrangement = useCallback(
    (arrangement: DockArrangement) => dispatch({ type: "apply", arrangement }),
    [],
  );
  const resetArrangement = useCallback(
    () => dispatch({ type: "reset", initial }),
    [initial],
  );

  return {
    layout,
    showPanel,
    hidePanel,
    toggleCollapse,
    setCollapsed,
    movePanel,
    applyArrangement,
    resetArrangement,
  };
}
