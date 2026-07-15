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
import type { CatalogLifecycleManifest, CatalogLifecycleState } from "../lifecycle/catalogLifecycle.shared";
import { resolveCatalogLifecycle } from "../lifecycle/catalogLifecycle.shared";
import { AdminSvgBulkImportPanel } from "./AdminSvgBulkImportPanel";
import type { SvgArtifactStatus } from "../publish/svgArtifactStatus.server";
import { PublishedSvgPreview } from "../publish/PublishedSvgPreview";
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
} from "../lifecycle/svgInventoryFilter";

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
      return "Fixed size — edit the symbol, not the dimensions.";
    case "configurable":
      return "Options or bounded size choices for the same product family.";
    case "parametric":
      return "Sized in the studio with clear footprint for Planner.";
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
      if (views.length === 0) return;
      // Defer setState out of the effect body (react-hooks/set-state-in-effect).
      const id = requestAnimationFrame(() => setSavedViews(views));
      return () => cancelAnimationFrame(id);
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
            Find a product, open the visual studio, set identity and footprint,
            preview the Planner symbol, then publish. You do not need to edit
            JSON or source code.
          </p>
          <p className="admin-page__meta" data-testid="admin-shell-source">
            Source: local disk inventory · Products DB not live · refreshed{" "}
            <time dateTime={refreshedAtLabel}>{refreshedAtLabel}</time>
          </p>
          <p
            className="admin-page__meta"
            role="status"
            data-testid="admin-shell-state"
          >
            State:{" "}
            <span data-testid="artifact-health">
              <strong>{publishedCount}</strong> published ·{" "}
              <strong>{missingCount}</strong> missing symbol ·{" "}
              <strong>{invalidCount}</strong> need attention · of{" "}
              <strong>{descriptors.length}</strong> products
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

      {/* Compact family counts — not a dashboard of three equal cards */}
      <p
        className="admin-page__meta admin-svg-inventory-mix"
        data-testid="admin-svg-family-mix"
        role="status"
      >
        {VARIANT_ORDER.map((variant, index) => (
          <span key={variant} data-variant={variant}>
            {index > 0 ? " · " : null}
            <strong>{counts[variant]}</strong> {VARIANT_LABEL[variant].toLowerCase()}
            <span className="sr-only">. {describeVariant(variant)}</span>
          </span>
        ))}
      </p>

      {descriptors.length === 0 ? (
        <div className="admin-empty" role="status">
          <p className="admin-table__primary">No SVG symbols yet</p>
          <p className="admin-table__secondary">
            Create a symbol in the visual studio. That is the primary authoring
            path.
          </p>
          <div className="admin-section-top">
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
        <div
          className="admin-panel admin-svg-inventory"
          data-testid="admin-svg-inventory"
        >
          <div className="admin-panel__header">
            Symbol inventory · {sortedRows.length} of {inventoryRows.length}
            {paged.totalPages > 1
              ? ` · page ${paged.page}/${paged.totalPages}`
              : ""}
          </div>
          {/* Primary operator controls only */}
          <div
            className="admin-svg-inventory-filters"
            data-testid="admin-svg-inventory-filters"
          >
            <label className="admin-field admin-field--search admin-svg-inventory-filters__search">
              <span className="admin-field__label">Search</span>
              <input
                type="search"
                className="admin-field__control admin-field__input--search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Name, SKU, family…"
                data-testid="admin-svg-inventory-search"
                aria-label="Search SVG inventory"
              />
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
              <span className="admin-field__label">Symbol status</span>
              <select
                className="admin-field__control"
                value={artifactFilter}
                onChange={(event) => {
                  setArtifactFilter(event.target.value as InventoryArtifactFilter);
                  setPage(1);
                }}
                data-testid="admin-svg-filter-artifact"
                aria-label="Filter by symbol status"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="missing">Missing</option>
                <option value="invalid">Needs attention</option>
              </select>
            </label>
          </div>
          <details className="admin-page__section admin-svg-inventory-more">
            <summary className="admin-panel__header">
              More filters · family, sort, page size
            </summary>
            <div className="admin-svg-inventory-filters admin-svg-inventory-filters--secondary">
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
          </details>

          {/* Saved views are secondary — do not compete with search/filters */}
          <details
            className="admin-page__section"
            data-testid="admin-svg-inventory-saved-views"
          >
            <summary className="admin-panel__header">
              Saved views (optional)
            </summary>
            <div className="admin-panel__body admin-actions-row admin-actions-row--end">
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
          </details>

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
                  className="admin-table admin-svg-inventory-table"
                  data-testid="admin-svg-inventory-table"
                  data-phone-layout="cards-priority"
                >
                  <caption className="sr-only">
                    SVG product symbols grouped by family: preview, product
                    identity, size, lifecycle, symbol status, last change, and
                    actions.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Preview</th>
                      <th scope="col">Product</th>
                      <th scope="col">Size</th>
                      <th scope="col">Lifecycle</th>
                      <th scope="col">Symbol</th>
                      <th scope="col">Updated</th>
                      <th scope="col" className="admin-table__actions-head">
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
                          colSpan={7}
                          className="admin-panel__header"
                        >
                          {VARIANT_LABEL[group.family]} · {group.rows.length}
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
                            className="admin-svg-inventory-row"
                          >
                            <td data-label="Preview">
                              <PublishedSvgPreview
                                slug={d.slug}
                                status={status}
                                size="thumb"
                              />
                            </td>
                            <td data-label="Product">
                              <p className="admin-table__primary">
                                <Link
                                  href={`/admin/svg-editor/${d.slug}`}
                                  aria-label={`Open ${d.slug} identity`}
                                >
                                  {d.slug}
                                </Link>
                              </p>
                              <p
                                className="admin-table__secondary"
                                data-testid={`admin-svg-sku-${d.slug}`}
                              >
                                SKU {d.sku ?? "—"}
                              </p>
                              <span className="sr-only">
                                Family {VARIANT_LABEL[d.variant]}
                              </span>
                            </td>
                            <td
                              data-label="Size"
                              data-testid={`admin-svg-dimensions-${d.slug}`}
                            >
                              {d.geometry.widthMm}×{d.geometry.depthMm}
                              {d.geometry.heightMm
                                ? `×${d.geometry.heightMm}`
                                : ""}{" "}
                              mm
                            </td>
                            <td data-label="Lifecycle">
                              <span
                                className={lifecycleBadgeClass(lifecycle)}
                              >
                                {lifecycle}
                              </span>
                              <span
                                className="sr-only"
                                data-testid={`admin-svg-availability-${d.slug}`}
                              >
                                {row.availability}
                              </span>
                            </td>
                            <td data-label="Symbol">
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
                                  : "No published symbol yet"}
                              </p>
                            </td>
                            <td data-label="Updated">
                              <span
                                className="admin-table__secondary"
                                data-testid={`admin-svg-last-change-${d.slug}`}
                              >
                                {row.lastChangeLabel}
                              </span>
                            </td>
                            <td data-label="Actions">
                              <div className="admin-svg-inventory-actions">
                                <Link
                                  href={`/admin/svg-editor/${d.slug}`}
                                  className="admin-btn admin-btn--outline"
                                  aria-label={`Edit ${d.slug} in SVG studio`}
                                  data-testid={`admin-svg-edit-${d.slug}`}
                                >
                                  <Pencil size={14} aria-hidden />
                                  Edit
                                </Link>
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
                className="admin-catalog-paging"
                data-testid="admin-svg-inventory-paging"
              >
                <p className="admin-table__secondary" role="status">
                  Page {paged.page} of {paged.totalPages} · {paged.total} match
                  {paged.total === 1 ? "" : "es"}
                </p>
                <div className="admin-actions-row">
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

      {/* ADM-SVG-01 / 03: bulk import never dominates the inventory journey. */}
      <section
        className="admin-page__section admin-page__section--spaced"
        aria-label="Advanced tools"
        data-testid="admin-svg-advanced-section"
      >
        <details
          className="admin-panel admin-svg-advanced-import"
          data-testid="admin-svg-advanced-import"
        >
          <summary className="admin-panel__header">
            Advanced · bulk import
          </summary>
          <div className="admin-panel__body">
            <div className="admin-stack">
              <p className="admin-page__meta">
                Migration tool only — paste spreadsheet rows, preview, then apply.
                Day-to-day work uses Search and New SVG symbol above. Not required
                for authoring.
              </p>
              <AdminSvgBulkImportPanel />
            </div>
          </div>
        </details>
      </section>
    </div>
  );
}

export default AdminSvgEditorListView;
