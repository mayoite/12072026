import { requireAuthUser } from "@/lib/auth/session";

import PortalPageView from "@/features/planner/portal/PortalPageView";
import {
  isMissingOandoPlansTableError,
  isPlannerDatabaseConfigured,
} from "@/features/planner/cloud-store/plannerPersistence";
import {
  listPlannerDocumentsFromStore,
  type PlannerSaveSummary,
} from "@/features/planner/cloud-store/plannerSaves";

/** Cap plan-list wait so portal never paints an infinite loading spinner. */
const PORTAL_LIST_TIMEOUT_MS = 8_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

// Thin route layer only. Portal implementation lives in features/planner/portal/.
export default async function PortalPage() {
  const user = await requireAuthUser("/portal", "planner");
  // URL present ≠ table ready. Missing oando_plans demotes to not-configured below.
  let databaseConfigured = isPlannerDatabaseConfigured();

  let plans: PlannerSaveSummary[] = [];
  let listError: string | null = null;
  if (databaseConfigured) {
    try {
      plans = await withTimeout(
        listPlannerDocumentsFromStore({ userId: user.id }),
        PORTAL_LIST_TIMEOUT_MS,
        "Portal plan list",
      );
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
