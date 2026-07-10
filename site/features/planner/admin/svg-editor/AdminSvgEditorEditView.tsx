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
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  CircleNotch as Loader2,
  Sparkle as Sparkles,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

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
import { safeThemeTokens } from "./themeTokens";
import { Puck } from "@puckeditor/core";
// no-external.css: same Puck UI without @import https://rsms.me/inter (CSP style-src blocks it)
import "@puckeditor/core/no-external.css";
import type { PuckDataShape } from "./puckBlockRegistry";
import { uploadAssetToSupabase } from "./uploadAsset";

// Note: direct persist/runner now via server action passed from RSC page (onPublish calls them).
// Legacy POST kept for compat in alerts only; 1B prefers the action path.
const POST_URL = "/api/admin/svg-editor";

/** Browser-only 3D islands — static import of model-viewer/three breaks RSC SSR. */
const GlbExtruderPreview = dynamic(
  () =>
    import("./GlbExtruderPreview").then((m) => m.GlbExtruderPreview),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading extruder…
      </p>
    ),
  },
);
const ModelViewerPreview = dynamic(
  () =>
    import("./ModelViewerPreview").then((m) => m.ModelViewerPreview),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading 3D preview…
      </p>
    ),
  },
);

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

function nowStampLabel(): string {
  return new Date().toISOString().replace("T", " ").replace(/\..*$/, " UTC");
}

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
  // Null-safe: partial / new stubs may omit optional a11y + token maps (TDD-1).
  const themeTokens = safeThemeTokens(descriptor.themeTokens);
  rows.push({
    key: "themeTokens",
    value: `${Object.keys(themeTokens).length} semantic references`,
  });
  rows.push({
    key: "rovingFocus",
    value: `${(descriptor.rovingFocus ?? []).length} entries`,
  });
  rows.push({
    key: "liveAnnouncementCategories",
    value: (descriptor.liveAnnouncementCategories ?? []).join(" │ ") || "(none)",
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

  const [uploadedSvgText, setUploadedSvgText] = useState<string>("");
  const [mockGlbUrl, setMockGlbUrl] = useState<string>("");
  const [glbUploading, setGlbUploading] = useState(false);
  const [glbUploadError, setGlbUploadError] = useState<string | null>(null);

  const handleSvgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedSvgText(event.target?.result as string);
      reader.readAsText(file);
    }
  }, []);

  const handleGlbGenerated = useCallback(async (blob: Blob) => {
    // 1. Show temporary URL instantly (blob: allowed by glbAssetPolicy)
    const localUrl = URL.createObjectURL(blob);
    setMockGlbUrl(localUrl);
    setGlbUploadError(null);
    setGlbUploading(true);

    try {
      // 2. Upload to generated/ path only — designer static GLB path removed
      const permanentUrl = await uploadAssetToSupabase(blob, `${slug || "generated"}.glb`);
      if (permanentUrl) {
        setMockGlbUrl(permanentUrl);
      } else {
        setGlbUploadError("Upload returned no URL — blob preview still available locally.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setGlbUploadError(`GLB upload failed: ${message}`);
    } finally {
      setGlbUploading(false);
    }
  }, [slug]);

  // Simplified state: Puck manages draft/compose state + live preview.
  // Only track submit + validation err/success for admin UX (failure + recovery).
  const [formState, setFormState] = useState<FormState>(() => ({
    ...INITIAL_FORM_STATE,
    payloadText: "", // legacy json unused after Puck replace; kept for type compat in min change
  }));

  const clearFeedback = useCallback(() => {
    setFormState((previous) => ({
      ...previous,
      errorMessage: null,
      successMessage: null,
    }));
  }, []);

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
            successMessage: `Published “${slug}” via Puck · ${nowStampLabel()}. Pipeline + persist completed.`,
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
          successMessage: `Saved descriptor “${body?.descriptor?.slug ?? slug}” · ${nowStampLabel()}.`,
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
    [onPublishAction, descriptor, router, slug],
  );

  const rows = useMemo(() => buildFieldRows(descriptor), [descriptor]);
  const checksumShort =
    typeof descriptor.checksum === "string" && descriptor.checksum.length > 16
      ? `${descriptor.checksum.slice(0, 16)}…`
      : (descriptor.checksum ?? "—");

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog assets · SVG block editor</p>
          <h1 className="admin-page__title">
            <code>{slug}</code>
          </h1>
          <p className="admin-page__copy">{describeVariant(descriptor.variant)}</p>
          <p className="admin-page__meta">
            <span className="admin-badge">{variantTitle(descriptor.variant)}</span>
            {descriptor.sku ? (
              <>
                {" "}
                · SKU <code>{descriptor.sku}</code>
              </>
            ) : null}
            {" "}
            · schema <code>{descriptor.schemaVersion}</code>
            {" "}
            · checksum <code className="admin-page__checksum">{checksumShort}</code>
            {" "}
            · loaded <code>{updatedAtLabel}</code>
            {descriptor.sourceProvenance ? (
              <>
                {" "}
                · source <code>{descriptor.sourceProvenance}</code>
              </>
            ) : null}
          </p>
        </div>
        {/* No header Save: Puck editor owns publish (REC-01 minimize + contextual). Header is identity + nav only. */}
        <div className="admin-page__actions">
          <Link href="/admin/svg-editor" className="admin-btn admin-btn--outline">
            <ArrowLeft size={14} aria-hidden />
            Back to list
          </Link>
        </div>
      </header>

      <section aria-label="Variant summary" className="admin-page__summary">
        <article
          className={`admin-page__summary-card admin-page__summary-card--${descriptor.variant} admin-panel`}
          data-variant={descriptor.variant}
        >
          <div className="admin-panel__header">
            <Sparkles size={14} aria-hidden /> {variantTitle(descriptor.variant)}
          </div>
          <div className="admin-page__section" style={{ padding: "0.75rem 1rem" }}>
            <p className="admin-page__summary-card-value">
              Puck component: <code>{puckComponentName(descriptor.variant)}</code>
            </p>
            {renderProps.props && Object.keys(renderProps.props).length > 0 ? (
              <p className="admin-page__summary-card-copy admin-page__meta">
                Current render props:{" "}
                <code>
                  {Object.entries(renderProps.props)
                    .map(([k, v]) => `${k}=${String(v)}`)
                    .join(" ")}
                </code>
              </p>
            ) : (
              <p className="admin-page__meta">No extra render props on this descriptor.</p>
            )}
          </div>
        </article>
      </section>

      <div aria-live="polite" aria-atomic="true">
        {formState.submitting ? (
          <div
            role="status"
            className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
            aria-busy="true"
          >
            <Loader2 size={16} className="animate-spin shrink-0" aria-hidden />
            <span>
              Publishing <code>{slug}</code>… Persist + SVG pipeline in progress. Do not close this tab.
            </span>
          </div>
        ) : null}
        {formState.errorMessage ? (
          <div
            role="alert"
            className="admin-alert admin-alert--error flex flex-wrap items-center gap-3"
          >
            <WarningCircle size={16} className="shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">{formState.errorMessage}</span>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={clearFeedback}
              aria-label="Dismiss error"
            >
              <X size={14} aria-hidden />
              Dismiss
            </button>
          </div>
        ) : null}
        {formState.successMessage ? (
          <div
            role="status"
            className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
          >
            <CheckCircle size={16} className="shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">{formState.successMessage}</span>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={clearFeedback}
              aria-label="Dismiss success message"
            >
              <X size={14} aria-hidden />
              Dismiss
            </button>
          </div>
        ) : null}
      </div>

      <section aria-label="Field cartography" className="admin-page__section admin-panel">
        <details>
          <summary className="admin-page__section-title admin-panel__header">
            Field cartography (minimize)
          </summary>
          <dl className="admin-page__field-list" style={{ padding: "0.75rem 1rem" }}>
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

      {/* System-generated 3D only — designer static GLB upload removed */}
      {descriptor.variant === "fixed" ? (
        <section
          aria-label="System-generated 3D from SVG"
          className="admin-page__section admin-panel"
        >
          <div className="admin-panel__header">SVG → generated GLB</div>
          <div style={{ padding: "0.75rem 1rem" }}>
            <p className="admin-page__copy">
              Designer static GLB is not a product path. Extrude SVG to generate a GLB under{" "}
              <code>catalog-assets/generated/</code>, or use modular/parametric meshes.
            </p>
            <div className="admin-field" style={{ marginTop: "0.75rem" }}>
              <label className="admin-field__label" htmlFor="admin-svg-upload">
                Source SVG
              </label>
              <input
                id="admin-svg-upload"
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleSvgUpload}
                className="admin-field__input"
              />
            </div>
            {uploadedSvgText ? (
              <GlbExtruderPreview
                svgString={uploadedSvgText}
                onGlbGenerated={handleGlbGenerated}
              />
            ) : (
              <p className="admin-page__meta">Upload an SVG to open the extruder preview.</p>
            )}
            {glbUploading ? (
              <div
                role="status"
                className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
                aria-busy="true"
              >
                <Loader2 size={14} className="animate-spin shrink-0" aria-hidden />
                Uploading generated GLB…
              </div>
            ) : null}
            {glbUploadError ? (
              <div
                role="alert"
                className="admin-alert admin-alert--warn flex flex-wrap items-center gap-3"
              >
                <WarningCircle size={14} className="shrink-0" aria-hidden />
                <span>{glbUploadError}</span>
              </div>
            ) : null}
            {mockGlbUrl ? (
              <div className="admin-page__section">
                <p className="admin-page__meta">
                  <strong>Generated GLB URL</strong> (system only — paste into Generated GLB field if needed)
                </p>
                <code
                  className="admin-page__checksum"
                  style={{ userSelect: "all", wordBreak: "break-all" }}
                >
                  {mockGlbUrl}
                </code>
                {mockGlbUrl.startsWith("blob:") ? (
                  <p className="admin-page__meta">Local blob URL — permanent path appears after upload.</p>
                ) : (
                  <div style={{ marginTop: "0.5rem" }}>
                    <ModelViewerPreview src={mockGlbUrl} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Full Puck editor mount replaces the JSON textarea + separate Render preview (1B P0). */}
      <section aria-label="Puck block editor" className="admin-page__section">
        <div className="admin-panel">
          <div className="admin-panel__header">
            Block editor (Puck) · use the editor’s Publish control (header has no separate Save)
          </div>
          <div className="admin-puck-editor">
            <Puck
              config={puckConfig}
              data={editorData}
              onPublish={handlePublish}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminSvgEditorEditView;
