import { Open3dPlannerWorkspaceRoute } from "@/features/planner/ui/Open3dPlannerWorkspaceRoute";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";

export const dynamic = "force-dynamic";

/** Live member/guest canvas — hybrid planner route (`open3d/` tree, Fabric-backed 2-D + Three 3-D). Legacy fallback: /planner/fabric/canvas */
export default async function PlannerCanvasRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalPlannerUser();
  const isGuest = !user;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawId = resolvedSearchParams.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;

  return <Open3dPlannerWorkspaceRoute guestMode={isGuest} planId={planId} />;
}
