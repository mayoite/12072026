import { notFound, redirect } from "next/navigation";

import {
  isEntityUuid,
  newEntityId,
} from "@/features/planner/lib/newEntityId";
import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";
import { buildGuestPlannerDraftRedirectHref } from "@/lib/analytics/plannerEntry";

export const dynamic = "force-dynamic";

/** Live guest workspace — Fabric 2-D + Three 3-D. */
export default async function PlannerGuestRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const rawId = resolved.id;
  if (Array.isArray(rawId)) {
    notFound();
  }
  const planId = rawId?.trim() || undefined;
  const rawResume = resolved.resume;
  if (Array.isArray(rawResume)) {
    notFound();
  }
  const resumeLegacyDraft = rawResume === "1";

  if (
    (rawId !== undefined && !planId) ||
    (rawResume !== undefined && !resumeLegacyDraft) ||
    (planId && resumeLegacyDraft)
  ) {
    notFound();
  }

  // A bare guest URL starts a distinct draft. Its generated URL resumes it.
  // Preserve Site continuity params (siteProduct / siteSource / utm_*) across the id redirect.
  // The legacy shared guest draft remains available only by explicit request.
  if (!planId && !resumeLegacyDraft) {
    redirect(buildGuestPlannerDraftRedirectHref(newEntityId(), resolved));
  }

  if (planId && !isEntityUuid(planId)) {
    notFound();
  }

  return <PlannerWorkspaceRoute guestMode planId={planId} />;
}
