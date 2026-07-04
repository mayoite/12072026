"use client";

import dynamic from "next/dynamic";

import { Providers } from "@/features/planner/components/Providers";
import { ProjectSetupGate } from "@/features/planner/onboarding/ProjectSetupGate";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";

const Open3dPlannerHost = dynamic(
  () =>
    import("@/features/planner/ui/Open3dPlannerHost").then((mod) => ({
      default: mod.Open3dPlannerHost,
    })),
  { loading: () => <PlannerSkeleton />, ssr: false },
);

/** Production hybrid workspace under the `open3d/` feature tree — live `/planner/guest` and `/planner/canvas`. */
export function Open3dPlannerWorkspaceRoute({
  guestMode = false,
  planId,
}: {
  guestMode?: boolean;
  planId?: string;
}) {
  return (
    <Providers>
      <ProjectSetupGate guestMode={guestMode} planId={planId}>
        <Open3dPlannerHost guestMode={guestMode} planId={planId} />
      </ProjectSetupGate>
    </Providers>
  );
}
