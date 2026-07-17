import type { PlannerPoint } from "../../model/types";

export type SnapKind =
  | "none"
  | "endpoint"
  | "midpoint"
  | "intersection"
  | "perpendicular"
  | "nearest"
  | "grid"
  | "angle";

export interface SnapResult {
  point: PlannerPoint;
  kind: SnapKind;
  targetId?: string;
}

export interface SnapEndpoint {
  id: string;
  point: PlannerPoint;
  kind?: Exclude<SnapKind, "none" | "grid" | "angle">;
}

export interface SnapSegment {
  id: string;
  start: PlannerPoint;
  end: PlannerPoint;
}

function projectOnSegment(point: PlannerPoint, segment: SnapSegment): PlannerPoint | null {
  const dx = segment.end.x - segment.start.x;
  const dy = segment.end.y - segment.start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return null;
  const t = Math.min(
    1,
    Math.max(
      0,
      ((point.x - segment.start.x) * dx + (point.y - segment.start.y) * dy) /
        lengthSquared,
    ),
  );
  return { x: segment.start.x + dx * t, y: segment.start.y + dy * t };
}

function segmentIntersection(left: SnapSegment, right: SnapSegment): PlannerPoint | null {
  const r = { x: left.end.x - left.start.x, y: left.end.y - left.start.y };
  const s = { x: right.end.x - right.start.x, y: right.end.y - right.start.y };
  const cross = r.x * s.y - r.y * s.x;
  if (Math.abs(cross) < 1e-9) return null;
  const delta = { x: right.start.x - left.start.x, y: right.start.y - left.start.y };
  const t = (delta.x * s.y - delta.y * s.x) / cross;
  const u = (delta.x * r.y - delta.y * r.x) / cross;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: left.start.x + t * r.x, y: left.start.y + t * r.y };
}

/** CAD snap candidates derived from wall centrelines. */
export function buildSegmentSnapTargets(
  segments: readonly SnapSegment[],
  raw: PlannerPoint,
  start: PlannerPoint | null,
): SnapEndpoint[] {
  const targets: SnapEndpoint[] = [];
  for (const segment of segments) {
    targets.push(
      { id: `${segment.id}:start`, point: segment.start, kind: "endpoint" },
      { id: `${segment.id}:end`, point: segment.end, kind: "endpoint" },
      {
        id: `${segment.id}:midpoint`,
        point: {
          x: (segment.start.x + segment.end.x) / 2,
          y: (segment.start.y + segment.end.y) / 2,
        },
        kind: "midpoint",
      },
    );
    const nearest = projectOnSegment(raw, segment);
    if (nearest) {
      targets.push({ id: `${segment.id}:nearest`, point: nearest, kind: "nearest" });
    }
    if (start) {
      const perpendicular = projectOnSegment(start, segment);
      if (perpendicular) {
        targets.push({
          id: `${segment.id}:perpendicular`,
          point: perpendicular,
          kind: "perpendicular",
        });
      }
    }
  }
  for (let left = 0; left < segments.length; left += 1) {
    for (let right = left + 1; right < segments.length; right += 1) {
      const point = segmentIntersection(segments[left]!, segments[right]!);
      if (point) {
        targets.push({
          id: `${segments[left]!.id}:${segments[right]!.id}:intersection`,
          point,
          kind: "intersection",
        });
      }
    }
  }
  return targets;
}

export interface CanvasTransform {
  origin: PlannerPoint;
  scale: number;
}

export function projectToScreen(point: PlannerPoint, transform: CanvasTransform): PlannerPoint {
  return {
    x: (point.x - transform.origin.x) * transform.scale,
    y: (point.y - transform.origin.y) * transform.scale,
  };
}

export function screenToProject(point: PlannerPoint, transform: CanvasTransform): PlannerPoint {
  return {
    x: transform.origin.x + point.x / transform.scale,
    y: transform.origin.y + point.y / transform.scale,
  };
}

