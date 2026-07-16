import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  PLANNER_DOCKVIEW_STORAGE_KEY,
  PLANNER_DOCK_MODULE_IDS,
  applyPlannerDockPreset,
  ensurePlannerDockPanel,
  persistDockLayout,
  tryRestoreDockLayout,
} from "@/features/planner/editor/dock/plannerDockPresets";

type FakePanel = { id: string; api: { setActive: ReturnType<typeof vi.fn> } };

function createFakeApi() {
  const panels = new Map<string, FakePanel>();
  const api = {
    panels: [] as FakePanel[],
    clear: vi.fn(() => {
      panels.clear();
      api.panels = [];
    }),
    getPanel: vi.fn((id: string) => panels.get(id)),
    addPanel: vi.fn((opts: { id: string }) => {
      const panel: FakePanel = { id: opts.id, api: { setActive: vi.fn() } };
      panels.set(opts.id, panel);
      api.panels = [...panels.values()];
      return panel;
    }),
    toJSON: vi.fn(() => ({ panels: Object.fromEntries(panels), grid: {} })),
    fromJSON: vi.fn((data: { panels?: Record<string, unknown> }) => {
      panels.clear();
      for (const id of Object.keys(data.panels ?? {})) {
        panels.set(id, { id, api: { setActive: vi.fn() } });
      }
      api.panels = [...panels.values()];
    }),
  };
  return api;
}

describe("plannerDockPresets", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("default preset adds canvas + four chrome modules", () => {
    const api = createFakeApi();
    applyPlannerDockPreset(api as never, "default");
    const ids = api.addPanel.mock.calls.map((c) => c[0].id);
    expect(ids).toContain("canvas");
    for (const id of PLANNER_DOCK_MODULE_IDS) {
      expect(ids).toContain(id);
    }
  });

  it("canvas preset keeps plan + floating tools only", () => {
    const api = createFakeApi();
    applyPlannerDockPreset(api as never, "canvas");
    const ids = api.addPanel.mock.calls.map((c) => c[0].id);
    expect(ids).toEqual(["canvas", "tools"]);
  });

  it("ensurePlannerDockPanel activates existing panel", () => {
    const api = createFakeApi();
    applyPlannerDockPreset(api as never, "default");
    const before = api.addPanel.mock.calls.length;
    ensurePlannerDockPanel(api as never, "inventory");
    expect(api.addPanel.mock.calls.length).toBe(before);
    expect(api.getPanel("inventory")?.api.setActive).toHaveBeenCalled();
  });

  it("ensurePlannerDockPanel re-adds a closed module", () => {
    const api = createFakeApi();
    applyPlannerDockPreset(api as never, "canvas");
    ensurePlannerDockPanel(api as never, "layers");
    expect(api.getPanel("layers")).toBeTruthy();
  });

  it("persists and restores layout JSON", () => {
    const api = createFakeApi();
    applyPlannerDockPreset(api as never, "default");
    persistDockLayout(api as never);
    expect(localStorage.getItem(PLANNER_DOCKVIEW_STORAGE_KEY)).toBeTruthy();

    const next = createFakeApi();
    expect(tryRestoreDockLayout(next as never)).toBe(true);
    expect(next.fromJSON).toHaveBeenCalled();
  });
});
