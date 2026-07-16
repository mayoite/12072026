import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  applyGridBackground,
  generateGridLines,
  getGridSizeInPixels,
  snapPointToGrid,
  snapToGrid,
  useGridSnapping,
} from "@/features/admin/svg-editor/editor/gridSnapping";
import type {
  ExcalidrawAPI,
  ExcalidrawElement,
} from "@/features/admin/svg-editor/editor/elementUtils";

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
    expect(
      payload.elements.filter((el) => el.customData?.isGridLine).length,
    ).toBeGreaterThan(0);
  });

  it("useGridSnapping applies grid when enabled and strips it when disabled", () => {
    const user = {
      id: "user-1",
      type: "rectangle",
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      customData: {},
    } as unknown as ExcalidrawElement;
    let scene: ExcalidrawElement[] = [user];
    const updateScene = vi.fn(
      (payload: { elements: readonly ExcalidrawElement[] }) => {
        scene = [...payload.elements];
      },
    );
    const api = {
      getSceneElements: () => scene,
      updateScene,
    } as unknown as ExcalidrawAPI;

    const { result, rerender, unmount } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useGridSnapping(api, "metric", enabled),
      { initialProps: { enabled: true } },
    );

    expect(result.current.gridSizePx).toBe(10);
    expect(updateScene).toHaveBeenCalled();
    expect(
      scene.some(
        (el) =>
          (el as { customData?: { isGridLine?: boolean } }).customData
            ?.isGridLine,
      ),
    ).toBe(true);

    rerender({ enabled: false });
    expect(
      scene.every(
        (el) =>
          !(el as { customData?: { isGridLine?: boolean } }).customData
            ?.isGridLine,
      ),
    ).toBe(true);

    unmount();
  });

  it("useGridSnapping onChange snaps selected non-grid elements", async () => {
    const selected = {
      id: "sel",
      type: "rectangle",
      x: 23,
      y: 17,
      width: 33,
      height: 27,
      customData: {},
    } as unknown as ExcalidrawElement;
    const grid = {
      id: "grid-1",
      type: "line",
      x: 0,
      y: 0,
      width: 10,
      height: 0,
      customData: { isGridLine: true },
    } as unknown as ExcalidrawElement;
    let scene: ExcalidrawElement[] = [grid, selected];
    const updateScene = vi.fn(
      (payload: { elements: readonly ExcalidrawElement[] }) => {
        scene = [...payload.elements];
      },
    );
    const api = {
      getSceneElements: () => scene,
      updateScene,
    } as unknown as ExcalidrawAPI;

    const { result } = renderHook(() => useGridSnapping(api, "metric", true));
    updateScene.mockClear();

    await act(async () => {
      result.current.onChangeHandler([grid, selected], {
        selectedElementIds: { sel: true },
      });
      await Promise.resolve();
    });

    expect(updateScene).toHaveBeenCalled();
    const snapped = scene.find((el) => el.id === "sel");
    expect(snapped?.x).toBe(20);
    expect(snapped?.y).toBe(20);

    updateScene.mockClear();
    await act(async () => {
      result.current.onChangeHandler(scene, { selectedElementIds: {} });
    });
    expect(updateScene).not.toHaveBeenCalled();
  });
});
