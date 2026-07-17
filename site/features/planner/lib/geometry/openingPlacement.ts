import type {
  PlannerDoor,
  PlannerPoint,
  PlannerWall,
  PlannerWindow,
} from "@/features/planner/model/types";
import { DEFAULT_WALL_THICKNESS_MM } from "@/features/planner/model/wallContract";

export const DEFAULT_DOOR_WIDTH_MM = 900;
export const DEFAULT_WINDOW_WIDTH_MM = 1200;
export const OPENING_END_MARGIN_MM = 80;
export const OPENING_GAP_MM = 60;
/** Perpendicular slack beyond half wall thickness (mm). */
export const OPENING_PICK_SLACK_MM = 80;

export type OpeningPlacementRejectReason =
  | "off-wall"
  | "wall-end"
  | "overlap"
  | "wall-too-short";

export interface ResolvedOpeningPlacement {
  wallId: string;
  /** Normalized centre position along the host wall (0–1). */
  position: number;
  angleRadians: number;
}

export interface OpeningPlacementReject {
  rejected: true;
  reason: OpeningPlacementRejectReason;
}

export type OpeningPlacementResult =
  | ResolvedOpeningPlacement
  | OpeningPlacementReject;

function wallLengthMm(wall: Pick<PlannerWall, "start" | "end">): number {
  return Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
}

function projectOntoWall(
  point: PlannerPoint,
  wall: PlannerWall,
): { t: number; along: number; distance: number } {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) {
    return {
      t: 0,
      along: 0,
      distance: Math.hypot(point.x - wall.start.x, point.y - wall.start.y),
    };
  }
  const raw =
    ((point.x - wall.start.x) * dx + (point.y - wall.start.y) * dy) / lengthSq;
  const t = Math.max(0, Math.min(1, raw));
  const px = wall.start.x + dx * t;
  const py = wall.start.y + dy * t;
  return {
    t,
    along: t * Math.sqrt(lengthSq),
    distance: Math.hypot(point.x - px, point.y - py),
  };
}

export function wallOpeningPickToleranceMm(wall: PlannerWall): number {
  const thickness =
    wall.thickness > 0 ? wall.thickness : DEFAULT_WALL_THICKNESS_MM;
  return thickness / 2 + OPENING_PICK_SLACK_MM;
}

export function clampOpeningCenterAlongMm(
  wallLengthUnits: number,
  alongMm: number,
  openingWidthMm: number,
  endMarginMm = OPENING_END_MARGIN_MM,
): number {
  const half = openingWidthMm / 2;
  const min = half + endMarginMm;
  const max = wallLengthUnits - half - endMarginMm;
  if (min > max) return wallLengthUnits / 2;
  return Math.max(min, Math.min(max, alongMm));
}

export function openingSpansOverlap(
  a: { start: number; end: number },
  b: { start: number; end: number },
  gapMm = OPENING_GAP_MM,
): boolean {
  return a.start < b.end + gapMm && b.start < a.end + gapMm;
}

export function openingSpanFromNormalized(
  wallLengthUnits: number,
  position: number,
  widthMm: number,
): { start: number; end: number; center: number } {
  const center = position * wallLengthUnits;
  return { start: center - widthMm / 2, end: center + widthMm / 2, center };
}

export function collectOpeningSpansOnWall(
  wallId: string,
  wallLength: number,
  doors: readonly PlannerDoor[],
  windows: readonly PlannerWindow[],
  excludeId?: string,
): Array<{ id: string; start: number; end: number }> {
  const spans: Array<{ id: string; start: number; end: number }> = [];
  for (const door of doors) {
    if (door.wallId !== wallId) continue;
    if (excludeId && door.id === excludeId) continue;
    const { start, end } = openingSpanFromNormalized(
      wallLength,
      door.position,
      door.width,
    );
    spans.push({ id: door.id, start, end });
  }
  for (const window of windows) {
    if (window.wallId !== wallId) continue;
    if (excludeId && window.id === excludeId) continue;
    const { start, end } = openingSpanFromNormalized(
      wallLength,
      window.position,
      window.width,
    );
    spans.push({ id: window.id, start, end });
  }
  return spans;
}

export function openingLineEndpointsMm(
  wall: PlannerWall,
  position: number,
  widthMm: number,
): { start: PlannerPoint; end: PlannerPoint } {
  const length = wallLengthMm(wall);
  if (length <= 0) {
    return { start: { ...wall.start }, end: { ...wall.start } };
  }
  const center = {
    x: wall.start.x + (wall.end.x - wall.start.x) * position,
    y: wall.start.y + (wall.end.y - wall.start.y) * position,
  };
  const unit = {
    x: (wall.end.x - wall.start.x) / length,
    y: (wall.end.y - wall.start.y) / length,
  };
  const half = widthMm / 2;
  return {
    start: {
      x: center.x - unit.x * half,
      y: center.y - unit.y * half,
    },
    end: {
      x: center.x + unit.x * half,
      y: center.y + unit.y * half,
    },
  };
}

