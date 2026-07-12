"use client";

import { OOPlannerWorkspace } from "@/features/planner/editor/OOPlannerWorkspace";

/** Live planner host — Fabric 2D + Three 3D. */
export function PlannerHost({
  planId,
  guestMode = false,
}: {
  planId?: string;
  guestMode?: boolean;
}) {
  return (
    // Both class names: planner-* (shell tests) + open3d-* (locked host CSS
    // height:100%/min-height:0 so Fabric stage cannot blow past the viewport
    // and shove wall-draw hit targets off-screen via tool scrollIntoView).
    <div className="planner-route-host open3d-route-host">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
