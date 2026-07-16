import type { DockviewApi } from "dockview-react";

import type { LayoutPresetId } from "../workspaceLayout";

export const PLANNER_DOCKVIEW_STORAGE_KEY = "planner-dockview-layout-v2";

export type PlannerDockPanelId =
  | "canvas"
  | "inventory"
  | "tools"
  | "properties"
  | "layers";

const PANEL_META: Record<
  PlannerDockPanelId,
  { id: PlannerDockPanelId; component: PlannerDockPanelId; title: string }
> = {
  canvas: { id: "canvas", component: "canvas", title: "Plan" },
  inventory: { id: "inventory", component: "inventory", title: "Inventory" },
  tools: { id: "tools", component: "tools", title: "Tools" },
  properties: { id: "properties", component: "properties", title: "Properties" },
  layers: { id: "layers", component: "layers", title: "Layers" },
};

export const PLANNER_DOCK_MODULE_IDS: Exclude<PlannerDockPanelId, "canvas">[] = [
  "inventory",
  "tools",
  "properties",
  "layers",
];

function addCanvas(api: DockviewApi): void {
  api.addPanel({
    ...PANEL_META.canvas,
    id: PANEL_META.canvas.id,
    minimumWidth: 320,
    minimumHeight: 240,
  });
}

/**
 * Re-open a module if the user closed its tab. Canvas is always restored as center.
 */
export function ensurePlannerDockPanel(
  api: DockviewApi,
  panelId: PlannerDockPanelId,
): void {
  const existing = api.getPanel(panelId);
  if (existing) {
    existing.api.setActive();
    return;
  }

  if (panelId === "canvas") {
    addCanvas(api);
    return;
  }

  if (!api.getPanel("canvas")) {
    addCanvas(api);
  }

  const meta = PANEL_META[panelId];
  switch (panelId) {
    case "inventory":
      api.addPanel({
        ...meta,
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 300,
      });
      return;
    case "tools":
      api.addPanel({
        ...meta,
        position: {
          direction: "left",
          referencePanel: api.getPanel("inventory") ? "inventory" : "canvas",
        },
        initialWidth: 64,
      });
      return;
    case "properties":
      api.addPanel({
        ...meta,
        position: { direction: "right", referencePanel: "canvas" },
        initialWidth: 288,
      });
      return;
    case "layers":
      api.addPanel({
        ...meta,
        position: { direction: "below", referencePanel: "canvas" },
        initialHeight: 160,
      });
      return;
    default: {
      const _exhaustive: never = panelId;
      return _exhaustive;
    }
  }
}

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
      addCanvas(api);
      api.addPanel({
        ...PANEL_META.inventory,
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 360,
      });
      api.addPanel({
        ...PANEL_META.tools,
        position: { direction: "left", referencePanel: "inventory" },
        initialWidth: 64,
      });
      return;

    case "canvas":
      addCanvas(api);
      api.addPanel({
        ...PANEL_META.tools,
        floating: { width: 72, height: 420, x: 16, y: 72 },
      });
      return;

    case "floating":
      addCanvas(api);
      api.addPanel({
        ...PANEL_META.inventory,
        floating: { width: 320, height: 440, x: 24, y: 64 },
      });
      api.addPanel({
        ...PANEL_META.tools,
        floating: { width: 72, height: 400, x: 360, y: 64 },
      });
      api.addPanel({
        ...PANEL_META.properties,
        floating: { width: 288, height: 400, x: 450, y: 64 },
      });
      api.addPanel({
        ...PANEL_META.layers,
        floating: { width: 480, height: 180, x: 120, y: 500 },
      });
      return;

    case "default":
    default:
      addCanvas(api);
      api.addPanel({
        ...PANEL_META.inventory,
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 300,
      });
      api.addPanel({
        ...PANEL_META.tools,
        position: { direction: "left", referencePanel: "inventory" },
        initialWidth: 64,
      });
      api.addPanel({
        ...PANEL_META.properties,
        position: { direction: "right", referencePanel: "canvas" },
        initialWidth: 288,
      });
      api.addPanel({
        ...PANEL_META.layers,
        position: { direction: "below", referencePanel: "canvas" },
        initialHeight: 160,
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
    if (!api.getPanel("canvas")) {
      addCanvas(api);
    }
    return api.panels.length > 0;
  } catch {
    return false;
  }
}
