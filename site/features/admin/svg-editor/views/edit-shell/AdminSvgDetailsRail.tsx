"use client";

import dynamic from "next/dynamic";
import { CircleNotch as Loader2, Cube, WarningCircle } from "@phosphor-icons/react";

import { SVG_EDITOR_FIELDS } from "../../form/svgEditorFormModel";
import { SvgEditorForm } from "../../form/SvgEditorForm";
import type { SvgEditorFormState } from "../../form/svgEditorFormState";
import { DescriptorRevisionPanel } from "../../lifecycle/DescriptorRevisionPanel";

const GlbExtruderPreview = dynamic(
  () => import("../../publish/GlbExtruderPreview").then((m) => m.GlbExtruderPreview),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading
        extruder...
      </p>
    ),
  },
);

const ModelViewerPreview = dynamic(
  () => import("../../publish/ModelViewerPreview").then((m) => m.ModelViewerPreview),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading 3D
        preview...
      </p>
    ),
  },
);

interface AdminSvgDetailsRailProps {
  readonly slug: string;
  readonly form: SvgEditorFormState;
  readonly advancedOpen: boolean;
  readonly formIssues: ReadonlyArray<{ path: string; message: string }>;
  readonly canConvertToGlb: boolean;
  readonly glbSourceSvg: string | null;
  readonly glbUrl: string;
  readonly glbUploading: boolean;
  readonly glbUploadError: string | null;
  readonly onFormChange: (next: SvgEditorFormState) => void;
  readonly onStartGlbConversion: () => void;
  readonly onGlbGenerated: (blob: Blob) => Promise<void>;
}

export function AdminSvgDetailsRail({
  slug,
  form,
  advancedOpen,
  formIssues,
  canConvertToGlb,
  glbSourceSvg,
  glbUrl,
  glbUploading,
  glbUploadError,
  onFormChange,
  onStartGlbConversion,
  onGlbGenerated,
}: AdminSvgDetailsRailProps) {
  const issueCount = formIssues.length;

  return (
    <aside
      aria-label="Product details and history"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--details"
      data-testid="admin-svg-details-rail"
    >
      <div>
        <DescriptorRevisionPanel slug={slug} />
      </div>
      <details
        className="admin-panel admin-svg-engine-shell__panel admin-svg-engine-shell__advanced"
        open={advancedOpen}
      >
        <summary className="admin-panel__header">
          Product details
          {issueCount > 0 ? (
            <span className="admin-badge admin-badge--warn admin-badge--compact admin-svg-engine-shell__issue-count">
              {issueCount} {issueCount === 1 ? "issue" : "issues"}
            </span>
          ) : null}
        </summary>
        <div className="admin-panel__body">
          <p className="admin-page__meta">
            Identity, SKU, and catalog fields. Symbol geometry for publish comes from
            the visual studio and footprint controls, not these rows.
          </p>
          <SvgEditorForm
            fields={SVG_EDITOR_FIELDS}
            state={form}
            variant={form.variant}
            issues={formIssues}
            onChange={onFormChange}
          />
        </div>
      </details>

      <details className="admin-panel admin-svg-engine-shell__panel">
        <summary className="admin-panel__header">3D model (optional)</summary>
        <div className="admin-panel__body">
          {form.variant === "fixed" ? (
            <>
              <p className="admin-page__copy">
                Build a system-generated 3D model from the current draft symbol. Optional
                for most releases — 2D Planner symbol publish does not require it.
              </p>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={onStartGlbConversion}
                disabled={!canConvertToGlb}
              >
                <Cube size={14} aria-hidden />
                Convert draft to 3D
              </button>
              {!canConvertToGlb ? (
                <p className="admin-page__meta">
                  Generate a valid draft preview first, then convert.
                </p>
              ) : null}
              {glbSourceSvg ? (
                <GlbExtruderPreview
                  svgString={glbSourceSvg}
                  onGlbGenerated={onGlbGenerated}
                />
              ) : null}
              {glbUploading ? (
                <div
                  role="status"
                  className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
                  aria-busy="true"
                >
                  <Loader2 size={14} className="animate-spin shrink-0" aria-hidden />
                  Uploading generated 3D model…
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
              {glbUrl && !glbUrl.startsWith("blob:") ? (
                <div className="admin-page__section">
                  <ModelViewerPreview src={glbUrl} />
                </div>
              ) : null}
            </>
          ) : (
            <p className="admin-page__meta">
              3D generation is available for fixed-size products only.
            </p>
          )}
        </div>
      </details>
    </aside>
  );
}
