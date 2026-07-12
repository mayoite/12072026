import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";

export const dynamic = "force-dynamic";

/** Live guest workspace â€” Fabric 2-D + Three 3-D. */
export default async function PlannerGuestRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const rawId = resolved.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;
  return <PlannerWorkspaceRoute guestMode planId={planId} />;
}

