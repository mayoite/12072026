export type AlignAxis = "x" | "y";
export type AlignAnchor = "min" | "center" | "max";
export type DistributeAxis = "x" | "y";

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

export function distributeEntities(
  entities: readonly PositionedEntity[],
  axis: DistributeAxis,
): EntityPositionUpdate[] {
  if (entities.length < 3) return [];

  const sorted = [...entities].sort((a, b) =>
    axis === "x" ? a.xMm - b.xMm : a.yMm - b.yMm,
  );

  const { min, max } = extents(sorted, axis);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstEdge = axis === "x" ? first.xMm : first.yMm;
  const lastEdge = axis === "x" ? last.xMm + last.widthMm : last.yMm + last.depthMm;
  const totalSpan = lastEdge - firstEdge;
  const totalGaps = sorted.length - 1;

  const updates: EntityPositionUpdate[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const e = sorted[i];
    if (i === 0 || i === sorted.length - 1) {
      // keep first and last in place
      updates.push({ id: e.id, xMm: e.xMm, yMm: e.yMm });
      continue;
    }
    const size = axis === "x" ? e.widthMm : e.depthMm;
    const newPos = firstEdge + (totalSpan / totalGaps) * i - (i > 0 ? size / 2 : 0);
    updates.push({
      id: e.id,
      xMm: axis === "x" ? newPos : e.xMm,
      yMm: axis === "y" ? newPos : e.yMm,
    });
  }

  // resolve implicit centers from gaps
  const explicitUpdates: EntityPositionUpdate[] = [];
  const gaps = totalSpan / totalGaps;
  for (let i = 0; i < sorted.length; i++) {
    const e = sorted[i];
    if (i === 0) {
      explicitUpdates.push({ id: e.id, xMm: e.xMm, yMm: e.yMm });
    } else {
      const prev = explicitUpdates[i - 1];
      const prevEdge = axis === "x" ? prev.xMm + sorted[i - 1].widthMm : prev.yMm + sorted[i - 1].depthMm;
      const newPos = prevEdge + gaps;
      explicitUpdates.push({
        id: e.id,
        xMm: axis === "x" ? newPos : e.xMm,
        yMm: axis === "y" ? newPos : e.yMm,
      });
    }
  }

  return explicitUpdates;
}
