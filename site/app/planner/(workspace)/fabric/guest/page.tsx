import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";

export const dynamic = "force-dynamic";

/** Explicit Fabric fallback — not linked in production nav; for rollback drills. */
export default function PlannerFabricGuestRoute() {
  return <PlannerWorkspaceRoute guestMode />;
}
