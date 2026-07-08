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
import { ArrowLeft, Sparkle as Sparkles } from "@phosphor-icons/react";

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

import { GlbExtruderPreview } from "./GlbExtruderPreview";
import { ModelViewerPreview } from "./ModelViewerPreview";
import { uploadAssetToSupabase } from "./uploadAsset";

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
  const [uploadedGlbUrl, setUploadedGlbUrl] = useState<string>("");
  const [mockGlbUrl, setMockGlbUrl] = useState<string>("");
  const [extractedDimensions, setExtractedDimensions] = useState<{x: number, y: number, z: number} | null>(null);

  const handleSvgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedSvgText(event.target?.result as string);
      reader.readAsText(file);
    }
  }, []);

  const handleGlbUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedGlbUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleGlbGenerated = useCallback(async (blob: Blob) => {
    // 1. Show temporary URL instantly
    const localUrl = URL.createObjectURL(blob);
    setMockGlbUrl(localUrl);

    // 2. Upload to Supabase in the background to get a permanent URL
    const permanentUrl = await uploadAssetToSupabase(blob, `${slug || "generated"}.glb`);
    if (permanentUrl) {
      setMockGlbUrl(permanentUrl); // Overwrite with permanent link
    }
  }, [slug]);

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

      {/* ZERO-DESIGNER ASSET HUB */}
      {descriptor.variant === "fixed" && (
        <section aria-label="Asset Hub" className="admin-page__section" style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", marginBottom: "24px" }}>
          <h2 className="admin-page__section-title">Zero-Designer Asset Hub</h2>
          
          <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
            <div style={{ flex: 1, padding: "16px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Workflow A: SVG to GLB Extruder</h3>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>Upload a 2D line drawing to instantly extrude a 3D model.</p>
              <input type="file" accept=".svg" onChange={handleSvgUpload} style={{ fontSize: "12px", marginBottom: "12px" }} />
              {uploadedSvgText && <GlbExtruderPreview svgString={uploadedSvgText} onGlbGenerated={handleGlbGenerated} />}
              {mockGlbUrl && (
                <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#ecfdf5", color: "#065f46", fontSize: "12px", borderRadius: "4px" }}>
                  <strong>Success!</strong> Mock GLB generated.<br/>
                  <em>Copy this to the Puck URL field:</em><br/>
                  <code style={{ userSelect: "all", wordBreak: "break-all" }}>{mockGlbUrl}</code>
                </div>
              )}
            </div>

            <div style={{ flex: 1, padding: "16px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Workflow B: GLB Auto-Footprint</h3>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>Upload a 3D model to automatically calculate its 2D floor footprint.</p>
              <input type="file" accept=".glb" onChange={handleGlbUpload} style={{ fontSize: "12px", marginBottom: "12px" }} />
              {uploadedGlbUrl && <ModelViewerPreview src={uploadedGlbUrl} onModelLoaded={setExtractedDimensions} />}
              {extractedDimensions && (
                <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#eff6ff", color: "#1e40af", fontSize: "12px", borderRadius: "4px" }}>
                  <strong>Bounds Extracted!</strong><br/>
                  Width: {Math.round(extractedDimensions.x)} mm<br/>
                  Depth: {Math.round(extractedDimensions.z)} mm<br/>
                  Height: {Math.round(extractedDimensions.y)} mm<br/>
                  <em>Update the Puck Geometry fields above.</em>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Full Puck editor mount replaces the JSON textarea + separate Render preview (1B P0). */}
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
