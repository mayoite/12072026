"use client";

import dynamic from "next/dynamic";

import { Providers } from "@/features/planner/components/Providers";
import { ProjectSetupGate } from "@/features/planner/onboarding/ProjectSetupGate";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";

const PlannerHostLazy = dynamic(
  () =>
    import("@/features/planner/ui/PlannerHost").then((mod) => ({
      default: mod.PlannerHost,
    })),
  { loading: () => <PlannerSkeleton />, ssr: false },
);

/** Live guest/canvas planner shell — workspace feature tree (Fabric + Three). */
export function PlannerWorkspaceRoute({
  guestMode = false,
  planId,
}: {
  guestMode?: boolean;
  planId?: string;
}) {
  return (
    <Providers>
      <ProjectSetupGate guestMode={guestMode} planId={planId}>
        <PlannerHostLazy guestMode={guestMode} planId={planId} />
      </ProjectSetupGate>
    </Providers>
  );
}
