"use client";

import { OOPlannerWorkspace } from "@/features/planner/open3d/editor/OOPlannerWorkspace";

export type Open3dNativeHostProps = {
  guestMode?: boolean;
  planId?: string;
};

/**
 * Live planner host for the `features/planner/open3d/` tree.
 *
 * The route is "native" in the sense that it runs in-site with no iframe or
 * separate package, but the current implementation is still a hybrid:
 * Fabric-backed 2-D editing plus Three/r3f 3-D viewing.
 */
export function Open3dNativeHost({ guestMode = false, planId }: Open3dNativeHostProps) {
  return (
    <div className="open3d-route-host" role="main" aria-label="Planner workspace">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
