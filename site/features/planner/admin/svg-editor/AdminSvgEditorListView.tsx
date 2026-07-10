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
 */

import Link from "next/link";
import { PencilSimple as Pencil, Plus } from "@phosphor-icons/react";

import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";

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
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "—";
  try {
    return new Date(value).toISOString().replace("T", " ").replace(/\..*$/, "");
  } catch {
    return String(value);
  }
}

export interface AdminSvgEditorListViewProps {
  readonly descriptors: ReadonlyArray<BlockDescriptor>;
  readonly refreshedAtLabel: string;
}

export function AdminSvgEditorListView({
  descriptors,
  refreshedAtLabel,
}: AdminSvgEditorListViewProps) {
  const counts = variantSlugCount(descriptors);
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
            Author Puck-managed SVG block descriptors. Permissions gate through{" "}
            <code>{"withAuth(['admin'])"}</code>; saves flow through Zod → atomic-rename JSON
            write → Phase 03 SVG pipeline → R2 PNG thumb.
          </p>
          <p className="admin-page__meta">
            Last loader pass: <code>{refreshedAtLabel}</code> · schemaVersion pinned at{" "}
            <code>2026-07-04.v2</code>
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/svg-editor/new" className="admin-btn admin-btn--primary">
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
              <p className="admin-table__secondary">{describeVariant(variant)}</p>
            </div>
          </article>
        ))}
      </section>

      {ordered.length === 0 ? (
        <div className="admin-empty" role="status">
          <p className="admin-table__primary">No block descriptors yet</p>
          <p className="admin-table__secondary">
            Author the first variant with New block. Slug input is a kebab regex pinned at
            the schema layer.
          </p>
          <div className="mt-4">
            <Link href="/admin/svg-editor/new" className="admin-btn admin-btn--primary">
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
                Persisted BlockDescriptor entries grouped by variant.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Slug</th>
                  <th scope="col">Variant</th>
                  <th scope="col">Source</th>
                  <th scope="col">Created</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((d) => (
                  <tr key={`${d.variant}:${d.slug}`}>
                    <td>
                      <p className="admin-table__primary">
                        <Link href={`/admin/svg-editor/${d.slug}`}>{d.slug}</Link>
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
                      <code className="text-muted">{timestampLabel(d.generatedAt)}</code>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSvgEditorListView;
