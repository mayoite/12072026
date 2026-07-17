import { describe, expect, it, vi } from "vitest";
import type { Canvas } from "fabric";
import {
  clearWallSnapMarker,
  createWallSnapMarkerHandle,
  syncWallSnapMarker,
} from "@/features/planner/canvas/wallSnapMarker";

const { CircleCtor, addMock, removeMock } = vi.hoisted(() => {
  const addMock = vi.fn();
  const removeMock = vi.fn();
  const CircleCtor = vi.fn(function MockCircle(
    this: {
      set: ReturnType<typeof vi.fn>;
      setCoords: ReturnType<typeof vi.fn>;
      left?: number;
      top?: number;
      stroke?: string;
    },
    options: { left: number; top: number; stroke: string },
  ) {
    this.left = options.left;
    this.top = options.top;
    this.stroke = options.stroke;
    this.set = vi.fn((next: { left?: number; top?: number; stroke?: string }) => {
      if (next.left !== undefined) this.left = next.left;
      if (next.top !== undefined) this.top = next.top;
      if (next.stroke !== undefined) this.stroke = next.stroke;
    });
    this.setCoords = vi.fn();
  });
  return { CircleCtor, addMock, removeMock };
});

vi.mock("fabric", () => ({
  Circle: CircleCtor,
}));

describe("wallSnapMarker", () => {
  it("creates a marker for a live snap and updates its position", () => {
    const canvas = { add: addMock, remove: removeMock } as unknown as Canvas;
    const handle = createWallSnapMarkerHandle();

    syncWallSnapMarker({
      canvas,
      handle,
      screen: { x: 10, y: 20 },
      kind: "endpoint",
      stroke: "var-resolved",
    });

    expect(CircleCtor).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(handle.kind).toBe("endpoint");
    expect(handle.marker).not.toBeNull();

    syncWallSnapMarker({
      canvas,
      handle,
      screen: { x: 40, y: 50 },
      kind: "midpoint",
      stroke: "var-resolved",
    });

    expect(CircleCtor).toHaveBeenCalledTimes(1);
    expect(handle.kind).toBe("midpoint");
    expect(handle.marker?.left).toBe(40);
    expect(handle.marker?.top).toBe(50);
  });

  it("clears the marker when snap kind is none", () => {
    const canvas = { add: addMock, remove: removeMock } as unknown as Canvas;
    const handle = createWallSnapMarkerHandle();

    syncWallSnapMarker({
      canvas,
      handle,
      screen: { x: 1, y: 2 },
      kind: "intersection",
      stroke: "var-resolved",
    });
    clearWallSnapMarker(canvas, handle);

    expect(removeMock).toHaveBeenCalled();
    expect(handle.marker).toBeNull();
    expect(handle.kind).toBe("none");
  });
});
