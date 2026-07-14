/**
 * ADM-BULK-01 — previewed bulk lifecycle actions (retire / restore / validate).
 * Pure planning; apply is delegated to setCatalogLifecycle by the caller.
 */

import type { CatalogLifecycleState } from "./catalogLifecycle.shared";
import {
  nextLifecycleAfterAction,
  type RetirementAction,
} from "./catalogRetirement";

export type BulkLifecycleTarget = {
  readonly slug: string;
  readonly lifecycle: CatalogLifecycleState;
};

export type BulkLifecyclePreviewRow = {
  readonly slug: string;
  readonly from: CatalogLifecycleState;
  readonly to: CatalogLifecycleState | null;
  readonly ok: boolean;
  readonly message: string;
};

export type BulkLifecyclePreview = {
  readonly action: RetirementAction;
  readonly rows: readonly BulkLifecyclePreviewRow[];
  readonly canApply: boolean;
  readonly summary: string;
};

export function previewBulkLifecycle(
  targets: readonly BulkLifecycleTarget[],
  action: RetirementAction,
): BulkLifecyclePreview {
  const rows: BulkLifecyclePreviewRow[] = targets.map((t) => {
    const result = nextLifecycleAfterAction(t.lifecycle, action);
    if (!result.ok) {
      return {
        slug: t.slug,
        from: t.lifecycle,
        to: null,
        ok: false,
        message: result.error,
      };
    }
    return {
      slug: t.slug,
      from: t.lifecycle,
      to: result.next,
      ok: true,
      message: `${t.lifecycle} → ${result.next}`,
    };
  });
  const failures = rows.filter((r) => !r.ok);
  const canApply = rows.length > 0 && failures.length === 0;
  const summary = canApply
    ? `Preview: ${action} ${rows.length} product(s). All rows valid.`
    : `Blocked: ${failures.length} of ${rows.length} row(s) cannot ${action}.`;
  return { action, rows, canApply, summary };
}

/**
 * Apply only after preview.canApply. Returns applied slugs or errors.
 * `applyOne` is injectable for tests (no real manifest I/O required).
 */
export function applyBulkLifecycle(
  preview: BulkLifecyclePreview,
  applyOne: (slug: string, next: CatalogLifecycleState) => void,
): { readonly ok: true; readonly applied: readonly string[] } | {
  readonly ok: false;
  readonly error: string;
} {
  if (!preview.canApply) {
    return { ok: false, error: preview.summary };
  }
  const applied: string[] = [];
  try {
    for (const row of preview.rows) {
      if (!row.to) throw new Error(`Missing target state for ${row.slug}`);
      applyOne(row.slug, row.to);
      applied.push(row.slug);
    }
    return { ok: true, applied };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return { ok: false, error: `Bulk lifecycle apply failed: ${message}` };
  }
}
