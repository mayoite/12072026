"use client";

/**
 * Phase 04 — Admin SVG Editor per-slug edit view.
 *
 * §04-ADMIN-02: route `site/app/admin/svg-editor/[id]/page.tsx` loads the
 * canonical descriptor by slug via {@link tryLoad} (Phase 02 loader) and
 * surfaces the variant's render component from {@link blockDescriptorToRenderProps}.
 *
 * Functionality for the initial Phase 04 release:
 *   - Display every persisted BlockDescriptor's field set read-only.
 *   - Provide a JSON editor for advanced edits (themeTokens / rovingFocus etc.).
 *   - Wire a `Save` button that POSTs to {@link POST_URL} with the current
 *     payload; the API path is gated by `withAuth(['admin'])` and persists
 *     through {@link persistBlockDescriptor}.
 *
 * No `any`, no `@ts-ignore`, no Mantine, no `eslint-disable`. Theme tokens
 * are remediated through the upstream `parseBlockDescriptor` so any hex
 * literal is rejected with HTTP 422 (§02-CAT-07).
 */

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

import type {
  BlockDescriptor,
  BlockDescriptorVariant,
} from "@/features/planner/open3d/catalog/svg/svgTypes";
import {
  blockDescriptorToRenderProps,
  puckComponentName,
} from "./puckBlockRegistry";

const POST_URL = "/api/admin/svg-editor";

interface FormState {
  readonly payloadText: string;
  readonly submitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
}

const INITIAL_FORM_STATE = {
  payloadText: "",
  submitting: false,
  errorMessage: null as string | null,
  successMessage: null as string | null,
} satisfies FormState;

function variantTitle(variant: BlockDescriptorVariant): string {
  switch (variant) {
    case "fixed":
      return "Fixed variant";
    case "configurable":
      return "Configurable variant";
    case "parametric":
      return "Parametric variant";
  }
}

function describeVariant(variant: BlockDescriptorVariant): string {
  switch (variant) {
    case "fixed":
      return "Locked dimensions; no parametric controls.";
    case "configurable":
      return "Discrete option set or bounded parametric adjustment.";
    case "parametric":
      return "Full parametric schema with explicit mounting points.";
  }
}

function buildFieldRows(
  descriptor: BlockDescriptor,
): ReadonlyArray<{ key: string; value: string }> {
  const rows: Array<{ key: string; value: string }> = [];
  rows.push({ key: "slug", value: descriptor.slug });
  if (descriptor.sku) rows.push({ key: "sku", value: descriptor.sku });
  rows.push({ key: "schemaVersion", value: descriptor.schemaVersion });
  rows.push({ key: "sourceProvenance", value: descriptor.sourceProvenance });
  if (descriptor.createdBy) rows.push({ key: "createdBy", value: descriptor.createdBy });
  rows.push({
    key: "geometry",
    value:
      `${descriptor.geometry.widthMm}×${descriptor.geometry.depthMm}×` +
      `${descriptor.geometry.heightMm} mm`,
  });
  rows.push({
    key: "viewBox",
    value:
      `${descriptor.viewBox.x},${descriptor.viewBox.y} ` +
      `${descriptor.viewBox.width}×${descriptor.viewBox.height}`,
  });
  rows.push({ key: "mounting", value: descriptor.mounting.join(" │ ") });
  if (descriptor.mountingPoints && descriptor.mountingPoints.length > 0) {
    rows.push({
      key: "mountingPoints",
      value: descriptor.mountingPoints
        .map((mp) => `${mp.plane} (${mp.offset.x},${mp.offset.y})`)
        .join(" │ "),
    });
  }
  rows.push({
    key: "themeTokens",
    value: `${Object.keys(descriptor.themeTokens).length} semantic references`,
  });
  rows.push({ key: "rovingFocus", value: `${descriptor.rovingFocus.length} entries` });
  rows.push({
    key: "liveAnnouncementCategories",
    value: descriptor.liveAnnouncementCategories.join(" │ "),
  });
  return rows;
}

function formatDescriptorForEditor(descriptor: BlockDescriptor): string {
  return JSON.stringify(descriptor, null, 2);
}

function buildErrorFromResponse(
  status: number,
  body: { error?: { code?: string; message?: string; details?: Record<string, unknown> } } | null,
): string {
  if (body?.error?.message) {
    if (body.error.code) return `${body.error.code}: ${body.error.message}`;
    return body.error.message;
  }
  return `Request failed (HTTP ${status}).`;
}

export interface AdminSvgEditorEditViewProps {
  readonly slug: string;
  readonly descriptor: BlockDescriptor;
  readonly updatedAtLabel: string;
}

