/**
 * Pure grid spacing for bulk placement (array / row / grid layout at scale).
 * Document-agnostic: returns plan-mm cell origins only; callers stamp furniture.
 *
 * Origins are whatever convention the caller uses (center or min-edge).
 * Pitch = size + clear gap on that same convention (center-to-center when
 * origins are centers).
 */

export type GridLayoutCell = {
  index: number;
  xMm: number;
  yMm: number;
};

export type GridLayoutOptions = {
  /** Horizontal origin spacing (default: cellWidthMm + gapMm). */
  pitchXMm?: number;
  /** Vertical origin spacing (default: cellDepthMm + gapMm). */
  pitchYMm?: number;
  /** Aisle/gap between cells when pitch is not explicit (default 200 mm). */
  gapMm?: number;
  /** Independent Y gap when rows need a different aisle (default: gapMm). */
  gapYMm?: number;
  /** Cells per row (default 10). */
  columns?: number;
  /** Top-left / first-cell origin for cell 0 (default {0,0}). */
  originMm?: { x: number; y: number };
};

function positive(n: number, fallback: number): number {
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function nonNegative(n: number, fallback: number): number {
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Origin pitch from footprint size + clear gap.
 * Works for center-to-center and min-edge-to-min-edge origins.
 */
export function pitchFromClearGap(sizeMm: number, gapMm: number): number {
  return positive(sizeMm, 1) + nonNegative(gapMm, 0);
}

/**
 * Lay out `count` axis-aligned cells on a row-major grid.
 * Cell (i) sits at origin + (col * pitchX, row * pitchY).
 */
export function layoutGridPositions(
  count: number,
  cellWidthMm: number,
  cellDepthMm: number,
  options?: GridLayoutOptions,
): GridLayoutCell[] {
  const n = Math.max(0, Math.floor(count));
  const width = positive(cellWidthMm, 1);
  const depth = positive(cellDepthMm, 1);
  const gapX = nonNegative(options?.gapMm ?? 200, 200);
  const gapY = nonNegative(options?.gapYMm ?? gapX, gapX);
  const pitchX = positive(options?.pitchXMm ?? pitchFromClearGap(width, gapX), width + gapX);
  const pitchY = positive(options?.pitchYMm ?? pitchFromClearGap(depth, gapY), depth + gapY);
  const columns = Math.max(1, Math.floor(options?.columns ?? 10));
  const origin = options?.originMm ?? { x: 0, y: 0 };

  const cells: GridLayoutCell[] = [];
  for (let i = 0; i < n; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    cells.push({
      index: i,
      xMm: origin.x + col * pitchX,
      yMm: origin.y + row * pitchY,
    });
  }
  return cells;
}

/**
 * Single-row array: `count` cells along X with exact clear gap.
 */
export function layoutRowPositions(
  count: number,
  cellWidthMm: number,
  gapMm: number,
  originMm: { x: number; y: number } = { x: 0, y: 0 },
): GridLayoutCell[] {
  return layoutGridPositions(count, cellWidthMm, 1, {
    columns: Math.max(1, Math.floor(count)),
    gapMm,
    originMm,
  });
}
