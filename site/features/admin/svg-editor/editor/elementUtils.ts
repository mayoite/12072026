/**
 * elementUtils.ts
 *
 * Helper functions to read and write the dimensions of a selected Excalidraw
 * rectangle element via the excalidrawAPI instance.
 *
 * Excalidraw stores width/height as the *unrotated* bounding dimensions.
 * Rotation is stored separately in `el.angle` (radians). These helpers
 * honour that convention — setRectangleDimensions only touches width/height.
 */

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export type { ExcalidrawElement };
export type ExcalidrawAPI = ExcalidrawImperativeAPI;

// ─── 1. getSelectedRectangle ─────────────────────────────────────────────

/**
 * Returns the single currently-selected rectangle element, or `null` when:
 * - no element is selected
 * - more than one element is selected
 * - the selected element is not a rectangle
 */
export function getSelectedRectangle(api: ExcalidrawAPI): ExcalidrawElement | null {
  const { selectedElementIds } = api.getAppState();
  const ids = Object.keys(selectedElementIds).filter((id) => selectedElementIds[id]);

  if (ids.length !== 1) return null;

  const el = api
    .getSceneElements()
    .find((e) => e.id === ids[0]);

  if (!el || el.type !== "rectangle") return null;

  return el;
}

// ─── 2. getRectangleDimensions ───────────────────────────────────────────

/**
 * Returns the unrotated pixel width and height of a rectangle element.
 *
 * Excalidraw stores the pre-rotation bounding box in `el.width` / `el.height`
 * and applies the rotation via `el.angle`, so no trigonometry is needed here.
 */
export function getRectangleDimensions(
  el: ExcalidrawElement
): { width: number; height: number } {
  return { width: el.width, height: el.height };
}

// ─── 3. setRectangleDimensions ───────────────────────────────────────────

/**
 * Updates the width and height of the currently selected rectangle.
 *
 * All other properties — x, y, angle, stroke, fill, groupIds, etc. — are
 * preserved unchanged.  The function is a no-op when no rectangle is selected.
 *
 * @param api       - The excalidrawAPI ref value
 * @param widthPx   - New width in canvas pixels (must be > 0)
 * @param heightPx  - New height in canvas pixels (must be > 0)
 */
export function setRectangleDimensions(
  api: ExcalidrawAPI,
  widthPx: number,
  heightPx: number
): void {
  if (widthPx <= 0 || heightPx <= 0) return;

  const target = getSelectedRectangle(api);
  if (!target) return;

  const elements = api.getSceneElements().map((el) =>
    el.id === target.id
      ? ({ ...el, width: widthPx, height: heightPx } as unknown as ExcalidrawElement)
      : el
  );

  api.updateScene({ elements });
}

// ─── 4. getElementAngle ──────────────────────────────────────────────────

/**
 * Returns the rotation angle of an element in radians.
 *
 * Excalidraw applies rotation clockwise around the element's centre.
 * A value of `0` means no rotation; `Math.PI / 2` ≈ 90° clockwise, etc.
 */
export function getElementAngle(el: ExcalidrawElement): number {
  return el.angle;
}
