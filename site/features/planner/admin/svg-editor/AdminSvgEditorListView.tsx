"use client";

/**
 * Phase 04 — Admin SVG Editor list view (server-rendered shell + client hydration).
 *
 * §04-ADMIN-01: list view of registered descriptors + "new block" CTA.
 * The list is server-loaded via {@link listBlockDescriptors}, then passed
 * into this client component for interactive navigation to per-slug routes.
 *
 * Chrome: ADMIN-UI-CONTRACT primitives only (admin-page / admin-btn / admin-panel /
 * admin-table / admin-badge / admin-empty). No raw palette classes.
 *
 * A1 UI slice: artifact state + colored SVG thumbnail before edit.
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilSimple as Pencil, Plus } from "@phosphor-icons/react";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import type { CatalogLifecycleManifest, CatalogLifecycleState } from "./catalogLifecycle.shared";
import { resolveCatalogLifecycle } from "./catalogLifecycle.shared";
import { AdminSvgBulkImportPanel } from "./AdminSvgBulkImportPanel";
import type { SvgArtifactStatus } from "./svgArtifactStatus.server";
import { PublishedSvgPreview } from "./PublishedSvgPreview";
import {
  INVENTORY_PAGE_SIZE_DEFAULT,
  INVENTORY_SAVED_VIEWS_STORAGE_KEY,
  availabilityFromLifecycle,
  createSavedView,
  filterInventoryRows,
  groupInventoryRowsByFamily,
  pageInventoryRows,
  parseSavedViews,
  serializeSavedViews,
  sortInventoryRows,
  validationLabelForArtifact,
  type InventoryArtifactFilter,
  type InventoryLifecycleFilter,
  type InventorySavedView,
  type InventorySortDir,
  type InventorySortKey,
  type SvgInventoryRow,
} from "./svgInventoryFilter";

const VARIANT_LABEL: Readonly<Record<BlockDescriptor["variant"], string>> = {
  fixed: "Fixed",
  configurable: "Configurable",
  parametric: "Parametric",
};

const VARIANT_ORDER: ReadonlyArray<BlockDescriptor["variant"]> = [
  "fixed",
  "configurable",
  "parametric",
];

function describeVariant(variant: BlockDescriptor["variant"]): string {
  switch (variant) {
    case "fixed":
      return "Locked dimensions, no parametric controls.";
    case "configurable":
      return "Discrete option set or bounded parametric adjustment.";
    case "parametric":
      return "Full parametric schema with explicit mounting points.";
  }
}

function variantBadgeClass(variant: BlockDescriptor["variant"]): string {
  switch (variant) {
    case "parametric":
      return "admin-badge admin-badge--active";
    case "configurable":
      return "admin-badge admin-badge--active";
    case "fixed":
      return "admin-badge admin-badge--hidden";
  }
}

function variantSlugCount(
  descriptors: ReadonlyArray<BlockDescriptor>,
): Readonly<Record<BlockDescriptor["variant"], number>> {
  const counts: Record<BlockDescriptor["variant"], number> = {
    fixed: 0,
    configurable: 0,
    parametric: 0,
  };
  for (const d of descriptors) {
    counts[d.variant] += 1;
  }
  return counts;
}

function timestampLabel(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return "—";
  try {
    const normalized = value < 1e12 ? value * 1000 : value;
    return new Date(normalized)
      .toISOString()
      .replace("T", " ")
      .replace(/\..*$/, "");
  } catch {
    return String(value);
  }
}

function missingStatus(): SvgArtifactStatus {
  return {
    state: "missing",
    bytes: 0,
    updatedAt: null,
    hash: null,
    publicUrl: null,
    markup: null,
  };
}

function lifecycleBadgeClass(state: CatalogLifecycleState): string {
  switch (state) {
    case "live":
      return "admin-badge admin-badge--active";
    case "retired":
      return "admin-badge admin-badge--hidden";
    case "draft":
      return "admin-badge admin-badge--warn";
  }
}

export interface AdminSvgEditorListViewProps {
  readonly descriptors: ReadonlyArray<BlockDescriptor>;
  readonly refreshedAtLabel: string;
  readonly artifactStatuses: Readonly<Record<string, SvgArtifactStatus>>;
  readonly lifecycleManifest: CatalogLifecycleManifest;
}

function artifactLabel(state: SvgArtifactStatus["state"]): string {
  switch (state) {
    case "published":
      return "Published";
    case "invalid":
      return "Invalid SVG";
    case "missing":
      return "Missing";
  }
}

function artifactBadgeClass(state: SvgArtifactStatus["state"]): string {
  switch (state) {
    case "published":
      return "admin-badge admin-badge--active";
    case "invalid":
      return "admin-badge admin-badge--warn";
    case "missing":
      return "admin-badge admin-badge--hidden";
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function AdminSvgEditorListView({
  descriptors,
  refreshedAtLabel,
  artifactStatuses,
  lifecycleManifest,
}: AdminSvgEditorListViewProps) {
  const [lifecycleBusySlug, setLifecycleBusySlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [artifactFilter, setArtifactFilter] =
    useState<InventoryArtifactFilter>("all");
  const [lifecycleFilter, setLifecycleFilter] =
    useState<InventoryLifecycleFilter>("all");
  const [variantFilter, setVariantFilter] = useState<
    "all" | BlockDescriptor["variant"]
  >("all");
  const [sortKey, setSortKey] = useState<InventorySortKey>("family");
  const [sortDir, setSortDir] = useState<InventorySortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(INVENTORY_PAGE_SIZE_DEFAULT);
  const [savedViews, setSavedViews] = useState<InventorySavedView[]>([]);
  const [savedViewName, setSavedViewName] = useState("");

  const setLifecycle = useCallback(async (slug: string, state: CatalogLifecycleState) => {
    setLifecycleBusySlug(slug);
    try {
      await browserApiFetch(apiPath(`/api/admin/svg-editor/${slug}/lifecycle`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      window.location.reload();
    } finally {
      setLifecycleBusySlug(null);
    }
  }, []);

  const counts = variantSlugCount(descriptors);
  const publishedCount = descriptors.filter(
    (descriptor) => artifactStatuses[descriptor.slug]?.state === "published",
  ).length;
  const missingCount = descriptors.filter(
    (descriptor) =>
      (artifactStatuses[descriptor.slug]?.state ?? "missing") === "missing",
  ).length;
  const invalidCount = descriptors.filter(
    (descriptor) => artifactStatuses[descriptor.slug]?.state === "invalid",
  ).length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(INVENTORY_SAVED_VIEWS_STORAGE_KEY);
      const views = parseSavedViews(raw);
      if (views.length > 0) setSavedViews(views);
    } catch {
      // ignore storage failures
    }
  }, []);

  const inventoryRows = useMemo((): readonly SvgInventoryRow[] => {
    return descriptors.map((descriptor) => {
      const status = artifactStatuses[descriptor.slug] ?? missingStatus();
      const lifecycle = resolveCatalogLifecycle(
        descriptor.slug,
        status.state,
        lifecycleManifest,
      );
      const epoch =
        typeof descriptor.generatedAt === "number" &&
        Number.isFinite(descriptor.generatedAt)
          ? descriptor.generatedAt < 1e12
            ? descriptor.generatedAt * 1000
            : descriptor.generatedAt
          : 0;
      return {
        descriptor,
        artifactState: status.state,
        lifecycle,
        lastChangeLabel: timestampLabel(descriptor.generatedAt),
        lastChangeEpoch: epoch,
        validationLabel: validationLabelForArtifact(status.state),
        family: descriptor.variant,
        availability: availabilityFromLifecycle(lifecycle),
      };
    });
  }, [artifactStatuses, descriptors, lifecycleManifest]);

  const filterInput = useMemo(
    () => ({
      query,
      artifact: artifactFilter,
      lifecycle: lifecycleFilter,
      variant: variantFilter,
    }),
    [artifactFilter, lifecycleFilter, query, variantFilter],
  );

  const filteredRows = useMemo(
    () => filterInventoryRows(inventoryRows, filterInput),
    [filterInput, inventoryRows],
  );

  const sortedRows = useMemo(
    () => sortInventoryRows(filteredRows, sortKey, sortDir),
    [filteredRows, sortDir, sortKey],
  );

  const paged = useMemo(
    () => pageInventoryRows(sortedRows, page, pageSize),
    [page, pageSize, sortedRows],
  );

  const familyGroups = useMemo(
    () => groupInventoryRowsByFamily(paged.pageRows),
    [paged.pageRows],
  );

  const persistSavedViews = useCallback((views: InventorySavedView[]) => {
    setSavedViews(views);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        INVENTORY_SAVED_VIEWS_STORAGE_KEY,
        serializeSavedViews(views),
      );
    } catch {
      // ignore quota / private mode
    }
  }, []);

  const saveCurrentView = useCallback(() => {
    const view = createSavedView(
      savedViewName,
      filterInput,
      sortKey,
      sortDir,
      pageSize,
    );
    persistSavedViews([...savedViews, view]);
    setSavedViewName("");
  }, [
    filterInput,
    pageSize,
    persistSavedViews,
    savedViewName,
    savedViews,
    sortDir,
    sortKey,
  ]);

  const applySavedView = useCallback((view: InventorySavedView) => {
    setQuery(view.filter.query);
    setArtifactFilter(view.filter.artifact);
    setLifecycleFilter(view.filter.lifecycle);
    setVariantFilter(view.filter.variant);
    setSortKey(view.sortKey);
    setSortDir(view.sortDir);
    setPageSize(view.pageSize);
    setPage(1);
  }, []);

  return (
    <div
      className="admin-page"
      data-testid="admin-svg-primary-journey"
      data-admin-shell="list"
    >
      <header className="admin-page__header" data-testid="admin-shell-header">
        <div>
          {/* ADM-SHELL-01: title, scope, source, state */}
          <p className="admin-page__eyebrow" data-testid="admin-shell-scope">
            Catalog assets · SVG authoring
          </p>
          <h1 className="admin-page__title" data-testid="admin-shell-title">
            SVG symbols
          </h1>
          <p className="admin-page__copy" data-testid="admin-svg-journey-copy">
            Draw and edit product symbols in the visual studio. Set identity and
            millimetre footprint, preview the Planner symbol, then publish. You
            do not need to edit JSON or source code.
          </p>
          <p className="admin-page__meta" data-testid="admin-shell-source">
            Source: disk block-descriptors (buyer-visible inventory) · refreshed{" "}
            <code>{refreshedAtLabel}</code>
          </p>
          <p
            className="admin-page__meta"
            role="status"
            data-testid="admin-shell-state"
          >
            State:{" "}
            <span data-testid="artifact-health">
              <strong>{publishedCount}</strong> published ·{" "}
              <strong>{missingCount}</strong> missing ·{" "}
              <strong>{invalidCount}</strong> invalid · of{" "}
              <strong>{descriptors.length}</strong> symbols
            </span>
          </p>
        </div>
        {/* ADM-SHELL-02: only one primary action in the header */}
        <div className="admin-page__actions" data-testid="admin-shell-actions">
          <Link
            href="/admin/svg-editor/new"
            className="admin-btn admin-btn--primary"
            data-testid="admin-shell-primary-action"
          >
            <Plus size={14} aria-hidden />
            New SVG symbol
          </Link>
        </div>
      </header>

      <section aria-label="Variant balances" className="admin-grid-cards mb-6">
        {VARIANT_ORDER.map((variant) => (
          <article key={variant} className="admin-panel" data-variant={variant}>
            <div className="admin-panel__header">{VARIANT_LABEL[variant]}</div>
            <div className="px-4 py-3">
              <p className="admin-table__primary">{counts[variant]}</p>
              <p className="admin-table__secondary">
                {describeVariant(variant)}
              </p>
            </div>
          </article>
        ))}
      </section>

      {descriptors.length === 0 ? (
        <div className="admin-empty" role="status">
          <p className="admin-table__primary">No SVG symbols yet</p>
          <p className="admin-table__secondary">
            Start with New SVG symbol. The visual studio is the primary authoring
            path.
          </p>
          <div className="mt-4">
            <Link
              href="/admin/svg-editor/new"
              className="admin-btn admin-btn--primary"
              data-testid="admin-svg-primary-new-empty"
            >
              <Plus size={14} aria-hidden />
              New SVG symbol
            </Link>
          </div>
        </div>
      ) : (
        <div className="admin-panel" data-testid="admin-svg-inventory">
          <div className="admin-panel__header">
            {sortedRows.length} of {inventoryRows.length} symbol
            {inventoryRows.length === 1 ? "" : "s"}
            {paged.totalPages > 1
              ? ` · showing page ${paged.page}/${paged.totalPages}`
              : ""}
          </div>
          <div
            className="px-4 py-3 flex flex-wrap gap-3"
            data-testid="admin-svg-inventory-filters"
          >
            <label className="admin-field">
              <span className="admin-field__label">Find</span>
              <input
                type="search"
                className="admin-field__control"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Slug, SKU, family…"
                data-testid="admin-svg-inventory-search"
                aria-label="Search SVG inventory"
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Artifact</span>
              <select
                className="admin-field__control"
                value={artifactFilter}
                onChange={(event) => {
                  setArtifactFilter(event.target.value as InventoryArtifactFilter);
                  setPage(1);
                }}
                data-testid="admin-svg-filter-artifact"
                aria-label="Filter by artifact state"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="missing">Missing</option>
                <option value="invalid">Invalid</option>
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Lifecycle</span>
              <select
                className="admin-field__control"
                value={lifecycleFilter}
                onChange={(event) => {
                  setLifecycleFilter(
                    event.target.value as InventoryLifecycleFilter,
                  );
                  setPage(1);
                }}
                data-testid="admin-svg-filter-lifecycle"
                aria-label="Filter by lifecycle"
              >
                <option value="all">All</option>
                <option value="live">Live</option>
                <option value="draft">Draft</option>
                <option value="retired">Retired</option>
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Family</span>
              <select
                className="admin-field__control"
                value={variantFilter}
                onChange={(event) => {
                  setVariantFilter(
                    event.target.value as "all" | BlockDescriptor["variant"],
                  );
                  setPage(1);
                }}
                data-testid="admin-svg-filter-variant"
                aria-label="Filter by family variant"
              >
                <option value="all">All</option>
                {VARIANT_ORDER.map((variant) => (
                  <option key={variant} value={variant}>
                    {VARIANT_LABEL[variant]}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Sort</span>
              <select
                className="admin-field__control"
                value={sortKey}
                onChange={(event) =>
                  setSortKey(event.target.value as InventorySortKey)
                }
                data-testid="admin-svg-inventory-sort"
                aria-label="Sort inventory"
              >
                <option value="family">Family</option>
                <option value="slug">Identity</option>
                <option value="sku">SKU</option>
                <option value="lifecycle">Lifecycle</option>
                <option value="lastChange">Last change</option>
                <option value="widthMm">Width mm</option>
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Direction</span>
              <select
                className="admin-field__control"
                value={sortDir}
                onChange={(event) =>
                  setSortDir(event.target.value as InventorySortDir)
                }
                data-testid="admin-svg-inventory-sort-dir"
                aria-label="Sort direction"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Page size</span>
              <select
                className="admin-field__control"
                value={String(pageSize)}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                data-testid="admin-svg-inventory-page-size"
                aria-label="Rows per page"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </label>
          </div>

          <div
            className="px-4 py-2 flex flex-wrap gap-2 items-end"
            data-testid="admin-svg-inventory-saved-views"
          >
            <label className="admin-field">
              <span className="admin-field__label">Save view as</span>
              <input
                type="text"
                className="admin-field__control"
                value={savedViewName}
                onChange={(event) => setSavedViewName(event.target.value)}
                placeholder="e.g. Live published"
                aria-label="Name for saved inventory view"
                data-testid="admin-svg-inventory-saved-view-name"
              />
            </label>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={saveCurrentView}
              disabled={savedViewName.trim() === ""}
              data-testid="admin-svg-inventory-save-view"
            >
              Save view
            </button>
            {savedViews.map((view) => (
              <button
                key={view.id}
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() => applySavedView(view)}
                data-testid={`admin-svg-inventory-apply-view-${view.id}`}
                aria-label={`Apply saved view ${view.name}`}
              >
                {view.name}
              </button>
            ))}
          </div>

          {sortedRows.length === 0 ? (
            <div
              className="admin-empty"
              role="status"
              data-testid="admin-svg-inventory-empty"
            >
              <p className="admin-table__primary">No symbols match these filters</p>
              <p className="admin-table__secondary">
                Clear search or filters to see the full inventory.
              </p>
            </div>
          ) : (
            <>
              <div
                className="admin-table-wrap admin-svg-inventory-table-wrap"
                data-phone-layout="cards-priority"
              >
                <table
                  className="admin-table"
                  data-testid="admin-svg-inventory-table"
                  data-phone-layout="cards-priority"
                >
                  <caption className="sr-only">
                    SVG product symbols grouped by family with identity, SKU,
                    dimensions, lifecycle, availability, symbol state, and last
                    change.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Preview</th>
                      <th scope="col">Identity</th>
                      <th scope="col">SKU</th>
                      <th scope="col">Family</th>
                      <th scope="col">Dimensions</th>
                      <th scope="col">Lifecycle</th>
                      <th scope="col">Availability</th>
                      <th scope="col">Symbol</th>
                      <th scope="col">Last change</th>
                      <th scope="col" className="text-end">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {familyGroups.map((group) => (
                    <tbody
                      key={group.family}
                      data-family={group.family}
                      data-testid={`admin-svg-family-group-${group.family}`}
                    >
                      <tr className="admin-table__group">
                        <th
                          scope="colgroup"
                          colSpan={10}
                          className="admin-panel__header"
                        >
                          Family · {VARIANT_LABEL[group.family]} (
                          {group.rows.length})
                        </th>
                      </tr>
                      {group.rows.map((row) => {
                        const d = row.descriptor;
                        const status =
                          artifactStatuses[d.slug] ?? missingStatus();
                        const lifecycle = row.lifecycle;
                        return (
                          <tr
                            key={`${d.variant}:${d.slug}`}
                            data-slug={d.slug}
                            data-family={row.family}
                            data-artifact-state={status.state}
                            data-validation={row.validationLabel}
                            data-lifecycle={lifecycle}
                            data-availability={row.availability}
                          >
                            <td>
                              <PublishedSvgPreview
                                slug={d.slug}
                                status={status}
                                size="thumb"
                              />
                            </td>
                            <td>
                              <p className="admin-table__primary">
                                <Link
                                  href={`/admin/svg-editor/${d.slug}`}
                                  aria-label={`Open ${d.slug} identity`}
                                >
                                  {d.slug}
                                </Link>
                              </p>
                            </td>
                            <td>
                              <code data-testid={`admin-svg-sku-${d.slug}`}>
                                {d.sku ?? "—"}
                              </code>
                            </td>
                            <td>
                              <span className={variantBadgeClass(d.variant)}>
                                {VARIANT_LABEL[d.variant]}
                              </span>
                            </td>
                            <td
                              data-testid={`admin-svg-dimensions-${d.slug}`}
                            >
                              {d.geometry.widthMm}×{d.geometry.depthMm}
                              {d.geometry.heightMm
                                ? `×${d.geometry.heightMm}`
                                : ""}{" "}
                              mm
                            </td>
                            <td>
                              <span
                                className={lifecycleBadgeClass(lifecycle)}
                              >
                                {lifecycle}
                              </span>
                            </td>
                            <td>
                              <span
                                className={
                                  row.availability === "available"
                                    ? "admin-badge admin-badge--active"
                                    : row.availability === "retired"
                                      ? "admin-badge admin-badge--hidden"
                                      : "admin-badge admin-badge--warn"
                                }
                                data-testid={`admin-svg-availability-${d.slug}`}
                              >
                                {row.availability}
                              </span>
                            </td>
                            <td>
                              <span
                                className={artifactBadgeClass(status.state)}
                                data-testid={`admin-svg-validation-${d.slug}`}
                              >
                                {artifactLabel(status.state)}
                                {row.validationLabel === "ok"
                                  ? " · Valid"
                                  : row.validationLabel === "invalid"
                                    ? " · Invalid"
                                    : " · Missing"}
                              </span>
                              <p className="admin-table__secondary">
                                {status.bytes > 0
                                  ? formatBytes(status.bytes)
                                  : "No bytes on disk"}
                              </p>
                            </td>
                            <td>
                              <code
                                className="text-muted"
                                data-testid={`admin-svg-last-change-${d.slug}`}
                              >
                                {row.lastChangeLabel}
                              </code>
                            </td>
                            <td>
                              <div className="flex flex-wrap justify-end gap-2">
                                {lifecycle !== "retired" ? (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn--outline"
                                    disabled={lifecycleBusySlug === d.slug}
                                    onClick={() =>
                                      void setLifecycle(d.slug, "retired")
                                    }
                                    aria-label={`Retire ${d.slug}`}
                                    data-testid={`admin-svg-retire-${d.slug}`}
                                  >
                                    Retire
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn--outline"
                                    disabled={lifecycleBusySlug === d.slug}
                                    onClick={() =>
                                      void setLifecycle(d.slug, "live")
                                    }
                                    aria-label={`Restore ${d.slug} to live`}
                                    data-testid={`admin-svg-restore-${d.slug}`}
                                  >
                                    Restore
                                  </button>
                                )}
                                <Link
                                  href={`/admin/svg-editor/${d.slug}`}
                                  className="admin-btn admin-btn--outline"
                                  aria-label={`Edit ${d.slug} in SVG studio`}
                                  data-testid={`admin-svg-edit-${d.slug}`}
                                >
                                  <Pencil size={14} aria-hidden />
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  ))}
                </table>
              </div>
              <div
                className="px-4 py-3 flex flex-wrap gap-2 items-center justify-between"
                data-testid="admin-svg-inventory-paging"
              >
                <p className="admin-table__secondary" role="status">
                  Page {paged.page} of {paged.totalPages} · {paged.total} match
                  {paged.total === 1 ? "" : "es"}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    disabled={paged.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    data-testid="admin-svg-inventory-page-prev"
                    aria-label="Previous inventory page"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    disabled={paged.page >= paged.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(paged.totalPages, p + 1))
                    }
                    data-testid="admin-svg-inventory-page-next"
                    aria-label="Next inventory page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ADM-SVG-01: bulk CSV is not the primary journey (advanced path). */}
      <details className="admin-panel mt-6" data-testid="admin-svg-advanced-import">
        <summary className="admin-panel__header">
          Advanced · bulk CSV import
        </summary>
        <div className="px-4 py-3">
          <p className="admin-page__meta mb-3">
            Optional migration tool. The primary path is the visual studio above.
          </p>
          <AdminSvgBulkImportPanel />
        </div>
      </details>
    </div>
  );
}

export default AdminSvgEditorListView;
