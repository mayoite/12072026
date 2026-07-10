import { requireAuthUser } from "@/lib/auth/session";

import PortalPageView from "@/features/planner/portal/PortalPageView";
import { isPlannerDatabaseConfigured } from "@/features/planner/store/plannerPersistence";
import {
  listPlannerDocumentsFromStore,
  type PlannerSaveSummary,
} from "@/features/planner/store/plannerSaves";

// Thin route layer only. Portal implementation lives in features/planner/portal/.
export default async function PortalPage() {
  const user = await requireAuthUser("/portal", "planner");
  const databaseConfigured = isPlannerDatabaseConfigured();

  let plans: PlannerSaveSummary[] = [];
  let listError: string | null = null;
  if (databaseConfigured) {
    try {
      plans = await listPlannerDocumentsFromStore({ userId: user.id });
    } catch (error) {
      // Do not crash the portal shell when DB/table is misconfigured (local/dev).
      listError =
        error instanceof Error
          ? error.message
          : "Could not load saved plans from storage.";
      plans = [];
    }
  }

  return (
    <PortalPageView
      databaseConfigured={databaseConfigured}
      plans={plans}
      userName={user.name ?? null}
      listError={listError}
    />
  );
}
