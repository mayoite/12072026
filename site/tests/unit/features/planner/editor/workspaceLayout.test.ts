// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  buildLayoutPreset,
  clamp,
  DEFAULT_PANEL_LAYOUT,
  edgeDropZone,
  LAYOUT_PRESET_LABELS,
  PLANNER_WORKSPACE_LAYOUT_KEY,
  railSnapFromPoint,
} from "@/features/planner/editor/workspaceLayout";

describe("workspaceLayout (name-mirror)", () => {
  it("exposes stable storage keys and labeled presets", () => {
    expect(PLANNER_WORKSPACE_LAYOUT_KEY).toBe("planner-workspace-layout-v2");
    expect(LAYOUT_PRESET_LABELS.default).toBe("Default");
    expect(LAYOUT_PRESET_LABELS.catalog).toMatch(/catalog/i);
    expect(LAYOUT_PRESET_LABELS.canvas).toMatch(/canvas/i);
  });

  it("builds default and canvas presets with isolated panel clones", () => {
    const def = buildLayoutPreset("default");
    expect(def.presetId).toBe("default");
    expect(def.panels.left.state).toBe("docked");
    expect(def.panels.left.width).toBe(DEFAULT_PANEL_LAYOUT.left.width);
    def.panels.left.width = 999;
    expect(DEFAULT_PANEL_LAYOUT.left.width).not.toBe(999);

    const canvas = buildLayoutPreset("canvas");
    expect(canvas.presetId).toBe("canvas");
    expect(canvas.panels.left.state).toBe("collapsed");
    expect(canvas.panels.right.state).toBe("collapsed");
    expect(canvas.panels.bottom.state).toBe("collapsed");
    expect(canvas.rail.state).toBe("floating");
    expect(canvas.chrome.some((c) => c.placement === "overflow")).toBe(true);
  });

  it("maps catalog and floating presets to expected focus modes", () => {
    const catalog = buildLayoutPreset("catalog");
    expect(catalog.panels.left.width).toBe(320);
    expect(catalog.panels.right.state).toBe("collapsed");

    const floating = buildLayoutPreset("floating");
    expect(floating.panels.left.state).toBe("floating");
    expect(floating.panels.right.state).toBe("floating");
    expect(floating.panels.bottom.state).toBe("floating");
    expect(floating.chrome.every((c) => c.placement === "floating")).toBe(true);
    expect(floating.rail.orientation).toBe("horizontal");
  });

  it("detects dock edges and rail snaps from pointer bands", () => {
    expect(edgeDropZone(10, 100, 1000, 800)).toBe("left");
    expect(edgeDropZone(990, 100, 1000, 800)).toBe("right");
    expect(edgeDropZone(500, 790, 1000, 800)).toBe("bottom");
    expect(edgeDropZone(500, 400, 1000, 800)).toBeNull();

    expect(railSnapFromPoint(10, 200, 1000)).toEqual({
      state: "docked",
      edge: "left",
      orientation: "vertical",
    });
    expect(railSnapFromPoint(500, 20, 1000)).toEqual({
      state: "docked",
      edge: "top",
      orientation: "horizontal",
    });
    expect(railSnapFromPoint(990, 200, 1000)?.state).toBe("floating");
    expect(railSnapFromPoint(500, 400, 1000)).toBeNull();
  });

  it("clamps numeric values into range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});
