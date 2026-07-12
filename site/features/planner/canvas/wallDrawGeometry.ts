/**
 * Pure wall-draw geometry helpers for PlannerFabricStage.
 * Project space is millimetres (same as PlannerPoint).
 */

import type { PlannerPoint } from "@/features/planner/project/model/types";

/** Minimum committed segment length in mm (matches prior Fabric stage gate). */
export const MIN_WALL_SEGMENT_MM = 10;

export function wallSegmentLengthMm(start: PlannerPoint, end: PlannerPoint): number {
  return Math.hypot(end.x - start.x, end.y - start.y);
}

/** True when a preview segment is long enough to become a document wall. */
export function shouldCommitWallSegment(
  start: PlannerPoint,
  end: PlannerPoint,
  minMm: number = MIN_WALL_SEGMENT_MM,
): boolean {
  return wallSegmentLengthMm(start, end) >= minMm;
}
