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
import { useCallback, useMemo, useState } from "react";
import { PencilSimple as Pencil, Plus } from "@phosphor-icons/react";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import type { CatalogLifecycleManifest, CatalogLifecycleState } from "./catalogLifecycle.shared";
import { resolveCatalogLifecycle } from "./catalogLifecycle.shared";
import { AdminSvgBulkImportPanel } from "./AdminSvgBulkImportPanel";
import type { SvgArtifactStatus } from "./svgArtifactStatus.server";
import { PublishedSvgPreview } from "./PublishedSvgPreview";
import {
  filterInventoryRows,
  validationLabelForArtifact,
  type InventoryArtifactFilter,
  type InventoryLifecycleFilter,
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

  const inventoryRows = useMemo((): readonly SvgInventoryRow[] => {
    const ordered = [...descriptors].sort((a, b) => {
      const av = a.variant.localeCompare(b.variant);
      return av !== 0 ? av : a.slug.localeCompare(b.slug);
    });
    return ordered.map((descriptor) => {
      const status = artifactStatuses[descriptor.slug] ?? missingStatus();
      const lifecycle = resolveCatalogLifecycle(
        descriptor.slug,
        status.state,
        lifecycleManifest,
      );
      return {
        descriptor,
        artifactState: status.state,
        lifecycle,
        lastChangeLabel: timestampLabel(descriptor.generatedAt),
        validationLabel: validationLabelForArtifact(status.state),
      };
    });
  }, [artifactStatuses, descriptors, lifecycleManifest]);

  const filteredRows = useMemo(
    () =>
      filterInventoryRows(inventoryRows, {
        query,
        artifact: artifactFilter,
        lifecycle: lifecycleFilter,
        variant: variantFilter,
      }),
    [artifactFilter, inventoryRows, lifecycleFilter, query, variantFilter],
  );

  return (
    <div className="admin-page" data-testid="admin-svg-primary-journey">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog assets · SVG authoring</p>
          <h1 className="admin-page__title">SVG symbols</h1>
          <p className="admin-page__copy" data-testid="admin-svg-journey-copy">
            Draw and edit product symbols in the visual studio. Set identity and
            millimetre footprint, preview the Planner symbol, then publish. You
            do not need to edit JSON or source code.
          </p>
          <p className="admin-page__meta">
            Inventory refreshed <code>{refreshedAtLabel}</code>
          </p>
          <p
            className="admin-page__meta"
            role="status"
            data-testid="artifact-health"
          >
            Artifact health: <strong>{publishedCount}</strong> published ·{" "}
            <strong>{missingCount}</strong> missing ·{" "}
            <strong>{invalidCount}</strong> invalid · of{" "}
            <strong>{descriptors.length}</strong> symbols.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link
            href="/admin/svg-editor/new"
            className="admin-btn admin-btn--primary"
            data-testid="admin-svg-primary-new"
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
            {filteredRows.length} of {inventoryRows.length} symbol
            {inventoryRows.length === 1 ? "" : "s"}
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-3" data-testid="admin-svg-inventory-filters">
            <label className="admin-field">
              <span className="admin-field__label">Find</span>
              <input
                type="search"
                className="admin-field__control"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Slug, SKU, variant…"
                data-testid="admin-svg-inventory-search"
                aria-label="Search SVG inventory"
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Artifact</span>
              <select
                className="admin-field__control"
                value={artifactFilter}
                onChange={(event) =>
                  setArtifactFilter(event.target.value as InventoryArtifactFilter)
                }
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
                onChange={(event) =>
                  setLifecycleFilter(event.target.value as InventoryLifecycleFilter)
                }
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
              <span className="admin-field__label">Variant</span>
              <select
                className="admin-field__control"
                value={variantFilter}
                onChange={(event) =>
                  setVariantFilter(
                    event.target.value as "all" | BlockDescriptor["variant"],
                  )
                }
                data-testid="admin-svg-filter-variant"
                aria-label="Filter by variant"
              >
                <option value="all">All</option>
                {VARIANT_ORDER.map((variant) => (
                  <option key={variant} value={variant}>
                    {VARIANT_LABEL[variant]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {filteredRows.length === 0 ? (
            <div className="admin-empty" role="status" data-testid="admin-svg-inventory-empty">
              <p className="admin-table__primary">No symbols match these filters</p>
              <p className="admin-table__secondary">Clear search or filters to see the full inventory.</p>
            </div>
          ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">
                SVG product symbols with preview, identity, validation, artifact
                state, lifecycle, and last change.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Preview</th>
                  <th scope="col">Identity</th>
                  <th scope="col">Variant</th>
                  <th scope="col">Validation</th>
                  <th scope="col">Artifact</th>
                  <th scope="col">Lifecycle</th>
                  <th scope="col">Last change</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const d = row.descriptor;
                  const status = artifactStatuses[d.slug] ?? missingStatus();
                  const lifecycle = row.lifecycle;
                  return (
                    <tr
                      key={`${d.variant}:${d.slug}`}
                      data-slug={d.slug}
                      data-artifact-state={status.state}
                      data-validation={row.validationLabel}
                      data-lifecycle={lifecycle}
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
                          <Link href={`/admin/svg-editor/${d.slug}`}>
                            {d.slug}
                          </Link>
                        </p>
                        {d.sku ? (
                          <p className="admin-table__secondary">
                            <span aria-hidden>SKU: </span>
                            <code>{d.sku}</code>
                          </p>
                        ) : null}
                        <p className="admin-table__secondary">
                          {d.geometry.widthMm}×{d.geometry.depthMm} mm
                        </p>
                      </td>
                      <td>
                        <span className={variantBadgeClass(d.variant)}>
                          {VARIANT_LABEL[d.variant]}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            row.validationLabel === "ok"
                              ? "admin-badge admin-badge--active"
                              : "admin-badge admin-badge--warn"
                          }
                          data-testid={`admin-svg-validation-${d.slug}`}
                        >
                          {row.validationLabel === "ok"
                            ? "Valid"
                            : row.validationLabel === "invalid"
                              ? "Invalid"
                              : "Missing symbol"}
                        </span>
                      </td>
                      <td>
                        <span className={artifactBadgeClass(status.state)}>
                          {artifactLabel(status.state)}
                        </span>
                        <p className="admin-table__secondary">
                          {status.bytes > 0
                            ? formatBytes(status.bytes)
                            : "No bytes on disk"}
                          {status.publicUrl ? (
                            <>
                              {" · "}
                              <code>{status.publicUrl}</code>
                            </>
                          ) : null}
                        </p>
                      </td>
                      <td>
                        <span className={lifecycleBadgeClass(lifecycle)}>{lifecycle}</span>
                        {lifecycle !== "retired" ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--outline mt-2"
                            disabled={lifecycleBusySlug === d.slug}
                            onClick={() => void setLifecycle(d.slug, "retired")}
                          >
                            Retire
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn--outline mt-2"
                            disabled={lifecycleBusySlug === d.slug}
                            onClick={() => void setLifecycle(d.slug, "live")}
                          >
                            Restore
                          </button>
                        )}
                      </td>
                      <td>
                        <code className="text-muted" data-testid={`admin-svg-last-change-${d.slug}`}>
                          {row.lastChangeLabel}
                        </code>
                      </td>
                      <td>
                        <div className="flex justify-end">
                          <Link
                            href={`/admin/svg-editor/${d.slug}`}
                            className="admin-btn admin-btn--outline"
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
            </table>
          </div>
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
