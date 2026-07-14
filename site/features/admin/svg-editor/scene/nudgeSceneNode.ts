/**
 * ADM-A11Y-03 — keyboard nudge (non-drag alternative to pointer drag-move).
 */

import type { SvgSceneNode } from "./svgSceneDocument";

/**
 * Return a geometry patch that translates a node by (dx, dy) in scene units.
 * Paths cannot be nudged as a unit (no single origin); returns null.
 */
export function nudgeSceneNodePatch(
  node: SvgSceneNode,
  dx: number,
  dy: number,
): Partial<SvgSceneNode> | null {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return null;
  if (dx === 0 && dy === 0) return null;

  switch (node.kind) {
    case "rect":
    case "text":
      return { x: node.x + dx, y: node.y + dy };
    case "circle":
      return { cx: node.cx + dx, cy: node.cy + dy };
    case "line":
      return {
        x1: node.x1 + dx,
        y1: node.y1 + dy,
        x2: node.x2 + dx,
        y2: node.y2 + dy,
      };
    case "path":
      return null;
    default: {
      const _exhaustive: never = node;
      return _exhaustive;
    }
  }
}
