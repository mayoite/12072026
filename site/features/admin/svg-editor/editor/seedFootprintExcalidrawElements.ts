/**
 * Seed Excalidraw with a footprint rectangle when a descriptor has no saved scene.
 * Uses the same meters→pixels scale as DimensionPanel / elementFactory.
 */

import { createRoom } from "./elementFactory";
import type { ExcalidrawElement } from "./elementUtils";

export function seedFootprintExcalidrawElements(geometry: {
  readonly widthMm: number;
  readonly depthMm: number;
  readonly heightMm?: number;
}): ExcalidrawElement[] {
  const widthM = Math.max(geometry.widthMm, 1) / 1000;
  const depthM = Math.max(geometry.depthMm, 1) / 1000;
  const heightM =
    typeof geometry.heightMm === "number" && geometry.heightMm > 0
      ? geometry.heightMm / 1000
      : undefined;
  return [createRoom(0, 0, widthM, depthM, heightM)];
}
