"use client";

import { OOPlannerWorkspace } from "@/features/planner/open3d/editor/OOPlannerWorkspace";

export type Open3dNativeHostProps = {
  guestMode?: boolean;
  planId?: string;
};

/**
 * Live planner host for the `features/planner/open3d/` tree.
 *
 * In-site: PlannerCanvasStage (native 2-D) + Three/r3f 3-D.
 */
export function Open3dNativeHost({ guestMode = false, planId }: Open3dNativeHostProps) {
  return (
    <div className="open3d-route-host">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
