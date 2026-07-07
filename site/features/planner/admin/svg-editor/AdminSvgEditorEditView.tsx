"use client";

/**
 * Phase 04 — Admin SVG Editor per-slug edit view (now full Puck mount for 1B).
 *
 * §04-ADMIN-02 + 1B P0: mounts <Puck config={puckConfig} data={editorData} onPublish={...} />
 * for visual compose/draft/preview using registry fields. onPublish calls (via server action)
 * persistBlockDescriptor + runSvgPipeline. Replaces JSON textarea + separate Render preview only.
 * Supports validation failure (422 etc) + recovery UX via alerts + Puck live state.
 *
 * GS: BP-04 (Puck+Ark+RAC only, no Radix), BP-05 (≤1 explicit Render/route; Puck editor ok),
 * REC-01 (Figma minimize-UI on Puck panels), REC-05 (json-render inactive), anti-copy
 * (semantic tokens from site/app/css/ only; no hex in tsx; no donor trade-dress).
 * 5-product refs (Planner5D cat, Figma thin/contextual).
 */

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import type {
  BlockDescriptor,
  BlockDescriptorVariant,
} from "@/features/planner/open3d/catalog/svg/svgTypes";
import {
  blockDescriptorToRenderProps,
  puckComponentName,
  getPuckEditorData,
  puckEditorDataToDescriptorInput,
  puckConfig,
} from "./puckBlockRegistry";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import type { PuckDataShape } from "./puckBlockRegistry";

// Note: direct persist/runner now via server action passed from RSC page (onPublish calls them).
// Legacy POST kept for compat in alerts only; 1B prefers the action path.
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
  /** Server action (or async fn) wired by page RSC so onPublish can call persistBlockDescriptor + runSvgPipeline directly. */
  readonly onPublishAction?: (data: PuckDataShape) => Promise<void | { success?: boolean; error?: string }>;
}

export function AdminSvgEditorEditView({
  slug,
  descriptor,
  updatedAtLabel,
  onPublishAction,
}: AdminSvgEditorEditViewProps) {
  const router = useRouter();
  const renderProps = useMemo(() => blockDescriptorToRenderProps(descriptor), [descriptor]);
  const editorData = useMemo(() => getPuckEditorData(descriptor), [descriptor]);

  // Simplified state: Puck manages draft/compose state + live preview.
  // Only track submit + validation err/success for admin UX (failure + recovery).
  const [formState, setFormState] = useState<FormState>(() => ({
    ...INITIAL_FORM_STATE,
    payloadText: "", // legacy json unused after Puck replace; kept for type compat in min change
  }));

  const handlePublish = useCallback(
    async (data: PuckDataShape) => {
      setFormState((previous) => ({
        ...previous,
        submitting: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        if (onPublishAction) {
          // Preferred 1B path: server action calls persistBlockDescriptor + runSvgPipeline directly.
          const result = await onPublishAction(data);
          if (result && (result as unknown as { error?: string }).error) {
            setFormState((previous) => ({
              ...previous,
              submitting: false,
              errorMessage: String((result as unknown as { error?: string }).error),
            }));
            return;
          }
          setFormState((previous) => ({
            ...previous,
            submitting: false,
            successMessage: `Published via Puck “${slug}” at ${updatedAtLabel}.`,
          }));
          router.refresh();
          return;
        }

        // Fallback (pre-1B or tests): reconstruct + POST (still exercises api persist+runner)
        const payload = puckEditorDataToDescriptorInput(descriptor, data);
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
    },
    [onPublishAction, descriptor, router, slug, updatedAtLabel],
  );

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
        {/* No header Save: Puck editor owns publish (REC-01 minimize + contextual). Header is identity only. */}
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
        <details>
          <summary className="admin-page__section-title">Field cartography (minimize)</summary>
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
        </details>
      </section>

      {/* Full Puck editor mount replaces the JSON textarea + separate Render preview (1B P0).
         Puck uses registry puckConfig (fields + renders), editorData for full editable props.
         onPublish wires to persist + pipeline via action (or fallback). Live preview in Puck canvas.
         Validation failures surface in alerts for recovery (edit in place, re-publish).
         GS: BP-04, BP-05, REC-01 (Figma minimize-UI: thin/contextual/no extra chrome in Puck panels), anti-copy (semantic only). */}
      <section aria-label="Puck block editor" className="admin-page__section">
        <h2 className="admin-page__section-title">Block editor (Puck)</h2>
        <div className="admin-puck-editor">
          <Puck
            config={puckConfig}
            data={editorData}
            onPublish={handlePublish}
          />
        </div>
      </section>
    </div>
  );
}

export default AdminSvgEditorEditView;
