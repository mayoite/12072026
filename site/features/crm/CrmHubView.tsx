"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useCrmStore } from "./stores/crmStore";
import {
  CRM_CLIENTS_PATH,
  CRM_PROJECTS_PATH,
  CRM_QUOTES_PATH,
  crmProjectDetailPath,
} from "./crmRoutes";
import { computeCrmMetrics, formatInrCompact } from "./crmMetrics";
import { CrmDemoBanner } from "./CrmDemoBanner";
import { CrmWorkspaceBanner } from "./CrmWorkspaceBanner";
import { crmProjectStatus, crmQuoteStatusColumns } from "./crmUi";

export default function CrmHubView() {
  const clients = useCrmStore((s) => s.clients);
  const projects = useCrmStore((s) => s.projects);
  const quotes = useCrmStore((s) => s.quotes);

  const metrics = useMemo(
    () => computeCrmMetrics(clients, projects, quotes),
    [clients, projects, quotes],
  );

  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients],
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [projects],
  );

  const recentQuotes = useMemo(
    () =>
      [...quotes]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [quotes],
  );

  const empty =
    metrics.clientCount === 0 &&
    metrics.projectCount === 0 &&
    metrics.quoteCount === 0;

  return (
    <div className="crm-hub space-y-6">
      <CrmDemoBanner />
      <CrmWorkspaceBanner />

      <section className="admin-kpi-grid" aria-label="CRM summary">
        <Link href={CRM_CLIENTS_PATH} className="admin-kpi admin-kpi--neutral">
          <span className="admin-kpi__label">Clients</span>
          <span className="admin-kpi__hint text-lg font-bold text-strong">
            {metrics.clientCount}
          </span>
          <span className="admin-kpi__cta">
            Open directory <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
        <Link href={CRM_PROJECTS_PATH} className="admin-kpi admin-kpi--info">
          <span className="admin-kpi__label">Active projects</span>
          <span className="admin-kpi__hint text-lg font-bold text-strong">
            {metrics.activeProjects}
            <span className="ml-1 text-xs font-normal text-muted">
              / {metrics.projectCount}
            </span>
          </span>
          <span className="admin-kpi__cta">
            Open projects <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
        <Link href={CRM_QUOTES_PATH} className="admin-kpi admin-kpi--warn">
          <span className="admin-kpi__label">Pipeline value</span>
          <span className="admin-kpi__hint text-lg font-bold text-strong">
            {formatInrCompact(metrics.pipelineValue)}
          </span>
          <span className="admin-kpi__cta">
            {metrics.sentQuotes} sent · {metrics.draftQuotes} draft
          </span>
        </Link>
        <Link href={CRM_QUOTES_PATH} className="admin-kpi admin-kpi--success">
          <span className="admin-kpi__label">Approved value</span>
          <span className="admin-kpi__hint text-lg font-bold text-strong">
            {formatInrCompact(metrics.approvedValue)}
          </span>
          <span className="admin-kpi__cta">
            {metrics.approvedQuotes} approved quotes
          </span>
        </Link>
      </section>

      {empty ? (
        <div className="admin-empty admin-panel" role="status">
          <h2 className="admin-empty__title">CRM workspace is empty</h2>
          <p className="admin-empty__copy">
            Load sample data to explore the pipeline, or create your first client and
            project. Records stay in this browser until you export them.
          </p>
          <div className="admin-empty__actions">
            <Link href={CRM_CLIENTS_PATH} className="admin-btn admin-btn--primary">
              Add a client
            </Link>
            <Link href={CRM_PROJECTS_PATH} className="admin-btn admin-btn--outline">
              Add a project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="admin-panel p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0 text-sm font-semibold text-strong">Recent projects</h2>
              <Link href={CRM_PROJECTS_PATH} className="text-xs font-semibold text-primary">
                View all
              </Link>
            </div>
            {recentProjects.length === 0 ? (
              <p className="admin-empty mt-3">No projects yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-soft">
                {recentProjects.map((project) => {
                  const status = crmProjectStatus[project.status] ?? crmProjectStatus.active;
                  const client = clientMap.get(project.clientId);
                  return (
                    <li key={project.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <Link
                          href={crmProjectDetailPath(project.id)}
                          className="block truncate text-sm font-semibold text-strong hover:text-primary"
                        >
                          {project.name}
                        </Link>
                        <p className="truncate text-xs text-muted">
                          {client?.name ?? "Unassigned"} · {project.planIds.length} plan
                          {project.planIds.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${status.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="admin-panel p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0 text-sm font-semibold text-strong">Recent quotes</h2>
              <Link href={CRM_QUOTES_PATH} className="text-xs font-semibold text-primary">
                View all
              </Link>
            </div>
            {recentQuotes.length === 0 ? (
              <p className="admin-empty mt-3">No quotes yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-soft">
                {recentQuotes.map((quote) => {
                  const col =
                    crmQuoteStatusColumns.find((c) => c.value === quote.status) ??
                    crmQuoteStatusColumns[0];
                  const client = clientMap.get(quote.clientId);
                  return (
                    <li key={quote.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-strong">
                          {quote.title}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {client?.name ?? "Unassigned"} · {formatInrCompact(quote.totalAmount)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${col.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                        {col.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      <section className="admin-panel p-4 sm:p-5">
        <h2 className="m-0 text-sm font-semibold text-strong">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={CRM_CLIENTS_PATH} className="admin-btn admin-btn--primary">
            New client
          </Link>
          <Link href={CRM_PROJECTS_PATH} className="admin-btn admin-btn--outline">
            New project
          </Link>
          <Link href={CRM_QUOTES_PATH} className="admin-btn admin-btn--outline">
            New quote
          </Link>
          <Link href="/admin/customer-queries" className="admin-btn admin-btn--outline">
            Customer queries
          </Link>
          <Link href="/admin/plans" className="admin-btn admin-btn--outline">
            Planner plans
          </Link>
        </div>
        <p className="admin-page__meta mt-4">
          {metrics.plansLinked} floor plan link{metrics.plansLinked === 1 ? "" : "s"} across
          projects · {metrics.onHoldProjects} on hold · {metrics.completedProjects} completed
        </p>
      </section>
    </div>
  );
}
