"use client";

import React, { useState, useMemo } from "react";
import type { Quote } from "./stores/crmStore";
import { useCrmStore } from "./stores/crmStore";
import { GlobalNavHeader } from "@/features/shared/shell/GlobalNavHeader";
import { cn } from "@/lib/utils";
import { crmQuoteStatusColumns, crmUi } from "./crmUi";
import { CrmWorkspaceBanner } from "./CrmWorkspaceBanner";
import {
  FileText,
  Plus,
  MagnifyingGlass as Search,
  Buildings as Building2,
  Users,
  Clock,
  Trash as Trash2,
  TrendUp as TrendingUp,
  X,
} from "@phosphor-icons/react";

export default function QuotesView({ embedded = false }: { embedded?: boolean }) {
  const { quotes, clients, projects, addQuote, updateQuote, deleteQuote } = useCrmStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("none");
  const [projectId, setProjectId] = useState("none");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [status, setStatus] = useState<Quote["status"]>("draft");

  const clientMap = useMemo(() => {
    return new Map(clients.map((c) => [c.id, c]));
  }, [clients]);

  const projectMap = useMemo(() => {
    return new Map(projects.map((p) => [p.id, p]));
  }, [projects]);

  const filteredQuotes = useMemo(() => {
    const q = search.toLowerCase();
    return quotes.filter(
      (qt) =>
        qt.title.toLowerCase().includes(q) ||
        (clientMap.get(qt.clientId)?.name ?? "").toLowerCase().includes(q) ||
        (projectMap.get(qt.projectId)?.name ?? "").toLowerCase().includes(q),
    );
  }, [quotes, search, clientMap, projectMap]);

  const quotesByStatus = useMemo(() => {
    const groups: Record<Quote["status"], Quote[]> = {
      draft: [],
      sent: [],
      approved: [],
      rejected: [],
    };
    filteredQuotes.forEach((q) => {
      if (groups[q.status]) {
        groups[q.status].push(q);
      }
    });
    return groups;
  }, [filteredQuotes]);

  const totalValue = useMemo(() => {
    return quotes
      .filter((q) => q.status === "approved")
      .reduce((sum, q) => sum + q.totalAmount, 0);
  }, [quotes]);

  const pipelineValue = useMemo(() => {
    return quotes
      .filter((q) => q.status === "sent")
      .reduce((sum, q) => sum + q.totalAmount, 0);
  }, [quotes]);

  const stats = useMemo(
    () => [
      {
        label: "Closed Approved",
        value: `₹${totalValue.toLocaleString("en-IN")}`,
        tone: "text-success",
        icon: TrendingUp,
      },
      {
        label: "Active In-Flight",
        value: `₹${pipelineValue.toLocaleString("en-IN")}`,
        tone: "text-warning",
        icon: Clock,
      },
      {
        label: "Total Quotes",
        value: String(quotes.length),
        tone: "text-strong",
        icon: FileText,
      },
    ],
    [totalValue, pipelineValue, quotes.length],
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addQuote({
      title: title.trim(),
      clientId,
      projectId,
      planId: `plan-${Date.now()}`,
      items: [],
      totalAmount: Number(totalAmount),
      status,
    });

    setTitle("");
    setClientId("none");
    setProjectId("none");
    setTotalAmount(0);
    setStatus("draft");
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: Quote["status"]) => {
    updateQuote(id, { status: newStatus });
  };

  const shell = embedded
    ? "crm-quotes-view"
    : "shell-workspace-page min-h-screen";

  const inner = embedded
    ? "flex w-full flex-col gap-5 sm:gap-6"
    : "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6";

  return (
    <section className={shell}>
      {!embedded ? <GlobalNavHeader /> : null}

      <div className={inner}>
        {embedded ? <CrmWorkspaceBanner /> : null}

        {embedded ? (
          <div className="crm-quotes-toolbar">
            <p className="crm-quotes-toolbar__hint text-xs text-muted">
              {quotes.length === 0
                ? "Start with sample data or create a quote."
                : `${quotes.length} quote${quotes.length === 1 ? "" : "s"} in this browser.`}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="admin-btn admin-btn--primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden /> Create Quote
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="shell-workspace-eyebrow text-[0.6875rem] font-semibold uppercase tracking-[0.26em]">
                CRM demo · browser only
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-strong">
                Deals Pipeline
              </h1>
              <p className="shell-workspace-muted mt-2 text-sm leading-6">
                Quote values and approval status stored in this browser only — not a
                production CRM.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden /> Create Quote
            </button>
          </div>
        )}

        <div
          className="crm-quotes-kpi-grid"
          role="group"
          aria-label="Quote statistics"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="admin-panel crm-quotes-kpi flex items-center justify-between gap-2 p-3 sm:p-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted sm:tracking-[0.2em]">
                    {stat.label}
                  </p>
                  <p className={cn("mt-1.5 truncate text-xl font-bold sm:mt-2 sm:text-2xl", stat.tone)}>
                    {stat.value}
                  </p>
                </div>
                <Icon className="hidden h-8 w-8 shrink-0 opacity-30 sm:block" aria-hidden />
              </div>
            );
          })}
        </div>

        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search deals, clients, or projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-field__control min-h-11 pl-10 text-sm"
            aria-label="Search quotes"
          />
        </div>

        {quotes.length === 0 ? (
          <div className="admin-empty admin-panel" role="status">
            <FileText className="h-12 w-12 text-subtle sm:h-14 sm:w-14" aria-hidden />
            <h2 className="admin-empty__title">No quotes yet</h2>
            <p className="admin-empty__copy">
              Create a quote card to track deal value through draft, sent, approved, and rejected
              stages — or load sample data above.
            </p>
            <div className="admin-empty__actions">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="admin-btn admin-btn--primary"
              >
                Create Quote
              </button>
            </div>
          </div>
        ) : (
          <div className="crm-quotes-board">
            {crmQuoteStatusColumns.map((col) => {
              const list = quotesByStatus[col.value as Quote["status"]] || [];
              const colTotal = list.reduce((s, q) => s + q.totalAmount, 0);

              return (
                <div
                  key={col.value}
                  className={cn(
                    "crm-quotes-column flex flex-col rounded-[1.25rem] border sm:rounded-[1.6rem]",
                    crmUi.softSurface,
                    crmUi.panelBorder,
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-t-[1.25rem] p-3 sm:rounded-t-[1.6rem] sm:p-4",
                      col.header,
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${col.dot}`} />
                      <span className="text-sm font-semibold text-strong">{col.label}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[10px]",
                          col.badge,
                        )}
                      >
                        {list.length}
                      </span>
                    </div>
                    <span className={cn("shrink-0 text-xs font-semibold", col.valueTone)}>
                      ₹{colTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex min-h-[12rem] flex-1 flex-col gap-3 overflow-y-auto p-3 sm:min-h-[24rem]">
                    {list.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center py-10 text-center text-xs italic text-muted">
                        No deals here
                      </div>
                    ) : (
                      list.map((quote) => {
                        const client = clientMap.get(quote.clientId);
                        const project = projectMap.get(quote.projectId);

                        return (
                          <article
                            key={quote.id}
                            className={cn(
                              "flex flex-col gap-3 rounded-xl border p-4 transition",
                              crmUi.strongSurface,
                              crmUi.softBorder,
                              crmUi.hoverBorder,
                            )}
                          >
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold leading-tight text-strong">
                                {quote.title}
                              </h4>
                              {client ? (
                                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted">
                                  <Users className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                                  <span className="truncate">{client.name}</span>
                                </p>
                              ) : null}
                              {project ? (
                                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                                  <Building2 className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                                  <span className="truncate">{project.name}</span>
                                </p>
                              ) : null}
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-strong">
                                ₹{quote.totalAmount.toLocaleString("en-IN")}
                              </span>
                              <span className="font-mono text-[10px] text-muted">
                                {new Date(quote.updatedAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div
                              className={cn(
                                "mt-1 flex items-center justify-between gap-2 border-t pt-2",
                                crmUi.softBorder,
                              )}
                            >
                              <select
                                value={quote.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    quote.id,
                                    e.target.value as Quote["status"],
                                  )
                                }
                                className="min-h-11 max-w-[70%] cursor-pointer border-0 bg-transparent text-[10px] font-semibold capitalize text-muted focus:ring-0 sm:min-h-0"
                                aria-label={`Move quote ${quote.title}`}
                              >
                                <option value="draft">Move to Draft</option>
                                <option value="sent">Move to Sent</option>
                                <option value="approved">Move to Approved</option>
                                <option value="rejected">Move to Rejected</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => deleteQuote(quote.id)}
                                className={cn(
                                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded p-1",
                                  crmUi.ghostDanger,
                                )}
                                title="Delete quote"
                                aria-label={`Delete quote ${quote.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crm-new-quote-title"
        >
          <div
            className={cn(
              "flex max-h-[92dvh] w-full max-w-md flex-col gap-5 overflow-y-auto p-5 sm:gap-6 sm:p-8",
              crmUi.modal,
              "rounded-t-2xl sm:rounded-[2rem]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id="crm-new-quote-title"
                  className="text-xl font-semibold text-strong sm:text-2xl"
                >
                  Create Quote Card
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Configure quote title and deal value.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:bg-soft"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-1">
              <label className="admin-field">
                <span className="admin-field__label">Quote Title *</span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-field__control"
                  placeholder="e.g. Nexus Tech Furnishing Phase 1"
                />
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Client Account</span>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="admin-field__control"
                  aria-label="Client Account"
                >
                  <option value="none">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Project Association</span>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="admin-field__control"
                  aria-label="Project Association"
                >
                  <option value="none">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Quote Amount (INR)</span>
                <input
                  type="number"
                  value={totalAmount || ""}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="admin-field__control"
                  placeholder="Enter deal value"
                />
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Pipeline Stage</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Quote["status"])}
                  className="admin-field__control"
                  aria-label="Pipeline Stage"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn--outline w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="admin-btn admin-btn--primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
