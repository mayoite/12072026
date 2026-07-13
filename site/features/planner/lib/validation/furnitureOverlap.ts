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
  furniture: readonly PlacedFurniture[],
): ValidationIssue[] {
  const orderedFurniture = [...furniture].sort((a, b) =>
    a.id === b.id ? 0 : a.id < b.id ? -1 : 1,
  );
  const issues: ValidationIssue[] = [];
  const seenPairs = new Set<string>();

  for (let firstIndex = 0; firstIndex < orderedFurniture.length; firstIndex += 1) {
    const first = orderedFurniture[firstIndex];
    if (!first) continue;

    for (let secondIndex = firstIndex + 1; secondIndex < orderedFurniture.length; secondIndex += 1) {
      const second = orderedFurniture[secondIndex];
      if (
        !second ||
        first.id === second.id ||
        !aabbsOverlap(first, second)
      ) continue;

      const pairKey = `${first.id}\u0000${second.id}`;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);

      issues.push({
        id: `furniture-overlap:${first.id}:${second.id}`,
        ruleId: "furniture-overlap",
        severity: "error",
        objectIds: [first.id, second.id],
        message: `Furniture items "${first.id}" and "${second.id}" overlap.`,
        remedy: `Move "${second.id}" away from "${first.id}" to clear the overlap.`,
        focusMm: {
          x: (first.xMm + second.xMm) / 2,
          y: (first.yMm + second.yMm) / 2,
        },
      });
    }
  }

  return issues;
}
