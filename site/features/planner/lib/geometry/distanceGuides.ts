/**
 * Distance guides for furniture placement (SmartDraw-style).
 * Pure plan-mm geometry; callers paint screen space.
 *
 * Furniture positions use **center** origin (PlannerFurnitureItem.position).
 * Walls use centreline segments; optional thickness shrinks the clear gap.
 */

import type { BoundingBox, Point2D, Segment } from "./types";

export const DEFAULT_DISTANCE_GUIDE_MAX_MM = 5000;
export const DEFAULT_DISTANCE_GUIDE_MAX_COUNT = 6;

export type DistanceGuideKind = "wall" | "furniture";
export type DistanceGuideAxis = "x" | "y" | "free";

export type DistanceGuide = {
  kind: DistanceGuideKind;
  targetId: string;
  distanceMm: number;
  from: Point2D;
  to: Point2D;
  axis: DistanceGuideAxis;
};

export type CenteredFurnitureRect = {
  id: string;
  /** Center X (plan mm). */
  cxMm: number;
  /** Center Y (plan mm). */
  cyMm: number;
  widthMm: number;
  depthMm: number;
  /** Degrees; non-zero uses AABB envelope of the rotated footprint. */
  rotationDeg?: number;
};

export type WallGuideInput = {
  id: string;
  start: Point2D;
  end: Point2D;
  /** Full wall thickness (mm); half is treated as solid from centreline. */
  thicknessMm?: number;
};

export type DistanceGuideOptions = {
  /** Ignore guides farther than this (default 5000). */
  maxDistanceMm?: number;
  /** Cap returned guides after sort (default 6). */
  maxGuides?: number;
  /** Furniture ids to skip (e.g. the active drag subject). */
  excludeIds?: ReadonlySet<string>;
};

const EPSILON = 1e-9;

function positiveSize(n: number, fallback: number): number {
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Axis-aligned envelope of a centered furniture footprint. */
export function aabbFromCenteredFurniture(item: CenteredFurnitureRect): BoundingBox {
  const width = positiveSize(item.widthMm, 1);
  const depth = positiveSize(item.depthMm, 1);
  const rot = ((item.rotationDeg ?? 0) * Math.PI) / 180;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const hx = width / 2;
  const hy = depth / 2;
  const locals: readonly Point2D[] = [
    { x: -hx, y: -hy },
    { x: hx, y: -hy },
    { x: hx, y: hy },
    { x: -hx, y: hy },
  ];
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const local of locals) {
    const x = item.cxMm + local.x * cos - local.y * sin;
    const y = item.cyMm + local.x * sin + local.y * cos;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

/** Closest point on a finite segment to a query point. */
export function closestPointOnSegment(point: Point2D, segment: Segment): Point2D {
  const dx = segment.end.x - segment.start.x;
  const dy = segment.end.y - segment.start.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < EPSILON) {
    return { x: segment.start.x, y: segment.start.y };
  }
  const t = Math.min(
    1,
    Math.max(
      0,
      ((point.x - segment.start.x) * dx + (point.y - segment.start.y) * dy) / lenSq,
    ),
  );
  return { x: segment.start.x + t * dx, y: segment.start.y + t * dy };
}

/** Clamp a point into an AABB. */
export function clampPointToAabb(point: Point2D, box: BoundingBox): Point2D {
  return {
    x: Math.min(box.maxX, Math.max(box.minX, point.x)),
    y: Math.min(box.maxY, Math.max(box.minY, point.y)),
  };
}

/**
 * Shortest segment from an AABB surface to a wall centreline, with optional
 * half-thickness clearance. Returns null when the box intersects the solid wall.
 */
export function wallDistanceGuide(
  subject: BoundingBox,
  wall: WallGuideInput,
): DistanceGuide | null {
  const segment: Segment = { start: wall.start, end: wall.end };
  const halfThick = Math.max(0, (wall.thicknessMm ?? 0) / 2);

  // Candidate pairs: box clamp of segment ends + segment clamp of box corners + center.
  const candidates: Point2D[] = [
    { x: (subject.minX + subject.maxX) / 2, y: (subject.minY + subject.maxY) / 2 },
    { x: subject.minX, y: subject.minY },
    { x: subject.maxX, y: subject.minY },
    { x: subject.maxX, y: subject.maxY },
    { x: subject.minX, y: subject.maxY },
    clampPointToAabb(wall.start, subject),
    clampPointToAabb(wall.end, subject),
  ];

  let bestFrom: Point2D | null = null;
  let bestTo: Point2D | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const onSeg = closestPointOnSegment(candidate, segment);
    const onBox = clampPointToAabb(onSeg, subject);
    const onSeg2 = closestPointOnSegment(onBox, segment);
    const dist = Math.hypot(onSeg2.x - onBox.x, onSeg2.y - onBox.y);
    if (dist < bestDist) {
      bestDist = dist;
      bestFrom = onBox;
      bestTo = onSeg2;
    }
  }

  if (!bestFrom || !bestTo || !Number.isFinite(bestDist)) return null;

  const clear = bestDist - halfThick;
  if (clear <= EPSILON) return null;

  const dx = Math.abs(bestTo.x - bestFrom.x);
  const dy = Math.abs(bestTo.y - bestFrom.y);
  let axis: DistanceGuideAxis = "free";
  if (dx < EPSILON && dy >= EPSILON) axis = "y";
  else if (dy < EPSILON && dx >= EPSILON) axis = "x";

  // When thickness eats into the ray, pull `to` toward `from` by halfThick.
  let to = bestTo;
  if (halfThick > 0 && bestDist > EPSILON) {
    const ux = (bestTo.x - bestFrom.x) / bestDist;
    const uy = (bestTo.y - bestFrom.y) / bestDist;
    to = {
      x: bestFrom.x + ux * clear,
      y: bestFrom.y + uy * clear,
    };
  }

  return {
    kind: "wall",
    targetId: wall.id,
    distanceMm: clear,
    from: bestFrom,
    to,
    axis,
  };
}

