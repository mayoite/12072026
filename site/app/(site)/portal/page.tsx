import { requireAuthUser } from "@/lib/auth/session";

import PortalPageView from "@/features/planner/portal/PortalPageView";
import {
  isMissingOandoPlansTableError,
  isPlannerDatabaseConfigured,
} from "@/features/planner/store/plannerPersistence";
import {
  listPlannerDocumentsFromStore,
  type PlannerSaveSummary,
} from "@/features/planner/store/plannerSaves";

// Thin route layer only. Portal implementation lives in features/planner/portal/.
export default async function PortalPage() {
  const user = await requireAuthUser("/portal", "planner");
  // URL present ≠ table ready. Missing oando_plans demotes to not-configured below.
  let databaseConfigured = isPlannerDatabaseConfigured();

  let plans: PlannerSaveSummary[] = [];
  let listError: string | null = null;
  if (databaseConfigured) {
    try {
      plans = await listPlannerDocumentsFromStore({ userId: user.id });
    } catch (error) {
      // Do not crash the portal shell when DB/table is misconfigured (local/dev).
      if (isMissingOandoPlansTableError(error)) {
        // Honest path: URL alone is not “configured” when the plans table is gone.
        databaseConfigured = false;
        plans = [];
        listError = null;
      } else {
        listError =
          error instanceof Error
            ? error.message
            : "Could not load saved plans from storage.";
        plans = [];
      }
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
