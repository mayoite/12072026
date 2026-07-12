/**
 * Pure grid spacing for bulk placement (array / row / grid layout at scale).
 * Document-agnostic: returns plan-mm cell origins only; callers stamp furniture.
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
  /** Cells per row (default 10). */
  columns?: number;
  /** Top-left origin for cell 0 (default {0,0}). */
  originMm?: { x: number; y: number };
};

function positive(n: number, fallback: number): number {
  return Number.isFinite(n) && n > 0 ? n : fallback;
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
  const gap = positive(options?.gapMm ?? 200, 200);
  const pitchX = positive(options?.pitchXMm ?? width + gap, width + gap);
  const pitchY = positive(options?.pitchYMm ?? depth + gap, depth + gap);
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