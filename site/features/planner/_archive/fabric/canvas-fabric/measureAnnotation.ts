import { PLANNER_MM_PER_CANVAS_UNIT } from "@/features/planner/lib/canvasBounds";
import { formatLength, type MeasurementUnit } from "@/features/planner/lib/measurements";

/**
 * Convert a canvas-unit distance to a measurement label. Uses the shared
 * `formatLength` formatter so the measure tool matches every other readout
 * (room/selection/presets) and honours the active unit system (mm or ft-in),
 * instead of its old metric-only `"1m 323mm"` format.
 */
export function formatCanvasMeasureLabel(
  canvasDistance: number,
  unitSystem: MeasurementUnit = "mm",
): string {
  const mm = Math.round(canvasDistance * PLANNER_MM_PER_CANVAS_UNIT);
  return formatLength(mm, unitSystem);
}

/** Snap the end point to horizontal or vertical when shift is held. */
export function snapMeasureEndPoint(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  shiftKey: boolean,
): { x: number; y: number } {
  if (!shiftKey) {
    return { x: endX, y: endY };
  }

  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  if (dx >= dy) {
    return { x: endX, y: startY };
  }
  return { x: startX, y: endY };
}

/** Place the label slightly offset from the dimension line midpoint. */
export function measureLabelPosition(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset = 18,
): { x: number; y: number } {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: midX + (-dy / length) * offset,
    y: midY + (dx / length) * offset,
  };
}
