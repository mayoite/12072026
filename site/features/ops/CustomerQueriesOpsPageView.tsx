"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowsClockwise as RefreshCw,
  CircleNotch as Loader2,
  FloppyDisk as Save,
} from "@phosphor-icons/react";
import { ensureCsrfToken, invalidateCsrfToken } from "@/lib/api/browserApi";
import { CSRF_HEADER_NAME } from "@/lib/security/csrfConstants";

type QueryStatus = "new" | "in_progress" | "closed" | "spam";
type FollowUpChannel = "email" | "whatsapp" | "phone" | "none";

type CustomerQuery = {
  id: string;
  created_at: string;
  updated_at: string;
  source: string | null;
  source_path: string | null;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  preferred_contact: string | null;
  message: string;
  requirement: string | null;
  budget: string | null;
  timeline: string | null;
  status: QueryStatus;
  followup_channel: FollowUpChannel;
  followup_target: string | null;
  followup_notes: string | null;
};

type DraftById = Record<
  string,
  {
    status: QueryStatus;
    followUpChannel: FollowUpChannel;
    followUpTarget: string;
    followUpNotes: string;
  }
>;

const statusOptions: QueryStatus[] = ["new", "in_progress", "closed", "spam"];
const followUpOptions: FollowUpChannel[] = ["email", "whatsapp", "phone", "none"];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const tokenStorageKey = "customer_queries_admin_token";

function formatApiError(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
}

function isAuthErrorMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("unauthorized") ||
    lower.includes("auth") ||
    lower.includes("token") ||
    lower.includes("forbidden") ||
    lower.includes("permission")
  );
}

async function patchCustomerQuery(
  body: string,
  adminToken: string,
): Promise<Response> {
  const baseHeaders = {
    "Content-Type": "application/json",
    ...(adminToken ? { "x-admin-token": adminToken } : {}),
  };

  let response = await fetch("/api/customer-queries/manage", {
    method: "PATCH",
    credentials: "include",
    headers: baseHeaders,
    body,
  });
  if (response.status !== 403) {
    return response;
  }

  invalidateCsrfToken();
  const csrfToken = await ensureCsrfToken();
  response = await fetch("/api/customer-queries/manage", {
    method: "PATCH",
    credentials: "include",
    headers: {
      ...baseHeaders,
      [CSRF_HEADER_NAME]: csrfToken,
    },
    body,
  });
  if (response.status === 403) {
    invalidateCsrfToken();
  }
  return response;
}