export function AdminSvgEditorEditView({
  slug,
  descriptor,
  updatedAtLabel,
}: AdminSvgEditorEditViewProps) {
  const router = useRouter();
  const renderProps = useMemo(() => blockDescriptorToRenderProps(descriptor), [descriptor]);
  const [formState, setFormState] = useState<FormState>(() => ({
    ...INITIAL_FORM_STATE,
    payloadText: formatDescriptorForEditor(descriptor),
  }));

  const handleChange = useCallback((next: string) => {
    setFormState((previous) => ({
      ...previous,
      payloadText: next,
      errorMessage: null,
      successMessage: null,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setFormState((previous) => ({
      ...previous,
      submitting: true,
      errorMessage: null,
      successMessage: null,
    }));

    let payload: unknown;
    try {
      payload = JSON.parse(formState.payloadText);
    } catch (parseError) {
      const message =
        parseError instanceof Error ? parseError.message : String(parseError);
      setFormState((previous) => ({
        ...previous,
        submitting: false,
        errorMessage: `Editor payload is not valid JSON: ${message}`,
      }));
      return;
    }

    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as
        | { success?: boolean; descriptor?: BlockDescriptor; error?: { code?: string; message?: string; details?: Record<string, unknown> } }
        | null;
      if (!response.ok) {
        setFormState((previous) => ({
          ...previous,
          submitting: false,
          errorMessage: buildErrorFromResponse(response.status, body),
        }));
        return;
      }
      setFormState((previous) => ({
        ...previous,
        submitting: false,
        successMessage: `Saved descriptor “${body?.descriptor?.slug ?? slug}” at ${updatedAtLabel}.`,
      }));
      router.refresh();
    } catch (networkError) {
      const message = networkError instanceof Error ? networkError.message : String(networkError);
      setFormState((previous) => ({
        ...previous,
        submitting: false,
        errorMessage: `Network error: ${message}`,
      }));
    }
  }, [formState.payloadText, router, slug, updatedAtLabel]);

  const rows = useMemo(() => buildFieldRows(descriptor), [descriptor]);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">
            <Link href="/admin/svg-editor" className="admin-page__back-link">
              <ArrowLeft size={12} aria-hidden /> Catalog assets
            </Link>
          </p>
          <h1 className="admin-page__title">
            <code>{slug}</code>
          </h1>
          <p className="admin-page__copy">{describeVariant(descriptor.variant)}</p>
          <p className="admin-page__meta">
            schemaVersion <code>{descriptor.schemaVersion}</code> · checksum{" "}
            <code className="admin-page__checksum">{descriptor.checksum.slice(0, 16)}…</code>
          </p>
        </div>
        <div className="admin-page__actions">
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm"
            onClick={() => void handleSave()}
            disabled={formState.submitting}
          >
            <Save size={14} aria-hidden />
            {formState.submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <section
        aria-label="Variant summary"
        className={`admin-page__summary admin-page__summary-card admin-page__summary-card--${descriptor.variant}`}
      >
        <header>
          <p className="admin-page__summary-card-title">
            <Sparkles size={14} aria-hidden /> {variantTitle(descriptor.variant)}
          </p>
          <p className="admin-page__summary-card-value">
            Puck component: <code>{puckComponentName(descriptor.variant)}</code>
          </p>
        </header>
        {renderProps.props && Object.keys(renderProps.props).length > 0 ? (
          <p className="admin-page__summary-card-copy">
            current render props:{" "}
            <code>
              {Object.entries(renderProps.props)
                .map(([k, v]) => `${k}=${String(v)}`)
                .join(" ")}
            </code>
          </p>
        ) : null}
      </section>

      {formState.errorMessage ? (
        <div role="alert" className="admin-alert admin-alert--error">
          {formState.errorMessage}
        </div>
      ) : null}
      {formState.successMessage ? (
        <div role="status" className="admin-alert admin-alert--success">
          {formState.successMessage}
        </div>
      ) : null}

      <section aria-label="Field cartography" className="admin-page__section">
        <h2 className="admin-page__section-title">Field cartography</h2>
        <dl className="admin-page__field-list">
          {rows.map((row) => (
            <div key={row.key} className="admin-page__field-row">
              <dt>
                <code>{row.key}</code>
              </dt>
              <dd>
                <code>{row.value}</code>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Advanced JSON editor" className="admin-page__section">
        <h2 className="admin-page__section-title">Advanced JSON editor</h2>
        <p className="admin-page__copy">
          Edit the BlockDescriptor JSON directly. Saving POSTs to{" "}
          <code>{POST_URL}</code> (gated by <code>withAuth(['admin'])</code>);
          the Zod schema rejects hex theme tokens, mismatched UUIDs, and
          unsupported variant tags with HTTP 422.
        </p>
        <textarea
          className="admin-page__json-editor"
          value={formState.payloadText}
          onChange={(event) => handleChange(event.target.value)}
          spellCheck={false}
          rows={20}
          aria-label="BlockDescriptor JSON"
        />
        <div className="admin-page__actions">
          <button
            type="button"
            className="btn-outline inline-flex items-center gap-2 px-3 py-2 text-sm"
            onClick={() => handleChange(formatDescriptorForEditor(descriptor))}
            disabled={formState.submitting}
          >
            Reset to loaded JSON
          </button>
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm"
            onClick={() => void handleSave()}
            disabled={formState.submitting}
          >
            <Save size={14} aria-hidden /> Save changes
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminSvgEditorEditView;
