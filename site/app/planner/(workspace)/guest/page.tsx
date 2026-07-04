import { Open3dPlannerWorkspaceRoute } from "@/features/planner/ui/Open3dPlannerWorkspaceRoute";

export const dynamic = "force-dynamic";

/** Live guest workspace — native Open3D planner. Fabric fallback: /planner/fabric/guest */
export default function PlannerGuestRoute() {
  return <Open3dPlannerWorkspaceRoute guestMode />;
}
