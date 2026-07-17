import { Circle, type Canvas } from "fabric";
import type { SnapKind } from "@/features/planner/lib/geometry/snapping";

export type WallSnapMarkerHandle = {
  marker: Circle | null;
  kind: SnapKind;
};

export function createWallSnapMarkerHandle(): WallSnapMarkerHandle {
  return { marker: null, kind: "none" };
}

/** Transient glyph at the live snapped endpoint (screen space). */
export function syncWallSnapMarker(input: {
  canvas: Canvas;
  handle: WallSnapMarkerHandle;
  screen: { x: number; y: number };
  kind: SnapKind;
  stroke: string;
}): void {
  if (input.kind === "none") {
    clearWallSnapMarker(input.canvas, input.handle);
    return;
  }

  const existing = input.handle.marker;
  if (existing) {
    existing.set({
      left: input.screen.x,
      top: input.screen.y,
      stroke: input.stroke,
    });
    existing.setCoords();
    input.handle.kind = input.kind;
    return;
  }

  const marker = new Circle({
    left: input.screen.x,
    top: input.screen.y,
    originX: "center",
    originY: "center",
    radius: 5,
    fill: "transparent",
    stroke: input.stroke,
    strokeWidth: 2,
    selectable: false,
    evented: false,
    objectCaching: false,
  });
  input.canvas.add(marker);
  input.handle.marker = marker;
  input.handle.kind = input.kind;
}

export function clearWallSnapMarker(
  canvas: Canvas | null | undefined,
  handle: WallSnapMarkerHandle,
): void {
  if (handle.marker) {
    canvas?.remove(handle.marker);
    handle.marker = null;
  }
  handle.kind = "none";
}
