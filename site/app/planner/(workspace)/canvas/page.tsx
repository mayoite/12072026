import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";
import { notFound, redirect } from "next/navigation";
import { isEntityUuid } from "@/features/planner/lib/newEntityId";

export const dynamic = "force-dynamic";

/** Live member/guest canvas â€” Fabric 2-D (`PlannerCanvasStage`) + Three 3-D. Legacy shell: /planner/fabric/canvas */
export default async function PlannerCanvasRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalPlannerUser();
  if (!user) {
    redirect("/planner/guest/");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawId = resolvedSearchParams.id;
  if (Array.isArray(rawId)) {
    notFound();
  }
  const planId = rawId?.trim() || undefined;

  if ((rawId !== undefined && !planId) || (planId && !isEntityUuid(planId))) {
    notFound();
  }

  return (
    <PlannerWorkspaceRoute
      guestMode={false}
      planId={planId}
      ownerId={user.id}
    />
  );
}

