import Link from "next/link";

import { getPlannerSceneEnvelope } from "@/features/planner/model";
import type { PlannerDocument } from "@/features/planner/model";

interface PortalPlanPageViewProps {
  document: PlannerDocument | null;
}

function formatTimestamp(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function PortalMetaCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="shell-portal-panel-soft px-3 py-2">
      <dt className="shell-portal-table-label">{label}</dt>
      <dd className="shell-portal-table-row mt-1">{value}</dd>
    </div>
  );
}

export default function PortalPlanPageView({ document }: PortalPlanPageViewProps) {
  if (!document) {
    return (
      <div className="shell-portal-page mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
        <section
          className="shell-portal-panel p-6 md:p-8"
          data-testid="portal-plan-not-found"
        >
          <p className="shell-portal-table-label">Member portal</p>
          <h1 className="shell-portal-page-title mt-2">Plan not found</h1>
          <p className="shell-portal-table-meta mt-3 max-w-3xl">
            This plan is missing, inaccessible, or does not belong to the current member account.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/portal/" className="shell-portal-button-secondary">
              Back to portal
            </Link>
            <Link href="/planner/canvas/" className="shell-portal-button-primary">
              Open planner
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const scene = getPlannerSceneEnvelope(document.sceneJson);
  const items = scene?.items ?? [];
  const displayTitle = document.title ?? document.name ?? "Untitled plan";
  const subtitle =
    document.projectName ?? document.clientName ?? "Saved workspace layout";

  return (
    <div className="shell-portal-page mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
      <nav className="mb-5" aria-label="Portal">
        <Link
          href="/portal/"
          className="text-sm font-medium text-muted transition-colors hover:text-strong"
        >
          Back to portal
        </Link>
      </nav>

      <header className="shell-portal-panel p-6 md:p-8">
        <p className="shell-portal-table-label">Workspace plan</p>
        <h1 className="shell-portal-page-title mt-2">{displayTitle}</h1>
        <p className="shell-portal-table-meta mt-3 max-w-3xl">
          {subtitle} · Updated {formatTimestamp(document.updatedAt ?? document.createdAt)}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/planner/canvas/?id=${encodeURIComponent(document.id ?? "")}`}
            className="shell-portal-button-primary"
          >
            Open in planner
          </Link>
          <Link href="/portal/" className="shell-portal-button-secondary">
            View all plans
          </Link>
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="shell-portal-panel p-5">
          <h2 className="shell-portal-section-title">Document summary</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <PortalMetaCell
              label="Room"
              value={`${document.roomWidthMm} × ${document.roomDepthMm} mm`}
            />
            <PortalMetaCell label="Items" value={document.itemCount} />
            <PortalMetaCell label="Seat target" value={document.seatTarget} />
            <PortalMetaCell label="Units" value={document.unitSystem} />
            <PortalMetaCell label="Status" value={document.status} />
          </dl>
        </article>

        <article className="shell-portal-panel p-5">
          <h2 className="shell-portal-section-title">Scene readiness</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <PortalMetaCell label="Canonical scene" value={scene ? "Present" : "Missing"} />
            <PortalMetaCell
              label="Room envelope"
              value={scene ? `${scene.room.widthMm} × ${scene.room.depthMm} mm` : "Unknown"}
            />
            <PortalMetaCell label="Scene items" value={items.length} />
            <PortalMetaCell
              label="Snapshot source"
              value={scene?.fabricSnapshot ? "Fabric" : "None"}
            />
          </dl>
        </article>
      </section>

      <section className="shell-portal-panel mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="shell-portal-section-title">Placed items</h2>
          <span className="shrink-0 rounded-full border border-soft px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-soft">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="shell-portal-table-meta mt-4 text-sm">
            No scene items were found in this saved document.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-soft">
            {items.slice(0, 16).map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="shell-portal-card-title truncate">{item.name}</p>
                  <p className="shell-portal-table-meta mt-1">{item.category}</p>
                </div>
                <div className="shrink-0 text-end shell-portal-table-meta">
                  <p>
                    {item.sizeMm.widthMm} × {item.sizeMm.depthMm} mm
                  </p>
                  <p className="mt-1">Rot {Math.round(item.rotationDeg)}°</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 16 ? (
          <p className="shell-portal-table-meta mt-3 text-xs">
            Showing the first 16 items from the saved scene.
          </p>
        ) : null}
      </section>
    </div>
  );
}
