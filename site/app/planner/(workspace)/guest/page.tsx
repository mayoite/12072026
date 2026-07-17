import { redirect } from "next/navigation";

import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";

export const dynamic = "force-dynamic";

/** Live guest workspace — Fabric 2-D + Three 3-D. */
export default async function PlannerGuestRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const rawId = resolved.id;
  const planId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || undefined;
  const rawResume = resolved.resume;
  const resumeLegacyDraft =
    (Array.isArray(rawResume) ? rawResume[0] : rawResume) === "1";

  // A bare guest URL starts a distinct draft. Its generated URL resumes it.
  // The legacy shared guest draft remains available only by explicit request.
  if (!planId && !resumeLegacyDraft) {
    redirect(`/planner/guest/?id=${crypto.randomUUID()}`);
  }

  return <PlannerWorkspaceRoute guestMode planId={planId} />;
}
