export type AlignAxis = "x" | "y";
export type AlignAnchor = "min" | "center" | "max";
export type DistributeAxis = "x" | "y";

/**
 * Axis-aligned entity pose for bulk layout helpers.
 * `xMm` / `yMm` are **min edges** of the AABB (top-left in plan mm).
 * Convert from center-origin furniture before calling; convert back after.
 */
export interface PositionedEntity {
  id: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  depthMm: number;
}

export type EntityPositionUpdate = { id: string; xMm: number; yMm: number };

function extents(entities: readonly PositionedEntity[], axis: AlignAxis) {
  let min = Infinity;
  let max = -Infinity;
  for (const e of entities) {
    const pos = axis === "x" ? e.xMm : e.yMm;
    const size = axis === "x" ? e.widthMm : e.depthMm;
    if (pos < min) min = pos;
    if (pos + size > max) max = pos + size;
  }
  return { min, max };
}

export function alignEntities(
  entities: readonly PositionedEntity[],
  axis: AlignAxis,
  anchor: AlignAnchor,
): EntityPositionUpdate[] {
  if (entities.length < 2) return [];

  const { min, max } = extents(entities, axis);

  let target: number;
  if (anchor === "min") {
    target = min;
  } else if (anchor === "max") {
    target = max;
  } else {
    target = (min + max) / 2;
  }

  return entities.map((e) => {
    const size = axis === "x" ? e.widthMm : e.depthMm;
    const newPos = anchor === "center" ? target - size / 2 : anchor === "min" ? target : target - size;
    return {
      id: e.id,
      xMm: axis === "x" ? newPos : e.xMm,
      yMm: axis === "y" ? newPos : e.yMm,
    };
  });
}

/**
 * Equalise edge-to-edge gaps between first and last (both stay fixed).
 * Requires 3+ entities. Positions use min-edge convention.
 */
export function distributeEntities(
  entities: readonly PositionedEntity[],
  axis: DistributeAxis,
): EntityPositionUpdate[] {
  if (entities.length < 3) return [];

  const sorted = [...entities].sort((a, b) =>
    axis === "x" ? a.xMm - b.xMm : a.yMm - b.yMm,
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return [];
  const firstLeading = axis === "x" ? first.xMm : first.yMm;
  const lastLeading = axis === "x" ? last.xMm : last.yMm;
  const lastSize = axis === "x" ? last.widthMm : last.depthMm;
  const lastTrailing = lastLeading + lastSize;
  const totalSpan = lastTrailing - firstLeading;
  const totalSize = sorted.reduce(
    (sum, e) => sum + (axis === "x" ? e.widthMm : e.depthMm),
    0,
  );
  const free = totalSpan - totalSize;
  const gap = free / (sorted.length - 1);

  const updates: EntityPositionUpdate[] = [];
  let leading = firstLeading;
  for (let i = 0; i < sorted.length; i += 1) {
    const e = sorted[i];
    if (!e) continue;
    const size = axis === "x" ? e.widthMm : e.depthMm;
    if (i === 0) {
      updates.push({ id: e.id, xMm: e.xMm, yMm: e.yMm });
      leading = firstLeading + size + gap;
      continue;
    }
    if (i === sorted.length - 1) {
      updates.push({ id: e.id, xMm: e.xMm, yMm: e.yMm });
      continue;
    }
    updates.push({
      id: e.id,
      xMm: axis === "x" ? leading : e.xMm,
      yMm: axis === "y" ? leading : e.yMm,
    });
    leading = leading + size + gap;
  }

  return updates;
}

/**
 * Pack entities along an axis with a fixed clear gap (mm) between consecutive AABBs.
 * First entity (min leading edge) stays fixed; others shift.
 * Positions use min-edge convention. Requires 2+ entities.
 */
export function spaceEntitiesWithExactGap(
  entities: readonly PositionedEntity[],
  axis: DistributeAxis,
  gapMm: number,
): EntityPositionUpdate[] {
  if (entities.length < 2) return [];

  const gap = Math.max(0, Number.isFinite(gapMm) ? gapMm : 0);
  const sorted = [...entities].sort((a, b) =>
    axis === "x" ? a.xMm - b.xMm : a.yMm - b.yMm,
  );

  const updates: EntityPositionUpdate[] = [];
  const head = sorted[0];
  if (!head) return [];
  let leading = axis === "x" ? head.xMm : head.yMm;

  for (let i = 0; i < sorted.length; i += 1) {
    const e = sorted[i];
    if (!e) continue;
    const size = axis === "x" ? e.widthMm : e.depthMm;
    if (i === 0) {
      updates.push({ id: e.id, xMm: e.xMm, yMm: e.yMm });
      leading = (axis === "x" ? e.xMm : e.yMm) + size + gap;
      continue;
    }
    updates.push({
      id: e.id,
      xMm: axis === "x" ? leading : e.xMm,
      yMm: axis === "y" ? leading : e.yMm,
    });
    leading = leading + size + gap;
  }

  return updates;
}

/** Min-edge ↔ center conversion for furniture that stores position as center. */
export function minEdgeFromCenter(
  cxMm: number,
  cyMm: number,
  widthMm: number,
  depthMm: number,
): { xMm: number; yMm: number } {
  return {
    xMm: cxMm - widthMm / 2,
    yMm: cyMm - depthMm / 2,
  };
}

export function centerFromMinEdge(
  xMm: number,
  yMm: number,
  widthMm: number,
  depthMm: number,
): { cxMm: number; cyMm: number } {
  return {
    cxMm: xMm + widthMm / 2,
    cyMm: yMm + depthMm / 2,
  };
}