export function zoomTransformAt(
  transform: CanvasTransform,
  screenPoint: PlannerPoint,
  factor: number,
  minimumScale = 0.02,
  maximumScale = 2,
): CanvasTransform {
  const projectAnchor = screenToProject(screenPoint, transform);
  const scale = Math.min(maximumScale, Math.max(minimumScale, transform.scale * factor));
  return {
    scale,
    origin: {
      x: projectAnchor.x - screenPoint.x / scale,
      y: projectAnchor.y - screenPoint.y / scale,
    },
  };
}

/** Screen coordinates relative to a viewport host element (CSS pixels). */
export function viewportPointFromHost(
  host: HTMLElement,
  clientX: number,
  clientY: number,
): PlannerPoint {
  const rect = host.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

/** Normalize wheel delta across pixel / line / page modes. */
export function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  switch (deltaMode) {
    case 1:
      return deltaY * 16;
    case 2:
      return deltaY * (typeof window !== "undefined" ? window.innerHeight : 800);
    case 0:
    default:
      return deltaY;
  }
}

/** Smooth wheel zoom factor (matches Fabric planner canvas feel). */
export function wheelZoomFactor(deltaY: number, deltaMode = 0): number {
  return Math.pow(0.999, normalizeWheelDelta(deltaY, deltaMode));
}

function distance(a: PlannerPoint, b: PlannerPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function snapDrawingPoint(input: {
  raw: PlannerPoint;
  start: PlannerPoint | null;
  endpoints: readonly PlannerPoint[];
  endpointTargets?: readonly SnapEndpoint[];
  zoom: number;
  suppress: boolean;
  gridMm?: number;
  screenTolerancePx?: number;
  /** Angle increment after grid snap. Use 90 for an orthogonal lock. */
  angleIncrementDegrees?: number;
}): SnapResult {
  // Complex snap (endpoint+grid+angle) simplified comments only; core retained (used by canvas).
  if (input.suppress) return { point: input.raw, kind: "none" };

  const toleranceMm = (input.screenTolerancePx ?? 12) / input.zoom;
  const targets: readonly SnapEndpoint[] = input.endpointTargets
    ?? input.endpoints.map((point, index) => ({
      id: String(index),
      point,
      kind: "endpoint" as const,
    }));
  const kindPriority: Record<NonNullable<SnapEndpoint["kind"]>, number> = {
    endpoint: 0,
    midpoint: 1,
    intersection: 2,
    perpendicular: 3,
    nearest: 4,
  };
  const endpoint = targets
    .map((target, index) => ({
      ...target,
      distance: distance(target.point, input.raw),
      index,
    }))
    .filter((target) => target.distance <= toleranceMm)
    .sort((left, right) =>
      left.distance - right.distance
      || kindPriority[left.kind ?? "endpoint"] - kindPriority[right.kind ?? "endpoint"]
      || left.id.localeCompare(right.id)
      || left.index - right.index
    )[0];
  if (endpoint) {
    return input.endpointTargets
      ? { point: endpoint.point, kind: endpoint.kind ?? "endpoint", targetId: endpoint.id }
      : { point: endpoint.point, kind: "endpoint" };
  }

  const grid = input.gridMm ?? 100;
  const gridPoint = {
    x: Math.round(input.raw.x / grid) * grid,
    y: Math.round(input.raw.y / grid) * grid,
  };
  if (!input.start) return { point: gridPoint, kind: "grid" };

  const dx = gridPoint.x - input.start.x;
  const dy = gridPoint.y - input.start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return { point: gridPoint, kind: "grid" };
  const angleIncrementDegrees = input.angleIncrementDegrees ?? 45;
  const step = (angleIncrementDegrees * Math.PI) / 180;
  const angle = Math.round(Math.atan2(dy, dx) / step) * step;
  return {
    point: {
      x: input.start.x + Math.cos(angle) * length,
      y: input.start.y + Math.sin(angle) * length,
    },
    kind: "angle",
  };
}
