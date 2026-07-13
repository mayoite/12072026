import type { CSSProperties } from "react";

import {
  type CanvasTransform,
} from "@/features/planner/project/lib/geometry/snapping";

/** Default plan grid spacing (mm) — matches snapDrawingPoint default. */
export const PLANNER_STAGE_GRID_MM = 100;

function positiveMod(value: number, modulus: number): number {
  if (modulus <= 0) return 0;
  return ((value % modulus) + modulus) % modulus;
}

/**
 * CSS custom properties for a pan/zoom-aware grid overlay on the Fabric host.
 * Grid lines align to project mm multiples; overlay scrolls with canvas transform.
 */
export function plannerGridOverlayStyle(
  transform: CanvasTransform,
  gridMm: number = PLANNER_STAGE_GRID_MM,
): CSSProperties {
  const sizePx = Math.max(4, gridMm * transform.scale);
  const offsetX = positiveMod(-transform.origin.x * transform.scale, sizePx);
  const offsetY = positiveMod(-transform.origin.y * transform.scale, sizePx);
  return {
    ["--planner-grid-size-px" as string]: `${sizePx}px`,
    ["--planner-grid-offset-x" as string]: `${offsetX}px`,
    ["--planner-grid-offset-y" as string]: `${offsetY}px`,
  };
}