"use client";

import { OOPlannerWorkspace } from "@/features/planner/open3d/editor/OOPlannerWorkspace";

export type Open3dNativeHostProps = {
  guestMode?: boolean;
  planId?: string;
};

/**
 * Native Open3D planner host — renders in-site modules under
 * `features/planner/open3d/` (no iframe, no separate package).
 */
export function Open3dNativeHost({ guestMode = false, planId }: Open3dNativeHostProps) {
  return (
    <div className="open3d-route-host" role="main" aria-label="Planner workspace">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
