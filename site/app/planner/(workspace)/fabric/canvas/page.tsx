import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";

export const dynamic = "force-dynamic";

/** Explicit Fabric fallback — not linked in production nav; for rollback drills. */
export default async function PlannerFabricCanvasRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalPlannerUser();
  const isGuest = !user;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawId = resolvedSearchParams.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;

  return <PlannerWorkspaceRoute guestMode={isGuest} planId={planId} />;
}