export default function CustomerQueriesOpsPageView({ embedded = false }: { embedded?: boolean }) {
  const [adminTokenInput, setAdminTokenInput] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(tokenStorageKey) || "";
  });
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(tokenStorageKey) || "";
  });
  const [statusFilter, setStatusFilter] = useState<"all" | QueryStatus>("all");
  const [items, setItems] = useState<CustomerQuery[]>([]);
  const [drafts, setDrafts] = useState<DraftById>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string>("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const mergeDrafts = useCallback((rows: CustomerQuery[]) => {
    setDrafts((current) => {
      const next = { ...current };
      for (const row of rows) {
        if (!next[row.id]) {
          next[row.id] = {
            status: row.status,
            followUpChannel: row.followup_channel,
            followUpTarget: row.followup_target || "",
            followUpNotes: row.followup_notes || "",
          };
        }
      }
      return next;
    });
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/customer-queries/manage?${params.toString()}`, {
        credentials: "include",
        headers: adminToken ? { "x-admin-token": adminToken } : undefined,
        cache: "no-store",
      });
      const json = (await response.json()) as {
        items?: CustomerQuery[];
        error?: string | { code?: string; message?: string };
      };
      if (!response.ok) {
        setError(formatApiError(json.error, "Unable to load queries."));
        setItems([]);
        setHasLoadedOnce(true);
        return;
      }

      const rows = Array.isArray(json.items) ? json.items : [];
      setItems(rows);
      mergeDrafts(rows);
      setLastUpdatedAt(new Date().toISOString());
      setHasLoadedOnce(true);
    } catch {
      setError("Unable to load queries.");
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  }, [adminToken, mergeDrafts, statusFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void fetchItems();
    });
    if (!embedded && !adminToken) return;
    const interval = window.setInterval(() => {
      void fetchItems();
    }, 10000);
    return () => window.clearInterval(interval);
  }, [adminToken, embedded, fetchItems]);

  const canLoad = embedded || adminToken.length > 0;
  const authBlocked =
    Boolean(error) && isAuthErrorMessage(error) && items.length === 0;
  const emptyAfterLoad =
    hasLoadedOnce && items.length === 0 && !loading && !error && lastUpdatedAt;
  const needsTokenHint =
    !embedded &&
    !adminToken &&
    items.length === 0 &&
    !loading &&
    !error &&
    !lastUpdatedAt;

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft) return;

    setSavingId(id);
    setError("");
    try {
      const requestBody = JSON.stringify({
        id,
        status: draft.status,
        followUpChannel: draft.followUpChannel,
        followUpTarget: draft.followUpTarget,
        followUpNotes: draft.followUpNotes,
      });
      const response = await patchCustomerQuery(requestBody, adminToken);
      const json = (await response.json()) as {
        item?: CustomerQuery;
        error?: string | { code?: string; message?: string };
      };
      if (!response.ok || !json.item) {
        setError(formatApiError(json.error, "Unable to update query."));
        return;
      }

      setItems((current) =>
        current.map((row) => (row.id === id ? (json.item as CustomerQuery) : row)),
      );
      setLastUpdatedAt(new Date().toISOString());
    } catch {
      setError("Unable to update query.");
    } finally {
      setSavingId("");
    }
  }

  function applyToken() {
    const token = adminTokenInput.trim();
    setAdminToken(token);
    if (token) {
      window.localStorage.setItem(tokenStorageKey, token);
    } else {
      window.localStorage.removeItem(tokenStorageKey);
      setItems([]);
      setLastUpdatedAt(null);
      setHasLoadedOnce(false);
    }
  }

  return (
    <section className={embedded ? "space-y-4" : "container py-12"}>
      {embedded ? (
        <header className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">CRM &amp; ops</p>
            <h1 className="admin-page__title">Customer queries</h1>
            <p className="admin-page__copy">
              Live server inbox from contact forms and the site assistant. Auto-refreshes
              every 10 seconds while this page is open.
            </p>
          </div>
          <div className="admin-page__actions">
            <button
              type="button"
              onClick={() => void fetchItems()}
              disabled={loading}
              className="admin-btn admin-btn--outline inline-flex items-center gap-2"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              ) : (
                <RefreshCw size={14} aria-hidden />
              )}
              Refresh
            </button>
          </div>
        </header>
      ) : (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="typ-h1 text-heading">Customer queries</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Live server inbox with 10-second auto-refresh. Standalone mode needs an ops
              token when you are not signed in as admin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchItems()}
            disabled={loading}
            className="admin-btn admin-btn--outline inline-flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <RefreshCw size={14} aria-hidden />
            )}
            Refresh
          </button>
        </div>
      )}

      {embedded ? (
        <div className="admin-alert admin-alert--info" role="status">
          <strong>Server-backed inbox</strong>
          <p className="m-0 mt-1">
            Submissions live in the Supabase <code>customer_queries</code> table — not in
            this browser. Unlike browser-only CRM, records sync for any signed-in admin.
            Requires a working admin session and database. Status and follow-up edits save
            through the manage API.
          </p>
        </div>
      ) : null}

      {!embedded ? (
        <div className="mb-6 grid gap-4 rounded-xl border border-soft bg-white p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="admin-field mb-0">
              <span className="admin-field__label">Admin token</span>
              <input
                type="password"
                value={adminTokenInput}
                onChange={(event) => setAdminTokenInput(event.target.value)}
                placeholder="Paste CUSTOMER_QUERIES_ADMIN_TOKEN or use admin session"
                className="admin-field__control"
              />
            </label>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={applyToken}
              className="admin-btn admin-btn--primary w-full"
            >
              Apply token
            </button>
          </div>
        </div>
      ) : null}

      <div className={embedded ? "admin-toolbar flex flex-wrap items-end gap-3" : "mb-6 flex flex-wrap items-center gap-3"}>
        <label className="admin-field mb-0 min-w-[10rem]" htmlFor="customer-queries-status-filter">
          <span className="admin-field__label">Filter</span>
          <select
            id="customer-queries-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | QueryStatus)}
            className="admin-field__control"
          >
            <option value="all">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <p className={embedded ? "admin-page__meta pb-2" : "text-xs text-muted"}>
          {lastUpdatedAt ? `Last sync: ${formatDate(lastUpdatedAt)}` : "Not synced yet"}
          {items.length > 0 ? ` · ${items.length} shown` : null}
        </p>
      </div>

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          <strong>{authBlocked ? "Sign-in or token required" : "Could not load queries"}</strong>
          <p className="m-0 mt-1">{error}</p>
          <div className="admin-empty__actions mt-3">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => void fetchItems()}
              disabled={loading}
            >
              Retry
            </button>
            {embedded ? (
              <Link href="/admin/crm" className="admin-btn admin-btn--outline">
                Open CRM hub
              </Link>
            ) : (
              <Link href="/login" className="admin-btn admin-btn--outline">
                Sign in
              </Link>
            )}
            {!embedded ? (
              <a href="#customer-queries-status-filter" className="admin-btn admin-btn--outline">
                Use token above
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <div className="admin-inline-row text-sm text-muted" role="status" aria-live="polite">
          <Loader2 size={16} className="animate-spin" aria-hidden />
          Loading customer queries…
        </div>
      ) : null}

      {needsTokenHint || (!canLoad && items.length === 0 && !loading && !error && !lastUpdatedAt) ? (
        <div className={embedded ? "admin-empty admin-panel" : "rounded-xl border border-soft bg-page p-6"} role="status">
          <h2 className={embedded ? "admin-empty__title" : "text-base font-semibold text-heading"}>
            Token or admin session needed
          </h2>
          <p className={embedded ? "admin-empty__copy" : "mt-2 text-sm text-neutral-600"}>
            Sign in as admin or enter the customer queries ops token to load the inbox.
          </p>
          {!embedded ? (
            <div className="admin-empty__actions mt-3">
              <Link href="/login" className="admin-btn admin-btn--primary">
                Sign in
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {emptyAfterLoad ? (
        <div className={embedded ? "admin-empty admin-panel" : "rounded-xl border border-soft bg-page p-6"} role="status">
          <h2 className={embedded ? "admin-empty__title" : "text-base font-semibold text-heading"}>
            {statusFilter === "all" ? "No queries yet" : "No queries match this filter"}
          </h2>
          <p className={embedded ? "admin-empty__copy" : "mt-2 text-sm text-neutral-600"}>
            {statusFilter === "all"
              ? "The inbox is empty. Public contact forms and the site assistant write here when Supabase is configured."
              : `Nothing with status “${statusFilter}”. Try All, or clear the filter after new submissions arrive.`}
          </p>
          <div className="admin-empty__actions mt-3">
            {statusFilter !== "all" ? (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={() => setStatusFilter("all")}
              >
                Show all statuses
              </button>
            ) : (
              <Link href="/contact" className="admin-btn admin-btn--primary">
                Open public contact form
              </Link>
            )}
            {embedded ? (
              <Link href="/admin/crm" className="admin-btn admin-btn--outline">
                Open CRM hub
              </Link>
            ) : null}
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => void fetchItems()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {items.map((item) => {
          const draft = drafts[item.id] || {
            status: item.status,
            followUpChannel: item.followup_channel,
            followUpTarget: item.followup_target || "",
            followUpNotes: item.followup_notes || "",
          };

          return (
            <article
              key={item.id}
              className={embedded ? "admin-panel p-4" : "rounded-xl border border-soft bg-white p-4"}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-heading">{item.name}</h2>
                  <p className="text-xs text-muted">
                    {item.company ? `${item.company} • ` : ""}
                    {item.email || "No email"} • {item.phone || "No phone"}
                  </p>
                  {item.source ? (
                    <p className="mt-1 text-xs text-muted">
                      Source: {item.source}
                      {item.source_path ? ` (${item.source_path})` : ""}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-xs text-muted">{formatDate(item.created_at)}</p>
              </div>

              <p className="mb-4 whitespace-pre-wrap text-sm text-body">{item.message}</p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="admin-field mb-0">
                  <span className="admin-field__label">Status</span>
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: {
                          ...draft,
                          status: event.target.value as QueryStatus,
                        },
                      }))
                    }
                    className="admin-field__control"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-field mb-0">
                  <span className="admin-field__label">Follow-up channel</span>
                  <select
                    value={draft.followUpChannel}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: {
                          ...draft,
                          followUpChannel: event.target.value as FollowUpChannel,
                        },
                      }))
                    }
                    className="admin-field__control"
                  >
                    {followUpOptions.map((channel) => (
                      <option key={channel} value={channel}>
                        {channel}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-field mb-0">
                  <span className="admin-field__label">Follow-up target</span>
                  <input
                    type="text"
                    value={draft.followUpTarget}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: {
                          ...draft,
                          followUpTarget: event.target.value,
                        },
                      }))
                    }
                    placeholder="email / phone"
                    className="admin-field__control"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => void handleSave(item.id)}
                    disabled={savingId === item.id}
                    className="admin-btn admin-btn--primary inline-flex w-full min-h-11 items-center justify-center gap-2"
                  >
                    {savingId === item.id ? (
                      <Loader2 size={16} className="animate-spin" aria-hidden />
                    ) : (
                      <Save size={16} aria-hidden />
                    )}
                    {savingId === item.id ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <label className="admin-field mb-0 mt-3">
                <span className="admin-field__label">Follow-up notes</span>
                <textarea
                  rows={2}
                  value={draft.followUpNotes}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [item.id]: {
                        ...draft,
                        followUpNotes: event.target.value,
                      },
                    }))
                  }
                  placeholder="Call summary, next action, etc."
                  className="admin-field__control admin-field__control--multiline"
                />
              </label>
            </article>
          );
        })}
      </div>
    </section>
  );
}
