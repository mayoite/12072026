import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  readPlannerChromeLayout,
  readPlannerChromeDockPlacement,
  writePlannerChromeLayout,
  writePlannerChromeDockPlacement,
  resetPlannerChromeLayout,
  LEGACY_PLANNER_CHROME_DOCK_STORAGE_KEY,
  PLANNER_CHROME_LAYOUT_STORAGE_KEY,
} from "@/features/planner/editor/chrome/plannerChromeStorage";
import { PLANNER_CHROME_DEFAULTS } from "@/features/planner/editor/chrome/plannerChromeLayout";

describe("plannerChromeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("readPlannerChromeLayout", () => {
    it("returns defaults when no storage values exist", () => {
      expect(readPlannerChromeLayout()).toEqual(PLANNER_CHROME_DEFAULTS);
    });

    it("falls back to legacy storage if new layout does not exist", () => {
      localStorage.setItem(
        LEGACY_PLANNER_CHROME_DOCK_STORAGE_KEY,
        JSON.stringify({
          tools: { edge: "right", offset: 0.2 },
          steps: { edge: "bottom", offset: 0.8 },
          "panel-left": { edge: "left", offset: 0.1 },
        })
      );

      const layout = readPlannerChromeLayout();
      expect(layout.tools).toEqual({ edge: "right", offset: 0.2 });
      expect(layout.steps).toEqual({ edge: "bottom", offset: 0.8 });
      expect(layout.access).toEqual({ edge: "left", offset: 0.1 });
    });

    it("reads new layout layout key if version is 2", () => {
      const payload = {
        version: 2,
        placements: {
          tools: { edge: "free", x: 0.3, y: 0.4 },
          steps: { edge: "top", offset: 0.6 },
          access: { edge: "left", offset: 0.2 },
        },
      };
      localStorage.setItem(PLANNER_CHROME_LAYOUT_STORAGE_KEY, JSON.stringify(payload));

      const layout = readPlannerChromeLayout();
      expect(layout.tools).toEqual({ edge: "free", offset: 0.5, x: 0.3, y: 0.4 });
      expect(layout.steps).toEqual({ edge: "top", offset: 0.6 });
      expect(layout.access).toEqual({ edge: "left", offset: 0.2 });
    });

    it("falls back to legacy when version is not 2 or placements is missing", () => {
      localStorage.setItem(
        PLANNER_CHROME_LAYOUT_STORAGE_KEY,
        JSON.stringify({ version: 1, placements: {} })
      );
      expect(readPlannerChromeLayout()).toEqual(PLANNER_CHROME_DEFAULTS);
    });

    it("falls back to legacy when JSON parse fails", () => {
      localStorage.setItem(PLANNER_CHROME_LAYOUT_STORAGE_KEY, "{bad-json");
      expect(readPlannerChromeLayout()).toEqual(PLANNER_CHROME_DEFAULTS);
    });
  });

  describe("readPlannerChromeDockPlacement", () => {
    it("returns placement for specific dock", () => {
      expect(readPlannerChromeDockPlacement("tools")).toEqual(PLANNER_CHROME_DEFAULTS.tools);
    });
  });

  describe("writePlannerChromeLayout", () => {
    it("writes placements inside version 2 envelope", () => {
      const state = {
        tools: { edge: "top" as const, offset: 0.3 },
        steps: { edge: "bottom" as const, offset: 0.7 },
        access: { edge: "free" as const, offset: 0.5, x: 0.1, y: 0.2 },
      };

      writePlannerChromeLayout(state);

      const saved = JSON.parse(localStorage.getItem(PLANNER_CHROME_LAYOUT_STORAGE_KEY) || "{}");
      expect(saved.version).toBe(2);
      expect(saved.placements.tools).toEqual({ edge: "top", offset: 0.3 });
      expect(saved.placements.steps).toEqual({ edge: "bottom", offset: 0.7 });
      expect(saved.placements.access).toEqual({ edge: "free", offset: 0.5, x: 0.1, y: 0.2 });
    });
  });

  describe("writePlannerChromeDockPlacement", () => {
    it("updates only a specific dock placement", () => {
      writePlannerChromeDockPlacement("steps", { edge: "bottom", offset: 0.9 });
      const layout = readPlannerChromeLayout();
      expect(layout.steps).toEqual({ edge: "bottom", offset: 0.9 });
      expect(layout.tools).toEqual(PLANNER_CHROME_DEFAULTS.tools);
    });
  });

  describe("resetPlannerChromeLayout", () => {
    it("resets storage to defaults and returns defaults", () => {
      writePlannerChromeDockPlacement("steps", { edge: "bottom", offset: 0.9 });
      const result = resetPlannerChromeLayout();
      expect(result).toEqual(PLANNER_CHROME_DEFAULTS);
      expect(readPlannerChromeLayout()).toEqual(PLANNER_CHROME_DEFAULTS);
    });
  });
});
