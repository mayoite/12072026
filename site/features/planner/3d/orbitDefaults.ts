/**
 * Planner product orbit contract (W4 three-layer).
 * Workspace product path must pass these props explicitly — defaults alone are not enough.
 */

/** Product default: OrbitControls ON for planner 3D view. */
export const PLANNER_ORBIT_DEFAULT_ENABLED = true as const;

/**
 * Explicit control props for the product Lazy3DViewer mount.
 * Type forces enableControls: true so silent opt-out cannot type-check.
 */
export function getPlannerViewerControlProps(): { enableControls: true } {
  return { enableControls: PLANNER_ORBIT_DEFAULT_ENABLED };
}
