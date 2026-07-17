/**
 * Sticky orthogonal drawing lock (plan millimetres).
 * Shift-only is not enough for CAD-style wall chains — sticky OR Shift both lock to 90°.
 */

import type { PlannerPoint } from "@/features/planner/model/types";

/**
 * Project `raw` onto the nearest axis-aligned ray from `start`
 * (horizontal or vertical, whichever is closer in angle).
 */
export function applyOrthogonalLock(
  start: PlannerPoint,
  raw: PlannerPoint,
): PlannerPoint {
  const dx = raw.x - start.x;
  const dy = raw.y - start.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: raw.x, y: start.y };
  }
  return { x: start.x, y: raw.y };
}

/** True when sticky lock or Shift should force orthogonal drawing. */
export function isOrthogonalDrawingActive(
  stickyLock: boolean,
  shiftKey: boolean,
): boolean {
  return stickyLock || shiftKey;
}

/**
 * When orthogonal is active, snap the free point; otherwise return `raw` unchanged.
 */
export function maybeOrthogonalPoint(
  start: PlannerPoint | null,
  raw: PlannerPoint,
  orthogonalActive: boolean,
): PlannerPoint {
  if (!orthogonalActive || !start) return raw;
  return applyOrthogonalLock(start, raw);
}
