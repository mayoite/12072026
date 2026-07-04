import { describe, it, expect } from "vitest";
import {
  clampDockRatio,
  getDockAxisBounds,
  normalizePlannerChromePlacement,
  getPlannerChromePreviewEdge,
  resolvePlannerChromeCollisions,
  snapPlannerChromePlacement,
  movePlannerChromePlacementWithKeyboard,
  getPlannerChromeTooltipSide,
  _PLANNER_CHROME_DEFAULTS,
} from "@/features/planner/editor/chrome/plannerChromeLayout";

describe("plannerChromeLayout", () => {
  describe("clampDockRatio", () => {
    it("clamps values between min and max", () => {
      expect(clampDockRatio(0.5)).toBe(0.5);
      expect(clampDockRatio(0.01)).toBe(0.08); // default min 0.08
      expect(clampDockRatio(0.99)).toBe(0.92); // default max 0.92
      expect(clampDockRatio(0.1, 0.2, 0.8)).toBe(0.2);
    });
  });

  describe("getDockAxisBounds", () => {
    it("calculates axis bounds for vertical edges (left/right)", () => {
      const layerRect = { width: 1000, height: 800 };
      const widgetSize = { width: 100, height: 200 };
      const reservedInsets = { top: 50, left: 10, right: 10, bottom: 40 };

      const bounds = getDockAxisBounds("left", layerRect, widgetSize, reservedInsets);
      // startInset = 50. widgetSize.height/2 = 100. Gutter = 16. Total = 166. Ratio = 166/800 = 0.2075
      // endInset = 40. widgetSize.height/2 = 100. Gutter = 16. Total = 156. Ratio = 1 - 156/800 = 0.805
      expect(bounds.min).toBeCloseTo(0.2075);
      expect(bounds.max).toBeCloseTo(0.805);
    });

    it("calculates axis bounds for horizontal edges (top/bottom)", () => {
      const layerRect = { width: 1000, height: 800 };
      const widgetSize = { width: 100, height: 200 };
      const reservedInsets = { top: 50, left: 10, right: 20, bottom: 40 };

      const bounds = getDockAxisBounds("top", layerRect, widgetSize, reservedInsets);
      // startInset = 10 (left). widgetSize.width/2 = 50. Gutter = 16. Total = 76. Ratio = 76/1000 = 0.076 -> clamped to 0.08
      // endInset = 20 (right). widgetSize.width/2 = 50. Gutter = 16. Total = 86. Ratio = 1 - 86/1000 = 0.914
      expect(bounds.min).toBeCloseTo(0.08);
      expect(bounds.max).toBeCloseTo(0.914);
    });

    it("returns {0.5, 0.5} if min exceeds max", () => {
      const layerRect = { width: 100, height: 100 };
      const widgetSize = { width: 200, height: 200 };
      const bounds = getDockAxisBounds("top", layerRect, widgetSize);
      expect(bounds).toEqual({ min: 0.5, max: 0.5 });
    });
  });

  describe("normalizePlannerChromePlacement", () => {
    const fallback = { edge: "left" as const, offset: 0.5 };

    it("returns fallback if placement is invalid", () => {
      expect(normalizePlannerChromePlacement(null, fallback)).toEqual(fallback);
      expect(normalizePlannerChromePlacement(undefined, fallback)).toEqual(fallback);
      expect(normalizePlannerChromePlacement({ edge: "invalid-edge" as any }, fallback)).toEqual(fallback);
    });

    it("normalizes free placement", () => {
      const placement = { edge: "free" as const, x: 0.1, y: 0.95 };
      const res = normalizePlannerChromePlacement(placement, fallback);
      expect(res).toEqual({ edge: "free", offset: 0.5, x: 0.1, y: 0.92 });
    });

    it("returns fallback for free placement with invalid x/y", () => {
      expect(normalizePlannerChromePlacement({ edge: "free" as const, x: NaN }, fallback)).toEqual(fallback);
    });

    it("applies bounds to free placement when options are provided", () => {
      const layerRect = { width: 1000, height: 800 };
      const widgetSize = { width: 100, height: 100 };
      const res = normalizePlannerChromePlacement(
        { edge: "free" as const, x: 0.01, y: 0.99 },
        fallback,
        { layerRect, widgetSize }
      );
      expect(res.x).toBeGreaterThan(0.01);
      expect(res.y).toBeLessThan(0.99);
    });

    it("normalizes dock placement with fallback for missing offset", () => {
      expect(normalizePlannerChromePlacement({ edge: "left" }, fallback)).toEqual(fallback);
    });

    it("clamps offset with options if provided", () => {
      const layerRect = { width: 1000, height: 800 };
      const widgetSize = { width: 100, height: 100 };
      const res = normalizePlannerChromePlacement(
        { edge: "left" as const, offset: 0.01 },
        fallback,
        { layerRect, widgetSize }
      );
      expect(res.offset).toBeCloseTo(0.08, 1); // clamped by min ratio (approx 0.08)
    });
  });

  describe("getPlannerChromePreviewEdge", () => {
    const rect = { left: 0, top: 0, width: 1000, height: 800 };

    it("returns free if point is far from edges", () => {
      expect(getPlannerChromePreviewEdge(500, 400, rect)).toBe("free");
    });

    it("returns left when point is close to left edge", () => {
      expect(getPlannerChromePreviewEdge(50, 400, rect)).toBe("left");
    });

    it("returns right when point is close to right edge", () => {
      expect(getPlannerChromePreviewEdge(950, 400, rect)).toBe("right");
    });

    it("returns top when point is close to top edge", () => {
      expect(getPlannerChromePreviewEdge(500, 50, rect)).toBe("top");
    });

    it("returns bottom when point is close to bottom edge", () => {
      expect(getPlannerChromePreviewEdge(500, 750, rect)).toBe("bottom");
    });
  });

  describe("resolvePlannerChromeCollisions", () => {
    it("returns layout unchanged if activeDock is free", () => {
      const layout = {
        tools: { edge: "free" as const, offset: 0.5, x: 0.1, y: 0.2 },
        steps: { edge: "top" as const, offset: 0.5 },
        access: { edge: "top" as const, offset: 0.6 },
      };
      expect(resolvePlannerChromeCollisions(layout, "tools")).toEqual(layout);
    });

    it("resolves collision by staggering offsets on same edge", () => {
      const layout = {
        tools: { edge: "top" as const, offset: 0.5 },
        steps: { edge: "top" as const, offset: 0.5 },
        access: { edge: "bottom" as const, offset: 0.5 },
      };

      const resolved = resolvePlannerChromeCollisions(layout, "steps");
      // Steps offset should be shifted to avoid collision with tools
      expect(resolved.steps.offset).not.toBe(0.5);
      expect(resolved.tools.offset).toBe(0.5);
    });

    it("uses bounds when layerRect and widgetSize are specified", () => {
      const layout = {
        tools: { edge: "top" as const, offset: 0.5 },
        steps: { edge: "top" as const, offset: 0.5 },
        access: { edge: "bottom" as const, offset: 0.5 },
      };
      const resolved = resolvePlannerChromeCollisions(
        layout,
        "steps",
        { width: 1000, height: 800 },
        { steps: { width: 100, height: 100 } }
      );
      expect(resolved.steps.offset).not.toBe(0.5);
    });
  });

  describe("snapPlannerChromePlacement", () => {
    const rect = { left: 0, top: 0, width: 1000, height: 800 };

    it("snaps to free when in the middle", () => {
      const res = snapPlannerChromePlacement(500, 400, rect);
      expect(res.edge).toBe("free");
    });

    it("snaps to an edge with correct offset", () => {
      const res = snapPlannerChromePlacement(50, 400, rect); // Left edge, y = 400/800 = 0.5
      expect(res.edge).toBe("left");
      expect(res.offset).toBeCloseTo(0.5);
    });
  });

  describe("movePlannerChromePlacementWithKeyboard", () => {
    it("moves free placement with arrow keys", () => {
      const placement = { edge: "free" as const, offset: 0.5, x: 0.5, y: 0.5 };
      const nextRight = movePlannerChromePlacementWithKeyboard(placement, "ArrowRight");
      expect(nextRight.x).toBe(0.53); // moves by step 0.03

      const nextDownShift = movePlannerChromePlacementWithKeyboard(placement, "ArrowDown", { shiftKey: true });
      expect(nextDownShift.y).toBe(0.58); // moves by shift step 0.08
    });

    it("moves free placement to Home / End", () => {
      const placement = { edge: "free" as const, offset: 0.5, x: 0.5, y: 0.5 };
      expect(movePlannerChromePlacementWithKeyboard(placement, "Home")).toEqual({
        edge: "free",
        offset: 0.5,
        x: 0.08,
        y: 0.08,
      });
      expect(movePlannerChromePlacementWithKeyboard(placement, "End")).toEqual({
        edge: "free",
        offset: 0.5,
        x: 0.92,
        y: 0.92,
      });
    });

    it("moves dock placement along its axis", () => {
      const placement = { edge: "left" as const, offset: 0.5 }; // vertical edge
      const nextUp = movePlannerChromePlacementWithKeyboard(placement, "ArrowUp");
      expect(nextUp.offset).toBe(0.47);

      const nextDown = movePlannerChromePlacementWithKeyboard(placement, "ArrowDown");
      expect(nextDown.offset).toBe(0.53);
    });

    it("moves horizontal dock placement along its axis", () => {
      const placement = { edge: "top" as const, offset: 0.5 }; // horizontal edge
      const nextLeft = movePlannerChromePlacementWithKeyboard(placement, "ArrowLeft");
      expect(nextLeft.offset).toBe(0.47);

      const nextRight = movePlannerChromePlacementWithKeyboard(placement, "ArrowRight");
      expect(nextRight.offset).toBe(0.53);
    });

    it("respects Home and End on dock placement", () => {
      const placement = { edge: "left" as const, offset: 0.5 };
      expect(movePlannerChromePlacementWithKeyboard(placement, "Home").offset).toBe(0.08);
      expect(movePlannerChromePlacementWithKeyboard(placement, "End").offset).toBe(0.92);
    });
  });

  describe("getPlannerChromeTooltipSide", () => {
    it("returns correct side based on edge placement", () => {
      expect(getPlannerChromeTooltipSide("left")).toBe("right");
      expect(getPlannerChromeTooltipSide("right")).toBe("left");
      expect(getPlannerChromeTooltipSide("bottom")).toBe("top");
      expect(getPlannerChromeTooltipSide("top")).toBe("bottom");
      expect(getPlannerChromeTooltipSide("free")).toBe("bottom");
    });
  });
});
