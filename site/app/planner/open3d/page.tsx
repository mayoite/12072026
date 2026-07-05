import { Open3dPlannerHost } from "@/features/planner/ui/Open3dPlannerHost";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";

export const dynamic = "force-dynamic";

/**
 * Native Open3D pilot route — not the default guest/canvas entry.
 * Per plannnerplan Phase 07: main routes stay on accepted Fabric stack until Phase 05 MET.
 *
 * Task 2: preserves parent layout auth (getOptionalPlannerUser for guest/auth),
 * CSRF (CsrfBootstrap), service worker (ServiceWorkerRegister), error boundaries (PlannerErrorBoundary).
 * Direct nav/refresh supported via server component + searchParams.id for plan restore.
 * GS: follows existing route chrome per benchmark (no donor changes); preserve per handover.
 */
export default async function Open3dPlannerRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalPlannerUser();
  const isGuest = !user;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawId = resolvedSearchParams.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;

  return <Open3dPlannerHost guestMode={isGuest} planId={planId} />;
}
