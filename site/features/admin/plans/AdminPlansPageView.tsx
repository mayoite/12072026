"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowSquareOut as ExternalLink,
  CircleNotch as Loader2,
  ArrowsClockwise as RefreshCw,
  MagnifyingGlass as Search,
} from "@phosphor-icons/react";

import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import {
  buildAdminPlansListQuery,
  buildPlannerCanvasHref,
  type AdminPlanStatus,
} from "@/features/admin/plans/plannerAdminLinks";

type AdminPlanSummary = {
  id: string;
  title: string;
  project_name: string | null;
  client_name: string | null;
  item_count: number;
  room_width_mm: number;
  room_depth_mm: number;
  status: AdminPlanStatus;
  review_status: "pending" | "approved";
  created_at: string;
  updated_at: string;
};

type PlansResponse = {
  plans: AdminPlanSummary[];
  pagination: { page: number; limit: number; total: number; pages: number };
  source: string;
};

const STATUS_OPTIONS: Array<{ value: "all" | AdminPlanStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Approved" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "updated_at:desc", label: "Recently updated" },
  { value: "updated_at:asc", label: "Oldest updated" },
  { value: "created_at:desc", label: "Recently created" },
  { value: "created_at:asc", label: "Oldest created" },
] as const;

/**
 * Fixed locale + timezone so SSR/client never diverge on date attributes/text
 * (browser locale variance was a hydration attribute mismatch source).
 */
export function formatAdminPlanTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function statusLabel(status: AdminPlanSummary["status"]) {
  if (status === "active") return "Approved";
  if (status === "archived") return "Archived";
  return "Draft";
}

function parseSortValue(
  value: string,
): { sortBy: "updated_at" | "created_at"; sortOrder: "asc" | "desc" } {
  const [sortBy, sortOrder] = value.split(":") as [
    "updated_at" | "created_at",
    "asc" | "desc",
  ];
  return {
    sortBy: sortBy === "created_at" ? "created_at" : "updated_at",
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
  };
}

export default function AdminPlansPageView() {
  const [plans, setPlans] = useState<AdminPlanSummary[]>([]);
  const [pagination, setPagination] = useState<PlansResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | AdminPlanStatus>("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("updated_at:desc");
  const { sortBy, sortOrder } = useMemo(() => parseSortValue(sortValue), [sortValue]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = buildAdminPlansListQuery({
        limit: 50,
        status: statusFilter,
        search: searchQuery,
        sortBy,
        sortOrder,
      });
      const response = await browserApiFetch(apiPath(query));
      if (!response.ok) {
        throw new Error(`Failed to load plans (${response.status})`);
      }
      const payload = (await response.json()) as PlansResponse;
      setPlans(payload.plans ?? []);
      setPagination(payload.pagination ?? null);
      setSource(payload.source ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, sortOrder, statusFilter]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const loadInitialPlans = async () => {
      try {
        const query = buildAdminPlansListQuery({
          limit: 50,
          status: statusFilter,
          search: searchQuery,
          sortBy,
          sortOrder,
        });
        const response = await browserApiFetch(apiPath(query), {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to load plans (${response.status})`);
        }
        const payload = (await response.json()) as PlansResponse;
        if (cancelled) return;
        setPlans(payload.plans ?? []);
        setPagination(payload.pagination ?? null);
        setSource(payload.source ?? null);
      } catch (loadError) {
        if (cancelled || controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load plans");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void loadInitialPlans();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [searchQuery, sortBy, sortOrder, statusFilter]);

  const hasActiveFilters = statusFilter !== "all" || searchQuery.length > 0;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Admin review</p>
          <h1 className="admin-page__title">Planner plans</h1>
          <p className="admin-page__copy">
            Filter saved documents, review metadata, and open any plan in the canvas
            workspace.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--outline"
          onClick={() => void loadPlans()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={14} className="admin-icon-spin" aria-hidden />
          ) : (
            <RefreshCw size={14} aria-hidden />
          )}
          Refresh
        </button>
      </header>

      <div className="admin-toolbar">
        <label className="admin-field min-w-0 flex-1 sm:min-w-[12rem]" htmlFor="admin-plans-search">
          <span className="admin-field__label">Search</span>
          <span className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft"
              aria-hidden
            />
            <input
              id="admin-plans-search"
              name="admin-plans-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Title, project, client…"
              className="admin-field__control w-full pl-9"
              autoComplete="off"
            />
          </span>
        </label>
        <label className="admin-field" htmlFor="admin-plans-status">
          <span className="admin-field__label">Status</span>
          <select
            id="admin-plans-status"
            name="admin-plans-status"
            className="admin-field__control"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | AdminPlanStatus)
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field" htmlFor="admin-plans-sort">
          <span className="admin-field__label">Sort</span>
          <select
            id="admin-plans-sort"
            name="admin-plans-sort"
            className="admin-field__control"
            value={sortValue}
            onChange={(event) =>
              setSortValue(event.target.value as (typeof SORT_OPTIONS)[number]["value"])
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {hasActiveFilters ? (
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => {
              setStatusFilter("all");
              setSearchInput("");
              setSearchQuery("");
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {source === "unconfigured" ? (
        <div className="admin-alert admin-alert--info" role="status">
          Database storage is not configured. Plan review will appear here once
          persistence is enabled.
        </div>
      ) : null}

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      {pagination ? (
        <p className="mb-3 text-sm text-muted">
          Showing {plans.length} of {pagination.total} plan
          {pagination.total === 1 ? "" : "s"}
        </p>
      ) : null}

      {loading ? (
        <div className="admin-status-line" role="status" aria-live="polite">
          <Loader2 size={16} className="admin-icon-spin" aria-hidden />
          Loading plans…
        </div>
      ) : plans.length === 0 ? (
        <div className="admin-empty" role="status">
          {hasActiveFilters
            ? "No plans match the current filters."
            : "No plans found yet."}
        </div>
      ) : (
        <div className="admin-panel admin-table-wrap" data-phone-layout="cards-priority">
          <table className="admin-table" data-phone-layout="cards-priority">
            <caption className="sr-only">Planner plans available for Admin review</caption>
            <thead className="border-b border-soft bg-subtle text-xs uppercase tracking-wide text-soft">
              <tr>
                <th scope="col">Plan</th>
                <th scope="col">Room</th>
                <th scope="col">Items</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-soft last:border-b-0">
                  <td data-label="Plan">
                    <Link
                      href={`/admin/plans/${plan.id}`}
                      className="font-medium text-strong hover:underline"
                    >
                      {plan.title}
                    </Link>
                    <p className="admin-type-soft">
                      {plan.project_name ?? plan.client_name ?? "No project metadata"}
                    </p>
                  </td>
                  <td data-label="Room" className="text-muted">
                    {plan.room_width_mm} × {plan.room_depth_mm} mm
                  </td>
                  <td data-label="Items" className="text-muted">
                    {plan.item_count}
                  </td>
                  <td data-label="Status">
                    <span className="rounded-full bg-subtle px-2 py-1 text-xs text-muted">
                      {statusLabel(plan.status)}
                    </span>
                  </td>
                  <td data-label="Updated" className="text-muted">
                    {formatAdminPlanTimestamp(plan.updated_at)}
                  </td>
                  <td data-label="Actions">
                    <Link
                      href={buildPlannerCanvasHref(plan.id)}
                      className="inline-flex gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink size={14} aria-hidden />
                      Open in canvas
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
