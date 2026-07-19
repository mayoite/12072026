import type { DockviewApi } from "dockview-react";

export const ADMIN_SVG_FACTORY_DOCK_STORAGE_KEY =
  "admin-svg-factory-dock-layout";
export const ADMIN_SVG_FACTORY_DOCK_SCHEMA_VERSION = 2;

const FACTORY_PANEL_IDS = new Set(["tools", "properties", "canvas"]);

type PersistedFactoryLayout = {
  readonly schemaVersion: typeof ADMIN_SVG_FACTORY_DOCK_SCHEMA_VERSION;
  readonly layout: ReturnType<DockviewApi["toJSON"]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFactoryLayout(value: unknown): value is PersistedFactoryLayout {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== ADMIN_SVG_FACTORY_DOCK_SCHEMA_VERSION) return false;
  if (!isRecord(value.layout) || !isRecord(value.layout.panels)) return false;
  const ids = Object.keys(value.layout.panels);
  return (
    ids.includes("canvas") &&
    ids.length > 0 &&
    ids.every((id) => FACTORY_PANEL_IDS.has(id))
  );
}

export function seedAdminSvgFactoryLayout(api: DockviewApi): void {
  if (api.panels.length > 0) return;
  api.addPanel({
    id: "canvas",
    component: "canvas",
    title: "Canvas",
    minimumWidth: 480,
    minimumHeight: 320,
  });
  api.addPanel({
    id: "properties",
    component: "properties",
    title: "Properties",
    position: { referencePanel: "canvas", direction: "left" },
    initialWidth: 260,
    minimumWidth: 240,
  });
  api.addPanel({
    id: "tools",
    component: "tools",
    title: "Tools",
    position: { referencePanel: "properties", direction: "left" },
    initialWidth: 208,
    minimumWidth: 200,
  });
}

export function persistAdminSvgFactoryLayout(api: DockviewApi): void {
  try {
    const value: PersistedFactoryLayout = {
      schemaVersion: ADMIN_SVG_FACTORY_DOCK_SCHEMA_VERSION,
      layout: api.toJSON(),
    };
    localStorage.setItem(ADMIN_SVG_FACTORY_DOCK_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function tryRestoreAdminSvgFactoryLayout(api: DockviewApi): boolean {
  try {
    const raw = localStorage.getItem(ADMIN_SVG_FACTORY_DOCK_STORAGE_KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    if (!isFactoryLayout(parsed)) {
      localStorage.removeItem(ADMIN_SVG_FACTORY_DOCK_STORAGE_KEY);
      return false;
    }
    api.fromJSON(parsed.layout);
    return Boolean(api.getPanel("canvas"));
  } catch {
    localStorage.removeItem(ADMIN_SVG_FACTORY_DOCK_STORAGE_KEY);
    return false;
  }
}
