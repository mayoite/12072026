import type { DockviewApi } from "dockview-react";

import type { LayoutPresetId } from "../workspaceLayout";

export const PLANNER_DOCKVIEW_STORAGE_KEY = "planner-dockview-layout";
export const PLANNER_DOCKVIEW_SCHEMA_VERSION = 1;

const LEGACY_DOCKVIEW_STORAGE_KEYS = [
  "planner-dockview-layout-v4",
  "planner-dockview-layout-v5",
] as const;

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

const PLANNER_DOCK_PANEL_IDS = new Set<PlannerDockPanelId>([
  "canvas",
  ...PLANNER_DOCK_MODULE_IDS,
]);

type PersistedPlannerDockLayout = {
  readonly schemaVersion: typeof PLANNER_DOCKVIEW_SCHEMA_VERSION;
  readonly layout: ReturnType<DockviewApi["toJSON"]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSupportedDockLayout(value: unknown): value is PersistedPlannerDockLayout {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== PLANNER_DOCKVIEW_SCHEMA_VERSION) return false;
  if (!isRecord(value.layout) || !isRecord(value.layout.panels)) return false;

  const panelIds = Object.keys(value.layout.panels);
  return (
    panelIds.length > 0 &&
    panelIds.every((panelId) => PLANNER_DOCK_PANEL_IDS.has(panelId as PlannerDockPanelId))
  );
}

export function clearPersistedDockLayout(): void {
  try {
    localStorage.removeItem(PLANNER_DOCKVIEW_STORAGE_KEY);
    for (const key of LEGACY_DOCKVIEW_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    /* private mode / blocked storage */
  }
}

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
        initialWidth: 288,
      });
      return;
    case "tools":
      api.addPanel({
        ...meta,
        position: {
          direction: "left",
          referencePanel: "canvas",
        },
        initialWidth: 76,
        minimumWidth: 68,
      });
      return;
    case "properties":
      api.addPanel({
        ...meta,
        position: { direction: "right", referencePanel: "canvas" },
        initialWidth: 268,
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
 * Build a canvas-first CAD default. Context panels stay available from Panels
 * without permanently reducing the drawing area.
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
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 76,
        minimumWidth: 68,
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
        ...PANEL_META.tools,
        position: { direction: "left", referencePanel: "canvas" },
        initialWidth: 76,
        minimumWidth: 68,
      });
      return;
  }
}

export function persistDockLayout(api: DockviewApi): void {
  try {
    const persisted: PersistedPlannerDockLayout = {
      schemaVersion: PLANNER_DOCKVIEW_SCHEMA_VERSION,
      layout: api.toJSON(),
    };
    localStorage.setItem(PLANNER_DOCKVIEW_STORAGE_KEY, JSON.stringify(persisted));
    for (const key of LEGACY_DOCKVIEW_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    /* private mode / quota */
  }
}

export function tryRestoreDockLayout(api: DockviewApi): boolean {
  try {
    for (const key of LEGACY_DOCKVIEW_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
    const raw = localStorage.getItem(PLANNER_DOCKVIEW_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as unknown;
    if (!isSupportedDockLayout(parsed)) {
      clearPersistedDockLayout();
      return false;
    }
    api.fromJSON(parsed.layout);
    if (!api.getPanel("canvas")) {
      addCanvas(api);
    }
    return api.panels.length > 0;
  } catch {
    clearPersistedDockLayout();
    return false;
  }
}
