import { describe, expect, it, vi } from "vitest";

import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

import {
  getElementAngle,
  getRectangleDimensions,
  getSelectedRectangle,
  setRectangleDimensions,
  type ExcalidrawAPI,
} from "@/features/admin/svg-editor/editor/elementUtils";

function rect(id: string, width: number, height: number): ExcalidrawElement {
  return {
    id,
    type: "rectangle",
    x: 0,
    y: 0,
    width,
    height,
    angle: 0.25,
  } as ExcalidrawElement;
}

function mockApi(params: {
  selected: Record<string, boolean>;
  elements: ExcalidrawElement[];
}): ExcalidrawAPI {
  return {
    getAppState: () => ({ selectedElementIds: params.selected }),
    getSceneElements: () => params.elements,
    updateScene: vi.fn(),
  } as unknown as ExcalidrawAPI;
}

describe("elementUtils", () => {
  it("returns the only selected rectangle", () => {
    const element = rect("r1", 120, 80);
    const api = mockApi({ selected: { r1: true }, elements: [element] });
    expect(getSelectedRectangle(api)?.id).toBe("r1");
    expect(getSelectedRectangle(mockApi({ selected: {}, elements: [element] }))).toBeNull();
    expect(
      getSelectedRectangle(mockApi({ selected: { r1: true, r2: true }, elements: [element] })),
    ).toBeNull();
  });

  it("reads rectangle dimensions and angle unchanged", () => {
    const element = rect("r1", 120, 80);
    expect(getRectangleDimensions(element)).toEqual({ width: 120, height: 80 });
    expect(getElementAngle(element)).toBe(0.25);
  });

  it("updates selected rectangle dimensions via updateScene", () => {
    const element = rect("r1", 120, 80);
    const api = mockApi({ selected: { r1: true }, elements: [element] });
    setRectangleDimensions(api, 200, 150);
    expect(api.updateScene).toHaveBeenCalledWith({
      elements: [expect.objectContaining({ id: "r1", width: 200, height: 150 })],
    });
    setRectangleDimensions(api, 0, 150);
    expect(api.updateScene).toHaveBeenCalledTimes(1);
  });
});