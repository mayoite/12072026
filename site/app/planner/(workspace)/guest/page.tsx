import { Open3dPlannerWorkspaceRoute } from "@/features/planner/ui/Open3dPlannerWorkspaceRoute";

export const dynamic = "force-dynamic";

/** Live guest workspace — hybrid planner route (`open3d/` tree, Fabric-backed 2-D + Three 3-D). Legacy fallback: /planner/fabric/guest */
export default function PlannerGuestRoute() {
  return <Open3dPlannerWorkspaceRoute guestMode />;
}
