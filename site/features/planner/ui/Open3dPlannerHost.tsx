import { Open3dNativeHost } from "@/features/planner/open3d/ui/Open3dNativeHost";

export function Open3dPlannerHost({
  planId,
  guestMode,
}: {
  planId?: string;
  guestMode?: boolean;
}) {
  return <Open3dNativeHost planId={planId} guestMode={guestMode} />;
}
