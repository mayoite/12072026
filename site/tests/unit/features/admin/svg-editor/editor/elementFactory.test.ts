import { describe, expect, it, vi } from "vitest";

import {
  addElementsToScene,
  createDimensionAnnotation,
  createDoor,
  createRoom,
  createWall,
} from "@/features/admin/svg-editor/editor/elementFactory";
import { metersToPixels } from "@/features/admin/svg-editor/editor/units";
import type { ExcalidrawAPI } from "@/features/admin/svg-editor/editor/elementUtils";

describe("elementFactory", () => {
  it("creates wall, room, door, and dimension elements", () => {
    const wall = createWall(0, 0, 3, 0, 2.7);
    expect(wall.type).toBe("line");
    expect((wall as { customData?: { heightM?: number } }).customData?.heightM).toBe(2.7);

    const room = createRoom(10, 10, 4, 3);
    expect(room.type).toBe("rectangle");
    expect(room.width).toBe(metersToPixels(4));
    expect(room.height).toBe(metersToPixels(3));

    const door = createDoor(0, 0, 100, 0, 0.9);
    expect(door.type).toBe("arrow");
    expect((door as { customData?: { isDoor?: boolean } }).customData?.isDoor).toBe(true);

    const label = createDimensionAnnotation(0, 0, 2.5, "metric");
    expect(label.type).toBe("text");
    expect((label as { text?: string }).text).toBe("2.50 m");
    expect(
      (label as { customData?: { isDimensionLabel?: boolean } }).customData?.isDimensionLabel,
    ).toBe(true);
  });

  it("stores height customData on room and door when provided", () => {
    const room = createRoom(0, 0, 2, 2, 2.4);
    expect(
      (room as { customData?: { heightM?: number; heightPx?: number } }).customData?.heightM,
    ).toBe(2.4);
    expect(
      (room as { customData?: { heightPx?: number } }).customData?.heightPx,
    ).toBe(metersToPixels(2.4));

    const door = createDoor(0, 0, 50, 0, 0.9, 2.1);
    expect((door as { customData?: { heightM?: number } }).customData?.heightM).toBe(2.1);
    expect((door as { customData?: { isDoor?: boolean } }).customData?.isDoor).toBe(true);
  });

  it("omits height customData when height is zero or omitted", () => {
    const wall = createWall(0, 0, 1, 90);
    expect((wall as { customData?: unknown }).customData).toBeUndefined();
    const room = createRoom(0, 0, 1, 1, 0);
    expect((room as { customData?: unknown }).customData).toBeUndefined();
  });

  it("formats dimension labels in imperial", () => {
    const label = createDimensionAnnotation(0, 0, 1, "imperial");
    expect(label.type).toBe("text");
    expect((label as { text?: string }).text).toMatch(/ft/);
  });

  it("appends factory elements without replacing the scene", () => {
    const existing = [{ id: "keep", type: "rectangle" }];
    const updateScene = vi.fn();
    const api = {
      getSceneElements: () => existing,
      updateScene,
    } as unknown as ExcalidrawAPI;
    const created = createRoom(0, 0, 1, 1);

    addElementsToScene(api, [created]);

    expect(updateScene).toHaveBeenCalledWith({
      elements: [existing[0], created],
    });
    addElementsToScene(api, []);
    expect(updateScene).toHaveBeenCalledTimes(1);
  });
});
