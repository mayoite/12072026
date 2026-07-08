"use client";

import { OOPlannerWorkspace } from "@/features/planner/open3d/editor/OOPlannerWorkspace";

export type Open3dNativeHostProps = {
  guestMode?: boolean;
  planId?: string;
};

/**
 * Live planner host for the `features/planner/open3d/` tree.
 *
 * In-site (no iframe): FeasibilityCanvas (canvas-feasibility, Canvas 2D API) + Three/r3f 3-D.
 * Fabric is archive/package only until Phase 2B full-stage cutover.
 */
export function Open3dNativeHost({ guestMode = false, planId }: Open3dNativeHostProps) {
  return (
    <div className="open3d-route-host" role="main" aria-label="Planner workspace">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
