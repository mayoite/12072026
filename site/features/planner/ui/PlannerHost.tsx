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
    <div className="planner-route-host">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
