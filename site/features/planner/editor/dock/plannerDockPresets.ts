import type { DockviewApi } from "dockview-react";

import type { LayoutPresetId } from "../workspaceLayout";

export const PLANNER_DOCKVIEW_STORAGE_KEY = "planner-dockview-layout-v1";

const PANEL_META = {
  canvas: { id: "canvas", component: "canvas", title: "Plan" },
  inventory: { id: "inventory", component: "inventory", title: "Inventory" },
  tools: { id: "tools", component: "tools", title: "Tools" },
  properties: { id: "properties", component: "properties", title: "Properties" },
  layers: { id: "layers", component: "layers", title: "Layers" },
} as const;

/**
 * Build a CAD-like default: tools | inventory | plan | properties, layers below plan.
 */
export function applyPlannerDockPreset(
  api: DockviewApi,
  presetId: LayoutPresetId = "default",
): void {
  api.clear();

  switch (presetId) {
    case "catalog":
      api.addPanel({
        ...PANEL_META.canvas,
        id: PANEL_META.canvas.id,
      });
      api.addPanel({
        ...PANEL_META.inventory,
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 340,
      });
      api.addPanel({
        ...PANEL_META.tools,
        position: { direction: "left", referencePanel: "inventory" },
        initialWidth: 56,
      });
      return;

    case "canvas":
      api.addPanel({
        ...PANEL_META.canvas,
        id: PANEL_META.canvas.id,
      });
      api.addPanel({
        ...PANEL_META.tools,
        floating: { width: 64, height: 420, x: 16, y: 72 },
      });
      return;

    case "floating":
      api.addPanel({
        ...PANEL_META.canvas,
        id: PANEL_META.canvas.id,
      });
      api.addPanel({
        ...PANEL_META.inventory,
        floating: { width: 300, height: 440, x: 24, y: 64 },
      });
      api.addPanel({
        ...PANEL_META.tools,
        floating: { width: 64, height: 400, x: 340, y: 64 },
      });
      api.addPanel({
        ...PANEL_META.properties,
        floating: { width: 280, height: 400, x: 420, y: 64 },
      });
      api.addPanel({
        ...PANEL_META.layers,
        floating: { width: 480, height: 200, x: 120, y: 480 },
      });
      return;

    case "default":
    default:
      api.addPanel({
        ...PANEL_META.canvas,
        id: PANEL_META.canvas.id,
      });
      api.addPanel({
        ...PANEL_META.inventory,
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 280,
      });
      api.addPanel({
        ...PANEL_META.tools,
        position: { direction: "left", referencePanel: "inventory" },
        initialWidth: 56,
      });
      api.addPanel({
        ...PANEL_META.properties,
        position: { direction: "right", referencePanel: "canvas" },
        initialWidth: 260,
      });
      api.addPanel({
        ...PANEL_META.layers,
        position: { direction: "below", referencePanel: "canvas" },
        initialHeight: 180,
        inactive: true,
      });
      return;
  }
}

export function persistDockLayout(api: DockviewApi): void {
  try {
    localStorage.setItem(PLANNER_DOCKVIEW_STORAGE_KEY, JSON.stringify(api.toJSON()));
  } catch {
    /* private mode / quota */
  }
}

export function tryRestoreDockLayout(api: DockviewApi): boolean {
  try {
    const raw = localStorage.getItem(PLANNER_DOCKVIEW_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return false;
    api.fromJSON(parsed as ReturnType<DockviewApi["toJSON"]>);
    return api.panels.length > 0;
  } catch {
    return false;
  }
}
