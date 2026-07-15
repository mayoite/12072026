/**
 * gridSnapping.ts
 *
 * Real-world grid snapping for embedded Excalidraw.
 *
 * Design notes:
 * ─────────────
 * • The RECOMMENDED way to enable Excalidraw's native drag/resize snapping is
 *   to pass `gridSize={getGridSizeInPixels(unit)}` to <Excalidraw>.
 *   This hook returns `gridSizePx` precisely for that purpose.
 *
 * • `applyGridBackground` adds locked line elements as a visual grid background.
 *   They are identifiable via `el.customData.isGridLine === true` and are
 *   prepended to the scene array so they sit behind all user elements.
 *
 * • The `onChangeHandler` in the hook's return value implements an additional
 *   software-snap layer on top of native Excalidraw snapping. Pass it to
 *   <Excalidraw onChange={onChangeHandler}> alongside any other onChange logic.
 *
 * Wiring example in ExcalidrawClient:
 *
 *   const { gridSizePx, onChangeHandler } = useGridSnapping(api, unit, enabled);
 *
 *   <Excalidraw
 *     excalidrawAPI={setAPI}
 *     gridSize={gridSizePx}
 *     onChange={(els, state, files) => {
 *       onChangeHandler(els, state);
 *       yourOwnOnChange(els, state, files);
 *     }}
 *   />
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import { UnitSystem, PIXELS_PER_METER } from "./units";
import type { ExcalidrawAPI, ExcalidrawElement } from "./elementUtils";

// ─── Constants ────────────────────────────────────────────────────────────

/** Metric snap interval in centimetres. */
export const GRID_SIZE_METRIC_CM = 10;
/** Imperial snap interval in inches. */
export const GRID_SIZE_IMPERIAL_INCH = 6;
/** Stroke opacity for grid lines (0–1). */
export const GRID_LINE_OPACITY = 0.08;

const INCHES_PER_METER = 39.3701;

// ─── 1. getGridSizeInPixels ───────────────────────────────────────────────

/**
 * Returns the grid step size in Excalidraw canvas pixels for the given unit.
 *
 * Metric:   10 cm → (10 / 100) × PIXELS_PER_METER =  10 px  (at scale 100 px/m)
 * Imperial: 6 in  →  6 × (PIXELS_PER_METER / 39.3701) ≈ 15.24 px
 */
export function getGridSizeInPixels(unit: UnitSystem): number {
  if (unit === "metric") {
    return (GRID_SIZE_METRIC_CM / 100) * PIXELS_PER_METER;
  }
  return GRID_SIZE_IMPERIAL_INCH * (PIXELS_PER_METER / INCHES_PER_METER);
}

// ─── 2. snapToGrid ───────────────────────────────────────────────────────

/**
 * Rounds a single pixel value to the nearest grid line.
 */
export function snapToGrid(valueInPixels: number, unit: UnitSystem): number {
  const step = getGridSizeInPixels(unit);
  if (step <= 0) return valueInPixels;
  return Math.round(valueInPixels / step) * step;
}

// ─── 3. snapPointToGrid ──────────────────────────────────────────────────

/**
 * Snaps both axes of a 2-D point to the nearest grid intersection.
 */
export function snapPointToGrid(
  x: number,
  y: number,
  unit: UnitSystem
): { x: number; y: number } {
  return { x: snapToGrid(x, unit), y: snapToGrid(y, unit) };
}

// ─── 4. generateGridLines ────────────────────────────────────────────────

/**
 * Returns an array of line coordinates that cover the canvas area.
 * Vertical lines run the full canvas height; horizontal lines run the width.
 */
export function generateGridLines(
  canvasWidth: number,
  canvasHeight: number,
  unit: UnitSystem
): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  const step = getGridSizeInPixels(unit);
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  // Vertical lines
  for (let x = 0; x <= canvasWidth; x += step) {
    lines.push({ x1: x, y1: 0, x2: x, y2: canvasHeight });
  }
  // Horizontal lines
  for (let y = 0; y <= canvasHeight; y += step) {
    lines.push({ x1: 0, y1: y, x2: canvasWidth, y2: y });
  }

  return lines;
}

// ─── Element builder ──────────────────────────────────────────────────────

let _idCounter = 0;
function nextId(): string {
  return `grid-${Date.now()}-${++_idCounter}`;
}

function buildGridLineElement(
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): ExcalidrawElement {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return {
    id,
    type: "line",
    x: x1,
    y: y1,
    width: dx,
    height: dy,
    angle: 0,
    strokeColor: "#888888",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 0,
    // Excalidraw opacity is 0-100
    opacity: Math.round(GRID_LINE_OPACITY * 100),
    points: [[0, 0], [dx, dy]],
    groupIds: [],
    boundElements: null,
    updated: Date.now(),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1_000_000_000),
    isDeleted: false,
    locked: true,
    customData: { isGridLine: true },
  } as unknown as ExcalidrawElement;
}

// ─── 5. applyGridBackground ──────────────────────────────────────────────

/**
 * Replaces any existing grid-line elements with a fresh set for the given unit
 * and canvas size, then calls `api.updateScene()`.
 *
 * Grid elements are prepended to the scene array so they render behind all
 * user content.
 *
 * @param canvasDimensions  Pixel extent of the drawable area. Default: 3000×3000.
 */
