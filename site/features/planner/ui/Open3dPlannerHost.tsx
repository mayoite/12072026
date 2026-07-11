"use client";

import { OOPlannerWorkspace } from "@/features/planner/open3d/editor/OOPlannerWorkspace";

export function Open3dPlannerHost({
  planId,
  guestMode = false,
}: {
  planId?: string;
  guestMode?: boolean;
}) {
  return (
    <div className="open3d-route-host">
      <OOPlannerWorkspace guestMode={guestMode} planId={planId} />
    </div>
  );
}
