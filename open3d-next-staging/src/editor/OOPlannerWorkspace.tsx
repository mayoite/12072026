"use client";

import { FeasibilityCanvas } from "../canvas-fabric/FeasibilityCanvas";

export type OOPlannerWorkspaceProps = {
  guestMode: boolean;
  planId?: string;
};

export function OOPlannerWorkspace({
  guestMode,
  planId,
}: OOPlannerWorkspaceProps) {
  const projectName = planId ? `OOPlanner ${planId}` : "OOPlanner";

  return (
    <div className="feasibility-route-host" aria-label="Open3D hidden feasibility host">
      <header className="proof-heading">
        <h1>{projectName}</h1>
        <span>{guestMode ? "Guest route" : "Member route"} · hidden feasibility slice</span>
      </header>
      <FeasibilityCanvas />
    </div>
  );
}
