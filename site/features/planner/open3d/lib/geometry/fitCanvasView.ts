import { PLANNER_VIEWPORT } from "@/features/planner/lib/canvasBounds";
import type { Open3dFloor } from "../../model/types";
import { getFloorBounds } from "../../shared/export/exportUtils";
import type { CanvasTransform } from "./snapping";

/** Native canvas scale at 100% zoom (matches default workspace transform). */
export const CANVAS_DEFAULT_SCALE = PLANNER_VIEWPORT.defaultZoomPercent / 1000;

/** Leave zoom-in headroom after auto-fit so the wheel is not already at max scale. */
const FIT_SCALE_HEADROOM = 0.9;

export function nativeCanvasScaleLimits(): {
  min: number;
  max: number;
  fitMax: number;
} {
  return {
    min: PLANNER_VIEWPORT.zoomMinPercent / 1000,
    max: PLANNER_VIEWPORT.zoomMaxPercent / 1000,
    fitMax: PLANNER_VIEWPORT.fitMaxZoomFactor * CANVAS_DEFAULT_SCALE,
  };
}

function fitTransformToRect(
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  viewportWidth: number,
  viewportHeight: number,
  paddingPx = PLANNER_VIEWPORT.fitPaddingPx,
): CanvasTransform {
  const { min, max, fitMax } = nativeCanvasScaleLimits();

  if (viewportWidth <= 1 || viewportHeight <= 1) {
    return {
      origin: { x: -4000, y: -2500 },
      scale: CANVAS_DEFAULT_SCALE,
    };
  }

  const contentW = Math.max(maxX - minX, 1);
  const contentH = Math.max(maxY - minY, 1);
  const rawScale = Math.min(
    (viewportWidth - paddingPx * 2) / contentW,
    (viewportHeight - paddingPx * 2) / contentH,
    fitMax * FIT_SCALE_HEADROOM,
  );
  const scale = Math.max(min, Math.min(max, rawScale));

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return {
    scale,
    origin: {
      x: cx - viewportWidth / (2 * scale),
      y: cy - viewportHeight / (2 * scale),
    },
  };
}

function emptyFloorFitTransform(
  viewportWidth: number,
  viewportHeight: number,
  paddingPx: number,
): CanvasTransform {
  const sizeMm = PLANNER_VIEWPORT.emptyViewportFitMeters * 1000;
  return fitTransformToRect(0, 0, sizeMm, sizeMm, viewportWidth, viewportHeight, paddingPx);
}

/** Frame the active floor inside the viewport (mm coordinates, native canvas transform). */
export function fitCanvasTransformToFloor(
  floor: Open3dFloor,
  viewportWidth: number,
  viewportHeight: number,
  paddingPx = PLANNER_VIEWPORT.fitPaddingPx,
): CanvasTransform {
  const hasGeometry =
    floor.walls.length > 0 ||
    floor.furniture.length > 0 ||
    floor.rooms.length > 0;

  if (!hasGeometry) {
    return emptyFloorFitTransform(viewportWidth, viewportHeight, paddingPx);
  }

  const bounds = getFloorBounds(floor);
  if (
    !Number.isFinite(bounds.minX) ||
    !Number.isFinite(bounds.minY) ||
    !Number.isFinite(bounds.maxX) ||
    !Number.isFinite(bounds.maxY)
  ) {
    return emptyFloorFitTransform(viewportWidth, viewportHeight, paddingPx);
  }

  return fitTransformToRect(
    bounds.minX,
    bounds.minY,
    bounds.maxX,
    bounds.maxY,
    viewportWidth,
    viewportHeight,
    paddingPx,
  );
}
