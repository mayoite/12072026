/**
 * Pure linear dimension geometry for durable wall/room annotations.
 * Coordinates are plan millimetres (document space).
 */

import type {
  PlannerAnnotation,
  PlannerPoint,
  PlannerWall,
} from "@/features/planner/model/types";
import { formatLengthDisplay } from "@/features/planner/model/units";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";

export const DEFAULT_DIMENSION_OFFSET_MM = 400;
export const DEFAULT_OVERALL_DIMENSION_OFFSET_MM = 700;
export const MIN_DIMENSION_LENGTH_MM = 10;

export type DimensionDraft = Omit<PlannerAnnotation, "id">;

export interface DimensionPaintGeometry {
  /** Measured segment endpoints (document mm). */
  start: PlannerPoint;
  end: PlannerPoint;
  /** Dimension line (offset parallel). */
  lineStart: PlannerPoint;
  lineEnd: PlannerPoint;
  /** Extension tick from measured start → lineStart. */
  extStart: PlannerPoint;
  /** Extension tick from measured end → lineEnd. */
  extEnd: PlannerPoint;
  /** Label anchor (mid of dim line). */
  labelPoint: PlannerPoint;
  lengthMm: number;
  label: string;
}

export function linearLengthMm(start: PlannerPoint, end: PlannerPoint): number {
  return Math.hypot(end.x - start.x, end.y - start.y);
}

export function dimensionLabelForLength(
  lengthMm: number,
  displayUnit: PlannerDisplayUnit = "mm",
): string {
  return formatLengthDisplay(lengthMm, displayUnit);
}

/**
 * Build offset dimension line geometry for a measured segment.
 * Positive offset is to the left of the directed segment (plan space).
 */
export function offsetDimensionGeometry(
  start: PlannerPoint,
  end: PlannerPoint,
  offsetMm: number,
  label?: string,
  displayUnit: PlannerDisplayUnit = "mm",
): DimensionPaintGeometry | null {
  const lengthMm = linearLengthMm(start, end);
  if (lengthMm < MIN_DIMENSION_LENGTH_MM) return null;

  const ux = (end.x - start.x) / lengthMm;
  const uy = (end.y - start.y) / lengthMm;
  // Left normal.
  const nx = -uy;
  const ny = ux;
  const ox = nx * offsetMm;
  const oy = ny * offsetMm;

  const lineStart = { x: start.x + ox, y: start.y + oy };
  const lineEnd = { x: end.x + ox, y: end.y + oy };
  const labelPoint = {
    x: (lineStart.x + lineEnd.x) / 2,
    y: (lineStart.y + lineEnd.y) / 2,
  };

  return {
    start: { ...start },
    end: { ...end },
    lineStart,
    lineEnd,
    extStart: { ...start },
    extEnd: { ...end },
    labelPoint,
    lengthMm,
    label: label ?? dimensionLabelForLength(lengthMm, displayUnit),
  };
}

export function annotationDraftFromSegment(
  start: PlannerPoint,
  end: PlannerPoint,
  offsetMm = DEFAULT_DIMENSION_OFFSET_MM,
  label?: string,
  displayUnit: PlannerDisplayUnit = "mm",
): DimensionDraft | null {
  const lengthMm = linearLengthMm(start, end);
  if (lengthMm < MIN_DIMENSION_LENGTH_MM) return null;
  return {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
    offset: offsetMm,
    label: label ?? dimensionLabelForLength(lengthMm, displayUnit),
  };
}

export function paintGeometryFromAnnotation(
  annotation: PlannerAnnotation,
  displayUnit: PlannerDisplayUnit = "mm",
): DimensionPaintGeometry | null {
  return offsetDimensionGeometry(
    { x: annotation.x1, y: annotation.y1 },
    { x: annotation.x2, y: annotation.y2 },
    annotation.offset,
    annotation.label,
    displayUnit,
  );
}

/** One draft per wall centreline (skip short segments). */
export function wallDimensionDrafts(
  walls: readonly PlannerWall[],
  offsetMm = DEFAULT_DIMENSION_OFFSET_MM,
  displayUnit: PlannerDisplayUnit = "mm",
): DimensionDraft[] {
  const drafts: DimensionDraft[] = [];
  for (const wall of walls) {
    const draft = annotationDraftFromSegment(
      wall.start,
      wall.end,
      offsetMm,
      undefined,
      displayUnit,
    );
    if (draft) drafts.push(draft);
  }
  return drafts;
}

