import nextDynamic from "next/dynamic";

import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";

export const dynamic = "force-dynamic";

const Open3dPlannerHost = nextDynamic(
  () =>
    import("@/features/planner/ui/Open3dPlannerHost").then((mod) => ({
      default: mod.Open3dPlannerHost,
    })),
  { loading: () => <PlannerSkeleton />, ssr: false },
);

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
  const [user, resolvedSearchParams] = await Promise.all([
    getOptionalPlannerUser(),
    searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>),
  ]);
  const isGuest = !user;

  const rawId = resolvedSearchParams.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;

  return <Open3dPlannerHost guestMode={isGuest} planId={planId} />;
}