/**
 * Axis-aligned edge gap between two AABBs when they separate on one axis
 * and their projections overlap on the other (classic dimension guide).
 */
export function furnitureEdgeGapGuide(
  subject: BoundingBox,
  other: BoundingBox,
  targetId: string,
): DistanceGuide | null {
  const overlapY =
    subject.minY < other.maxY - EPSILON && subject.maxY > other.minY + EPSILON;
  const overlapX =
    subject.minX < other.maxX - EPSILON && subject.maxX > other.minX + EPSILON;

  // Prefer pure horizontal or vertical clear gaps when projections overlap.
  if (overlapY) {
    if (subject.maxX <= other.minX + EPSILON) {
      const gap = other.minX - subject.maxX;
      if (gap > EPSILON) {
        const y = midOverlap(subject.minY, subject.maxY, other.minY, other.maxY);
        return {
          kind: "furniture",
          targetId,
          distanceMm: gap,
          from: { x: subject.maxX, y },
          to: { x: other.minX, y },
          axis: "x",
        };
      }
    }
    if (other.maxX <= subject.minX + EPSILON) {
      const gap = subject.minX - other.maxX;
      if (gap > EPSILON) {
        const y = midOverlap(subject.minY, subject.maxY, other.minY, other.maxY);
        return {
          kind: "furniture",
          targetId,
          distanceMm: gap,
          from: { x: subject.minX, y },
          to: { x: other.maxX, y },
          axis: "x",
        };
      }
    }
  }

  if (overlapX) {
    if (subject.maxY <= other.minY + EPSILON) {
      const gap = other.minY - subject.maxY;
      if (gap > EPSILON) {
        const x = midOverlap(subject.minX, subject.maxX, other.minX, other.maxX);
        return {
          kind: "furniture",
          targetId,
          distanceMm: gap,
          from: { x, y: subject.maxY },
          to: { x, y: other.minY },
          axis: "y",
        };
      }
    }
    if (other.maxY <= subject.minY + EPSILON) {
      const gap = subject.minY - other.maxY;
      if (gap > EPSILON) {
        const x = midOverlap(subject.minX, subject.maxX, other.minX, other.maxX);
        return {
          kind: "furniture",
          targetId,
          distanceMm: gap,
          from: { x, y: subject.minY },
          to: { x, y: other.maxY },
          axis: "y",
        };
      }
    }
  }

  // Fallback: corner-to-corner free gap when boxes are diagonal neighbors.
  if (!overlapX && !overlapY) {
    const from = clampPointToAabb(
      {
        x: (other.minX + other.maxX) / 2,
        y: (other.minY + other.maxY) / 2,
      },
      subject,
    );
    const to = clampPointToAabb(from, other);
    const gap = Math.hypot(to.x - from.x, to.y - from.y);
    if (gap > EPSILON) {
      return {
        kind: "furniture",
        targetId,
        distanceMm: gap,
        from,
        to,
        axis: "free",
      };
    }
  }

  return null;
}

function midOverlap(a0: number, a1: number, b0: number, b1: number): number {
  const lo = Math.max(a0, b0);
  const hi = Math.min(a1, b1);
  return (lo + hi) / 2;
}

/**
 * Nearest wall + furniture distance guides for a moving/placed subject.
 * Sorted ascending by distance; capped by maxGuides.
 */
export function computeDistanceGuides(
  subject: CenteredFurnitureRect,
  walls: readonly WallGuideInput[],
  neighbors: readonly CenteredFurnitureRect[],
  options?: DistanceGuideOptions,
): DistanceGuide[] {
  const maxDistanceMm = positiveSize(
    options?.maxDistanceMm ?? DEFAULT_DISTANCE_GUIDE_MAX_MM,
    DEFAULT_DISTANCE_GUIDE_MAX_MM,
  );
  const maxGuides = Math.max(
    1,
    Math.floor(options?.maxGuides ?? DEFAULT_DISTANCE_GUIDE_MAX_COUNT),
  );
  const exclude = options?.excludeIds ?? new Set<string>([subject.id]);
  const subjectBox = aabbFromCenteredFurniture(subject);
  const guides: DistanceGuide[] = [];

  for (const wall of walls) {
    const guide = wallDistanceGuide(subjectBox, wall);
    if (!guide) continue;
    if (guide.distanceMm > maxDistanceMm) continue;
    guides.push(guide);
  }

  for (const neighbor of neighbors) {
    if (exclude.has(neighbor.id)) continue;
    const otherBox = aabbFromCenteredFurniture(neighbor);
    const guide = furnitureEdgeGapGuide(subjectBox, otherBox, neighbor.id);
    if (!guide) continue;
    if (guide.distanceMm > maxDistanceMm) continue;
    guides.push(guide);
  }

  guides.sort((a, b) => a.distanceMm - b.distanceMm);
  return guides.slice(0, maxGuides);
}
