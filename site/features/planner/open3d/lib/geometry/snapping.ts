import type { Open3dPoint } from "../../model/types";

export type SnapKind = "none" | "endpoint" | "grid" | "angle";

export interface SnapResult {
  point: Open3dPoint;
  kind: SnapKind;
  targetId?: string;
}

export interface SnapEndpoint {
  id: string;
  point: Open3dPoint;
}

export interface CanvasTransform {
  origin: Open3dPoint;
  scale: number;
}

export function projectToScreen(point: Open3dPoint, transform: CanvasTransform): Open3dPoint {
  return {
    x: (point.x - transform.origin.x) * transform.scale,
    y: (point.y - transform.origin.y) * transform.scale,
  };
}

export function screenToProject(point: Open3dPoint, transform: CanvasTransform): Open3dPoint {
  return {
    x: transform.origin.x + point.x / transform.scale,
    y: transform.origin.y + point.y / transform.scale,
  };
}

export function zoomTransformAt(
  transform: CanvasTransform,
  screenPoint: Open3dPoint,
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
): Open3dPoint {
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

function distance(a: Open3dPoint, b: Open3dPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function snapDrawingPoint(input: {
  raw: Open3dPoint;
  start: Open3dPoint | null;
  endpoints: readonly Open3dPoint[];
  endpointTargets?: readonly SnapEndpoint[];
  zoom: number;
  suppress: boolean;
  gridMm?: number;
  screenTolerancePx?: number;
}): SnapResult {
  // Complex snap (endpoint+grid+angle) simplified comments only; core retained (used by canvas).
  if (input.suppress) return { point: input.raw, kind: "none" };

  const toleranceMm = (input.screenTolerancePx ?? 12) / input.zoom;
  const targets = input.endpointTargets
    ?? input.endpoints.map((point, index) => ({ id: String(index), point }));
  const endpoint = targets
    .map((target, index) => ({
      ...target,
      distance: distance(target.point, input.raw),
      index,
    }))
    .filter((target) => target.distance <= toleranceMm)
    .sort((left, right) =>
      left.distance - right.distance
      || left.id.localeCompare(right.id)
      || left.index - right.index
    )[0];
  if (endpoint) {
    return input.endpointTargets
      ? { point: endpoint.point, kind: "endpoint", targetId: endpoint.id }
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
  const step = Math.PI / 4;
  const angle = Math.round(Math.atan2(dy, dx) / step) * step;
  return {
    point: {
      x: input.start.x + Math.cos(angle) * length,
      y: input.start.y + Math.sin(angle) * length,
    },
    kind: "angle",
  };
}