export function applyGridBackground(
  api: ExcalidrawAPI,
  canvasDimensions: { width: number; height: number } = { width: 3000, height: 3000 },
  unit: UnitSystem
): void {
  const existing = api.getSceneElements() as unknown as Array<
    ExcalidrawElement & { customData?: Record<string, unknown> }
  >;

  // Keep only non-grid (user) elements
  const userElements = existing.filter(
    (el) => !el.customData?.isGridLine
  );

  // Build new grid lines with deterministic IDs so they survive hot-reload
  const coords = generateGridLines(canvasDimensions.width, canvasDimensions.height, unit);
  const gridElements: ExcalidrawElement[] = coords.map((c, i) =>
    buildGridLineElement(`grid-${unit}-${i}`, c.x1, c.y1, c.x2, c.y2)
  );

  // Grid first → rendered behind user elements
  api.updateScene({
    elements: [...gridElements, ...userElements] as readonly ExcalidrawElement[],
  });
}

// ─── 6. useGridSnapping (React hook) ─────────────────────────────────────

export interface GridSnappingResult {
  /** Pass to <Excalidraw gridSize={…}> for native Excalidraw snapping. */
  gridSizePx: number;
  /**
   * Wire to <Excalidraw onChange={…}> to apply an additional software-snap
   * layer. If you already have an onChange handler, compose them:
   *
   *   onChange={(els, state, files) => {
   *     onChangeHandler(els, state);
   *     yourHandler(els, state, files);
   *   }}
   */
  onChangeHandler: (
    elements: readonly ExcalidrawElement[],
    appState: Record<string, unknown>
  ) => void;
}

/**
 * Sets up a real-world grid inside an embedded Excalidraw instance.
 *
 * Responsibilities:
 *  1. Applies a visual grid background on mount and whenever `unit` changes.
 *  2. Returns `gridSizePx` so the parent can pass it to `<Excalidraw gridSize>`.
 *  3. Returns `onChangeHandler` for software-snap of selected elements.
 *  4. Removes grid elements when `enabled` becomes false or on unmount.
 */
export function useGridSnapping(
  api: ExcalidrawAPI | null,
  unit: UnitSystem,
  enabled: boolean
): GridSnappingResult {
  // Guard flag — prevents the onChange snap from triggering itself recursively
  const isApplyingSnap = useRef(false);

  const gridSizePx = getGridSizeInPixels(unit);

  // ── Apply / remove grid background ──────────────────────────────────────
  useEffect(() => {
    if (!api) return;

    if (enabled) {
      applyGridBackground(api, { width: 3000, height: 3000 }, unit);
    } else {
      // Remove all grid elements when disabled
      const elements = api.getSceneElements() as unknown as Array<
        ExcalidrawElement & { customData?: Record<string, unknown> }
      >;
      const userOnly = elements.filter((el) => !el.customData?.isGridLine);
      if (userOnly.length !== elements.length) {
        api.updateScene({ elements: userOnly as readonly ExcalidrawElement[] });
      }
    }

    return () => {
      // Cleanup: remove grid lines on unmount or when api/unit changes
      try {
        const elements = api.getSceneElements() as unknown as Array<
          ExcalidrawElement & { customData?: Record<string, unknown> }
        >;
        const userOnly = elements.filter((el) => !el.customData?.isGridLine);
        if (userOnly.length !== elements.length) {
          api.updateScene({ elements: userOnly as readonly ExcalidrawElement[] });
        }
      } catch {
        // API may no longer be mounted — safe to ignore
      }
    };
  }, [api, unit, enabled]);

  // ── Software snap on onChange ────────────────────────────────────────────
  const onChangeHandler = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      appState: Record<string, unknown>
    ): void => {
      if (!api || !enabled || isApplyingSnap.current) return;

      const selectedIds = (
        appState.selectedElementIds as Record<string, boolean> | undefined
      ) ?? {};

      const hasSelected = Object.values(selectedIds).some(Boolean);
      if (!hasSelected) return;

      let dirty = false;
      const snapped = elements.map((el) => {
        // Never touch grid lines or unselected elements
        if ((el as any).customData?.isGridLine) return el;
        if (!selectedIds[el.id]) return el;

        const sx = snapToGrid(el.x, unit);
        const sy = snapToGrid(el.y, unit);
        // For width/height only snap if non-zero to avoid collapsing zero-dim elements
        const sw = el.width !== 0 ? snapToGrid(Math.abs(el.width), unit) : el.width;
        const sh = el.height !== 0 ? snapToGrid(Math.abs(el.height), unit) : el.height;

        if (sx === el.x && sy === el.y && sw === el.width && sh === el.height) {
          return el;
        }

        dirty = true;
        return { ...el, x: sx, y: sy, width: sw, height: sh };
      });

      if (dirty) {
        isApplyingSnap.current = true;
        api.updateScene({ elements: snapped as readonly ExcalidrawElement[] });
        // Use queueMicrotask so the next onChange can fire before we reset
        queueMicrotask(() => {
          isApplyingSnap.current = false;
        });
      }
    },
    [api, unit, enabled]
  );

  return { gridSizePx, onChangeHandler };
}
