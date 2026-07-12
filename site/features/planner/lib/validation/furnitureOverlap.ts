/**
 * P14 — furniture overlap rule (TDD stub).
 * Detects when two placed items' footprints intersect.
 */
import type { PlacedFurniture, ValidationIssue } from "./types";

/** @internal exported for unit tests */
export function aabbsOverlap(a: PlacedFurniture, b: PlacedFurniture): boolean {
  // TODO(P14): rotate-aware OBB intersection; axis-aligned stub for now.
  const halfAw = a.widthMm / 2;
  const halfAh = a.depthMm / 2;
  const halfBw = b.widthMm / 2;
  const halfBh = b.depthMm / 2;

  const overlapX = Math.abs(a.xMm - b.xMm) < halfAw + halfBw;
  const overlapY = Math.abs(a.yMm - b.yMm) < halfAh + halfBh;
  return overlapX && overlapY;
}

/**
 * Returns validation issues for every overlapping furniture pair.
 * Stub: not yet integrated with workspace document or live revalidation.
 */
export function detectFurnitureOverlaps(
  _furniture: readonly PlacedFurniture[],
): ValidationIssue[] {
  // TODO(P14): wire aabbsOverlap into issue builder; red TDD tests document target behavior.
  return [];
}