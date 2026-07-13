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
import { useCallback, useState } from "react";
import { PencilSimple as Pencil, Plus } from "@phosphor-icons/react";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import type { CatalogLifecycleManifest, CatalogLifecycleState } from "./catalogLifecycle.shared";
import { resolveCatalogLifecycle } from "./catalogLifecycle.shared";
import { AdminSvgBulkImportPanel } from "./AdminSvgBulkImportPanel";
import type { SvgArtifactStatus } from "./svgArtifactStatus.server";
import { PublishedSvgPreview } from "./PublishedSvgPreview";

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
  const ordered = [...descriptors].sort((a, b) => {
    const av = a.variant.localeCompare(b.variant);
    return av !== 0 ? av : a.slug.localeCompare(b.slug);
  });

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog assets</p>
          <h1 className="admin-page__title">SVG block editor</h1>
          <p className="admin-page__copy">
            Author SVG block descriptors through a schema-driven form.
            Publishing requires a real admin session. The local auth bypass is
            development-only. Saves flow through Zod → atomic-rename JSON write
            → SVG pipeline → public catalog SVG.
          </p>
          <p className="admin-page__meta">
            Last loader pass: <code>{refreshedAtLabel}</code> · schemaVersion
            pinned at <code>2026-07-04.v2</code>
          </p>
          <p
            className="admin-page__meta"
            role="status"
            data-testid="artifact-health"
          >
            Artifact health: <strong>{publishedCount}</strong> published ·{" "}
            <strong>{missingCount}</strong> missing ·{" "}
            <strong>{invalidCount}</strong> invalid · of{" "}
            <strong>{descriptors.length}</strong> descriptors.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link
            href="/admin/svg-editor/new"
            className="admin-btn admin-btn--primary"
          >
            <Plus size={14} aria-hidden />
            New block
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

      <div className="mb-6">
        <AdminSvgBulkImportPanel />
      </div>

      {ordered.length === 0 ? (
        <div className="admin-empty" role="status">
          <p className="admin-table__primary">No block descriptors yet</p>
          <p className="admin-table__secondary">
            Author the first variant with New block. Slug input is a kebab regex
            pinned at the schema layer.
          </p>
          <div className="mt-4">
            <Link
              href="/admin/svg-editor/new"
              className="admin-btn admin-btn--primary"
            >
              <Plus size={14} aria-hidden />
              New block
            </Link>
          </div>
        </div>
      ) : (
        <div className="admin-panel">
          <div className="admin-panel__header">
            {ordered.length} descriptor{ordered.length === 1 ? "" : "s"}
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">
                Persisted BlockDescriptor entries grouped by variant, with
                published SVG preview and artifact state.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Preview</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Variant</th>
                  <th scope="col">Source</th>
                  <th scope="col">Artifact</th>
                  <th scope="col">Lifecycle</th>
                  <th scope="col">Created</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((d) => {
                  const status = artifactStatuses[d.slug] ?? missingStatus();
                  const lifecycle = resolveCatalogLifecycle(
                    d.slug,
                    status.state,
                    lifecycleManifest,
                  );
                  return (
                    <tr
                      key={`${d.variant}:${d.slug}`}
                      data-slug={d.slug}
                      data-artifact-state={status.state}
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
                      </td>
                      <td>
                        <span className={variantBadgeClass(d.variant)}>
                          {VARIANT_LABEL[d.variant]}
                        </span>
                      </td>
                      <td className="text-muted">{d.sourceProvenance}</td>
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
                        <code className="text-muted">
                          {timestampLabel(d.generatedAt)}
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
        </div>
      )}
    </div>
  );
}

export default AdminSvgEditorListView;
