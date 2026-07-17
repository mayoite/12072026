import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";
import { notFound, redirect } from "next/navigation";
import { buildGuestPlannerEntryHref } from "@/lib/analytics/plannerEntry";

import { parsePlanIdSearchParam } from "../planIdGate";

export const dynamic = "force-dynamic";

/** Live member canvas - Fabric 2-D (`PlannerCanvasStage`) + Three 3-D. Legacy shell: /planner/fabric/canvas */
export default async function PlannerCanvasRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const user = await getOptionalPlannerUser();
  if (!user) {
    // Keep Site continuity params when bouncing unauthenticated canvas traffic to guest.
    redirect(buildGuestPlannerEntryHref(resolvedSearchParams));
  }

  const planIdGate = parsePlanIdSearchParam(resolvedSearchParams.id);
  if (!planIdGate.ok) {
    notFound();
  }

  return (
    <PlannerWorkspaceRoute
      guestMode={false}
      planId={planIdGate.planId}
      ownerId={user.id}
    />
  );
}
