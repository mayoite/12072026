import { Open3dPlannerWorkspaceRoute } from "@/features/planner/ui/Open3dPlannerWorkspaceRoute";

export const dynamic = "force-dynamic";

/** Live guest workspace — open3d hybrid: FeasibilityCanvas (canvas-feasibility) 2-D + Three 3-D. Fabric cutover = Phase 2B; archive fallback: /planner/fabric/guest */
export default async function PlannerGuestRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const rawId = resolved.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;
  return <Open3dPlannerWorkspaceRoute guestMode planId={planId} />;
}
