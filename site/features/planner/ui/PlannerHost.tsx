"use client";

import { OOPlannerWorkspace } from "@/features/planner/editor/OOPlannerWorkspace";
import { cn } from "@/lib/utils";

/** Live planner host — Fabric 2D + Three 3D. */
export function PlannerHost({
  planId,
  ownerId,
  guestMode = false,
}: {
  planId?: string;
  ownerId?: string;
  guestMode?: boolean;
}) {
  return (
    // planner-* + open3d-* names for locked host CSS; planner-fill = TW4 height chain
    <div className={cn("planner-route-host open3d-route-host", "planner-fill")}>
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} ownerId={ownerId} />
    </div>
  );
}
