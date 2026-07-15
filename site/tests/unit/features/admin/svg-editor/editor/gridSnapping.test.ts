import { describe, expect, it, vi } from "vitest";

import {
  applyGridBackground,
  generateGridLines,
  getGridSizeInPixels,
  snapPointToGrid,
  snapToGrid,
} from "@/features/admin/svg-editor/editor/gridSnapping";
import type { ExcalidrawAPI } from "@/features/admin/svg-editor/editor/elementUtils";

describe("gridSnapping", () => {
  it("returns metric and imperial grid step sizes", () => {
    expect(getGridSizeInPixels("metric")).toBe(10);
    expect(getGridSizeInPixels("imperial")).toBeGreaterThan(15);
    expect(getGridSizeInPixels("imperial")).toBeLessThan(16);
  });

  it("snaps values and points to the grid", () => {
    expect(snapToGrid(23, "metric")).toBe(20);
    expect(snapPointToGrid(23, 17, "metric")).toEqual({ x: 20, y: 20 });
  });

  it("generates vertical and horizontal grid lines", () => {
    const lines = generateGridLines(30, 20, "metric");
    expect(lines.some((line) => line.x1 === line.x2)).toBe(true);
    expect(lines.some((line) => line.y1 === line.y2)).toBe(true);
    expect(lines.length).toBeGreaterThan(4);
  });

  it("replaces grid lines and keeps user elements", () => {
    const user = {
      id: "user-1",
      type: "rectangle",
      customData: { isGridLine: false },
    };
    const staleGrid = {
      id: "grid-old",
      type: "line",
      customData: { isGridLine: true },
    };
    const updateScene = vi.fn();
    const api = {
      getSceneElements: () => [staleGrid, user],
      updateScene,
    } as unknown as ExcalidrawAPI;

    applyGridBackground(api, { width: 20, height: 20 }, "metric");

    expect(updateScene).toHaveBeenCalledTimes(1);
    const payload = updateScene.mock.calls[0]?.[0] as {
      elements: Array<{ customData?: { isGridLine?: boolean }; id: string }>;
    };
    expect(payload.elements.at(-1)?.id).toBe("user-1");
    expect(payload.elements.filter((el) => el.customData?.isGridLine).length).toBeGreaterThan(0);
  });
});