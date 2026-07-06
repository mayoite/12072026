import DxfParser from 'dxf-parser';
import type { Point, XRefDxfEntity } from '$lib/models/types';

type ParsedPoint = { x: number; y: number };
type ParsedEntity =
  | { type: 'LINE'; vertices?: ParsedPoint[]; start?: ParsedPoint; end?: ParsedPoint }
  | { type: 'LWPOLYLINE'; vertices?: Array<ParsedPoint & { bulge?: number }>; shape?: boolean; closed?: boolean }
  | { type: 'POLYLINE'; vertices?: Array<ParsedPoint & { bulge?: number }>; shape?: boolean; closed?: boolean }
  | { type: 'ARC'; center?: ParsedPoint; radius?: number; startAngle?: number; endAngle?: number; angleLength?: number }
  | { type: string; [key: string]: unknown };

function dedupePoints(points: Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 1e-6) out.push(p);
  }
  return out;
}

function toPoint(p?: ParsedPoint): Point | null {
  if (!p) return null;
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
  return { x: p.x, y: p.y };
}

function isClosedPolyline(entity: ParsedEntity): boolean {
  return Boolean(entity.shape || entity.closed);
}

function pointsFromEntity(entity: ParsedEntity): XRefDxfEntity | null {
  if (entity.type === 'LINE') {
    const vertices = entity.vertices ?? [entity.start, entity.end].filter(Boolean) as ParsedPoint[];
    if (vertices.length < 2) return null;
    const points = vertices.map(toPoint).filter((p): p is Point => p !== null);
    if (points.length < 2) return null;
    return { type: 'LINE', points: [points[0], points[points.length - 1]] };
  }

  if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
    const points = (entity.vertices ?? []).map(toPoint).filter((p): p is Point => p !== null);
    if (points.length < 2) return null;
    const closed = isClosedPolyline(entity);
    return { type: entity.type, points: dedupePoints(points), closed };
  }

  if (entity.type === 'ARC') {
    const center = toPoint(entity.center);
    const radius = entity.radius;
    const startAngle = entity.startAngle;
    const endAngle = entity.endAngle;
    if (!center || !Number.isFinite(radius) || !Number.isFinite(startAngle) || !Number.isFinite(endAngle)) return null;

    const sweep = (((endAngle as number) - (startAngle as number)) % 360 + 360) % 360 || 360;
    const segments = Math.max(8, Math.ceil(sweep / 20));
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = ((startAngle as number) + (sweep * i) / segments) * Math.PI / 180;
      points.push({
        x: center.x + Math.cos(angle) * (radius as number),
        y: center.y + Math.sin(angle) * (radius as number),
      });
    }
    return {
      type: 'ARC',
      points,
      center,
      radius: radius as number,
      startAngle: startAngle as number,
      endAngle: endAngle as number,
    };
  }

  return null;
}

export function parseDxf(text: string, scale = 1): XRefDxfEntity[] {
  const parser = new DxfParser();
  const parsed = parser.parseSync(text);
  if (!parsed?.entities?.length) return [];

  const entities: XRefDxfEntity[] = [];
  for (const raw of parsed.entities as ParsedEntity[]) {
    const ent = pointsFromEntity(raw);
    if (!ent) continue;
    entities.push({
      ...ent,
      points: ent.points.map((p) => ({ x: p.x * scale, y: p.y * scale })),
      center: ent.center ? { x: ent.center.x * scale, y: ent.center.y * scale } : undefined,
      radius: ent.radius != null ? ent.radius * scale : undefined,
    });
  }
  return entities;
}

export function computeXRefSnapPoints(entities: XRefDxfEntity[]): Point[] {
  const points: Point[] = [];
  for (const ent of entities) {
    if (ent.points.length === 0) continue;
    points.push(ent.points[0]);
    for (let i = 1; i < ent.points.length; i++) {
      const a = ent.points[i - 1];
      const b = ent.points[i];
      points.push(b);
      points.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    }
    if (ent.closed && ent.points.length > 2) {
      const a = ent.points[ent.points.length - 1];
      const b = ent.points[0];
      points.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    }
  }
  return dedupePoints(points);
}

export function transformXRefPoint(point: Point, position: Point, rotationDeg: number, scale = 1): Point {
  const rad = rotationDeg * Math.PI / 180;
  const x = point.x * scale;
  const y = point.y * scale;
  return {
    x: position.x + x * Math.cos(rad) - y * Math.sin(rad),
    y: position.y + x * Math.sin(rad) + y * Math.cos(rad),
  };
}