/**
 * Overall width (bottom) and depth (right) for an axis-aligned room rectangle.
 * `corners` = SW, SE, NE, NW (as from rectangularRoomMetrics).
 */
export function overallRoomDimensionDrafts(
  corners: readonly PlannerPoint[],
  offsetMm = DEFAULT_OVERALL_DIMENSION_OFFSET_MM,
  displayUnit: PlannerDisplayUnit = "mm",
): DimensionDraft[] {
  if (corners.length < 4) return [];
  const sw = corners[0];
  const se = corners[1];
  const ne = corners[2];
  if (!sw || !se || !ne) return [];
  const drafts: DimensionDraft[] = [];
  const width = annotationDraftFromSegment(sw, se, offsetMm, undefined, displayUnit);
  const depth = annotationDraftFromSegment(se, ne, offsetMm, undefined, displayUnit);
  if (width) drafts.push(width);
  if (depth) drafts.push(depth);
  return drafts;
}

/** True when an existing annotation already covers the same segment. */
export function annotationMatchesSegment(
  annotation: PlannerAnnotation,
  start: PlannerPoint,
  end: PlannerPoint,
  epsilonMm = 1,
): boolean {
  const same =
    (Math.abs(annotation.x1 - start.x) <= epsilonMm &&
      Math.abs(annotation.y1 - start.y) <= epsilonMm &&
      Math.abs(annotation.x2 - end.x) <= epsilonMm &&
      Math.abs(annotation.y2 - end.y) <= epsilonMm) ||
    (Math.abs(annotation.x1 - end.x) <= epsilonMm &&
      Math.abs(annotation.y1 - end.y) <= epsilonMm &&
      Math.abs(annotation.x2 - start.x) <= epsilonMm &&
      Math.abs(annotation.y2 - start.y) <= epsilonMm);
  return same;
}

export type OpeningAlongWallDimInput = {
  /** Normalized centre position along the host wall (0–1). */
  position: number;
  widthMm: number;
};

/**
 * Opening-aware chain along one wall centreline: wall-start → opening edges
 * and each opening width, sorted by along-wall centre. Skips short segments.
 */
export function openingAlongWallDimensionDrafts(
  wall: Pick<PlannerWall, "start" | "end">,
  openings: readonly OpeningAlongWallDimInput[],
  offsetMm = DEFAULT_DIMENSION_OFFSET_MM,
  displayUnit: PlannerDisplayUnit = "mm",
): DimensionDraft[] {
  const length = linearLengthMm(wall.start, wall.end);
  if (length < MIN_DIMENSION_LENGTH_MM) return [];

  const ux = (wall.end.x - wall.start.x) / length;
  const uy = (wall.end.y - wall.start.y) / length;
  const pointAt = (alongMm: number): PlannerPoint => ({
    x: wall.start.x + ux * alongMm,
    y: wall.start.y + uy * alongMm,
  });

  const sorted = [...openings]
    .filter(
      (item) =>
        Number.isFinite(item.position) &&
        Number.isFinite(item.widthMm) &&
        item.widthMm > 0,
    )
    .map((item) => {
      const center = item.position * length;
      const half = item.widthMm / 2;
      return {
        startMm: center - half,
        endMm: center + half,
      };
    })
    .sort((a, b) => a.startMm - b.startMm);

  const chain: number[] = [0];
  for (const span of sorted) {
    chain.push(span.startMm, span.endMm);
  }
  chain.push(length);

  const drafts: DimensionDraft[] = [];
  for (let i = 0; i < chain.length - 1; i += 1) {
    const a = chain[i];
    const b = chain[i + 1];
    if (a === undefined || b === undefined) continue;
    if (b - a < MIN_DIMENSION_LENGTH_MM) continue;
    const draft = annotationDraftFromSegment(
      pointAt(a),
      pointAt(b),
      offsetMm,
      undefined,
      displayUnit,
    );
    if (draft) drafts.push(draft);
  }
  return drafts;
}