export function defaultOpeningWidthMm(kind: "door" | "window"): number {
  return kind === "window" ? DEFAULT_WINDOW_WIDTH_MM : DEFAULT_DOOR_WIDTH_MM;
}

/**
 * Project a world point onto a known host wall and clamp the opening centre
 * for end margins. Used for live drag preview. Does not check overlap.
 * Stays on the given wall even when the pointer leaves the wall pick band.
 */
export function projectOpeningAlongHostWall(
  point: PlannerPoint,
  wall: PlannerWall,
  openingWidthMm: number,
): OpeningPlacementResult {
  if (openingWidthMm <= 0 || !Number.isFinite(openingWidthMm)) {
    return { rejected: true, reason: "wall-too-short" };
  }
  const length = wallLengthMm(wall);
  if (length <= 0 || openingWidthMm >= length) {
    return { rejected: true, reason: "wall-too-short" };
  }

  const projection = projectOntoWall(point, wall);
  const clampedAlong = clampOpeningCenterAlongMm(
    length,
    projection.along,
    openingWidthMm,
  );
  const half = openingWidthMm / 2;
  const span = { start: clampedAlong - half, end: clampedAlong + half };

  if (
    span.start < OPENING_END_MARGIN_MM ||
    span.end > length - OPENING_END_MARGIN_MM
  ) {
    return { rejected: true, reason: "wall-end" };
  }

  return {
    wallId: wall.id,
    position: clampedAlong / length,
    angleRadians: Math.atan2(
      wall.end.y - wall.start.y,
      wall.end.x - wall.start.x,
    ),
  };
}

/**
 * Reposition an existing opening on its host wall with end + overlap guards.
 * Always stays on `wall` (does not re-host). Pass the moving opening as excludeId.
 */
export function resolveOpeningRepositionOnHostWall(
  point: PlannerPoint,
  wall: PlannerWall,
  openingWidthMm: number,
  doors: readonly PlannerDoor[],
  windows: readonly PlannerWindow[],
  options: { excludeId: string },
): OpeningPlacementResult {
  const projected = projectOpeningAlongHostWall(point, wall, openingWidthMm);
  if ("rejected" in projected) return projected;

  const length = wallLengthMm(wall);
  const span = openingSpanFromNormalized(
    length,
    projected.position,
    openingWidthMm,
  );
  const existing = collectOpeningSpansOnWall(
    wall.id,
    length,
    doors,
    windows,
    options.excludeId,
  );
  for (const other of existing) {
    if (openingSpansOverlap(span, other)) {
      return { rejected: true, reason: "overlap" };
    }
  }
  return projected;
}

export function resolveOpeningPlacementAtPoint(
  point: PlannerPoint,
  walls: readonly PlannerWall[],
  openingWidthMm: number,
  doors: readonly PlannerDoor[],
  windows: readonly PlannerWindow[],
  options?: { excludeId?: string },
): OpeningPlacementResult {
  if (openingWidthMm <= 0 || !Number.isFinite(openingWidthMm)) {
    return { rejected: true, reason: "wall-too-short" };
  }

  let best: {
    wall: PlannerWall;
    distance: number;
  } | null = null;

  for (const wall of walls) {
    const length = wallLengthMm(wall);
    if (length <= 0) continue;
    if (openingWidthMm >= length) continue;

    const tolerance = wallOpeningPickToleranceMm(wall);
    const projection = projectOntoWall(point, wall);
    if (projection.distance > tolerance) continue;

    if (!best || projection.distance < best.distance) {
      best = { wall, distance: projection.distance };
    }
  }

  if (!best) {
    return { rejected: true, reason: "off-wall" };
  }

  return resolveOpeningRepositionOnHostWall(
    point,
    best.wall,
    openingWidthMm,
    doors,
    windows,
    { excludeId: options?.excludeId ?? "" },
  );
}

export function openingPlacementRejectMessage(
  reason: OpeningPlacementRejectReason,
): string {
  switch (reason) {
    case "off-wall":
      return "Click closer to a wall to place the opening.";
    case "wall-end":
      return "Opening is too close to the wall end.";
    case "overlap":
      return "Opening overlaps another opening on this wall.";
    case "wall-too-short":
      return "Wall is too short for this opening width.";
    default: {
      const _exhaustive: never = reason;
      return _exhaustive;
    }
  }
}
