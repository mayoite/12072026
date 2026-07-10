import Link from "next/link";

import type { PlannerSaveSummary } from "@/features/planner/store/plannerSaves";

interface PortalPageViewProps {
  databaseConfigured: boolean;
  plans: PlannerSaveSummary[];
  userName?: string | null;
  /** Set when storage is configured but list query failed (table missing, network, etc.). */
  listError?: string | null;
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function PortalPageView({
  databaseConfigured,
  plans,
  userName,
  listError = null,
}: PortalPageViewProps) {
  return (
    <div className="shell-portal-page mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
      <header className="shell-portal-panel p-6 md:p-8">
        <p className="shell-portal-table-label">Member portal</p>
        <h1 className="shell-portal-table-header mt-2">
          {userName ? `${userName}'s plans` : "Your saved plans"}
        </h1>
        <p className="shell-portal-table-meta mt-3 max-w-3xl">
          Review saved workspace layouts, reopen them in the planner, and share the current room setup with your team.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/planner/canvas/" className="shell-portal-button-primary">
            Open planner
          </Link>
          <Link href="/dashboard/" className="shell-portal-button-secondary">
            Back to dashboard
          </Link>
        </div>
      </header>

      {/* Mutually exclusive body: listError must not also paint empty/grid (was double content). */}
      {listError ? (
        <section
          className="shell-portal-panel-soft mt-6 p-6 text-sm text-muted"
          role="status"
          data-testid="portal-list-error"
        >
          <h2 className="shell-portal-table-header text-base">Plans could not be loaded</h2>
          <p className="shell-portal-table-meta mt-2">
            Storage is configured, but the plan list query failed. You can still open the planner; saving
            may fail until the database is repaired.
          </p>
          <p className="shell-portal-table-meta mt-2 font-mono text-xs break-all opacity-80">{listError}</p>
          <div className="mt-5">
            <Link href="/planner/canvas/" className="shell-portal-button-primary">
              Open planner
            </Link>
          </div>
        </section>
      ) : !databaseConfigured ? (
        <section className="shell-portal-panel-soft mt-6 p-6 text-sm text-muted">
          Planner storage is not configured yet, so no published portal plans are available in this environment.
        </section>
      ) : plans.length === 0 ? (
        <section className="shell-portal-panel mt-6 p-6">
          <h2 className="shell-portal-table-header">No saved plans yet</h2>
          <p className="shell-portal-table-meta mt-2">
            Start a workspace in the planner and save it to create a portal-ready plan history for this account.
          </p>
          <div className="mt-5">
            <Link href="/planner/canvas/" className="shell-portal-button-primary">
              Create a plan
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-6">
          <div className="gap-3">
            <div>
              <h2 className="shell-portal-table-header">Saved layouts</h2>
              <p className="shell-portal-table-meta">
                {plans.length} plan{plans.length === 1 ? "" : "s"} available
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.id} className="shell-portal-grid-card p-5">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="shell-portal-table-label">Workspace plan</p>
                    <h3 className="shell-portal-table-header mt-2 truncate">{plan.name}</h3>
                    <p className="shell-portal-table-meta mt-1 truncate">
                      {plan.project_name ?? plan.client_name ?? "No project metadata"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-soft px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-soft">
                    {plan.item_count} items
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="shell-portal-panel-soft px-3 py-2">
                    <dt className="shell-portal-table-label">Room</dt>
                    <dd className="shell-portal-table-row mt-1">
                      {plan.room_width_mm} × {plan.room_depth_mm} mm
                    </dd>
                  </div>
                  <div className="shell-portal-panel-soft px-3 py-2">
                    <dt className="shell-portal-table-label">Updated</dt>
                    <dd className="shell-portal-table-row mt-1">{formatTimestamp(plan.updated_at)}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/portal/${plan.id}`} className="shell-portal-button-primary">
                    View details
                  </Link>
                  <Link
                    href={`/planner/canvas/?id=${encodeURIComponent(plan.id)}`}
                    className="shell-portal-button-secondary"
                  >
                    Open in planner
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
