"use client";

/**
 * Phase 04 — Admin SVG Editor list view (server-rendered shell + client hydration).
 *
 * §04-ADMIN-01: list view of registered descriptors + "new block" CTA.
 * The list is server-loaded via {@link listBlockDescriptors}, then passed
 * into this client component for interactive navigation to per-slug routes.
 */

import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";

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
            <code>withAuth(['admin'])</code>; saves flow through Zod →
            atomic-rename JSON write → Phase 03 SVG pipeline → R2 PNG thumb.
          </p>
          <p className="admin-page__meta">
            Last loader pass: <code>{refreshedAtLabel}</code> · schemaVersion pinned at{" "}
            <code>2026-07-04.v2</code>
          </p>
        </div>
        <div className="admin-page__actions">
          <Link
            href="/admin/svg-editor/new"
            className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm"
          >
            <Plus size={14} />
            New block
          </Link>
        </div>
      </header>

      <section
        aria-label="Variant tag balances"
        className="admin-page__summary"
      >
        {VARIANT_ORDER.map((variant) => (
          <article
            key={variant}
            className={`admin-page__summary-card admin-page__summary-card--${variant}`}
            data-variant={variant}
          >
            <h2 className="admin-page__summary-card-title">
              {VARIANT_LABEL[variant]}
            </h2>
            <p className="admin-page__summary-card-value">{counts[variant]}</p>
            <p className="admin-page__summary-card-copy">{describeVariant(variant)}</p>
          </article>
        ))}
      </section>

      {ordered.length === 0 ? (
        <div className="admin-empty">
          No block descriptors persisted yet. Use “New block” to author the{" "}
          first variant. Slug input is a kebab regex pinned at the schema layer.
        </div>
      ) : (
        <div className="admin-table">
          <table className="admin-table__element">
            <caption className="sr-only">
              Persisted BlockDescriptor entries grouped by variant.
            </caption>
            <thead>
              <tr>
                <th scope="col">Slug</th>
                <th scope="col">Variant</th>
                <th scope="col">Source</th>
                <th scope="col">Created</th>
                <th scope="col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {ordered.map((d) => (
                <tr key={`${d.variant}:${d.slug}`}>
                  <td>
                    <Link href={`/admin/svg-editor/${d.slug}`} className="admin-table__slug">
                      {d.slug}
                    </Link>
                    {d.sku ? (
                      <p className="admin-table__sku">
                        <span aria-hidden>SKU: </span>
                        <code>{d.sku}</code>
                      </p>
                    ) : null}
                  </td>
                  <td>
                    <span className={`admin-pill admin-pill--${d.variant}`}>
                      {VARIANT_LABEL[d.variant]}
                    </span>
                  </td>
                  <td>{d.sourceProvenance}</td>
                  <td>
                    <code>{timestampLabel(d.generatedAt)}</code>
                  </td>
                  <td>
                    <Link
                      href={`/admin/svg-editor/${d.slug}`}
                      className="btn-outline inline-flex items-center gap-2 px-3 py-1.5 text-xs"
                    >
                      <RefreshCw size={12} aria-hidden />
                      Edit
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

export default AdminSvgEditorListView;
