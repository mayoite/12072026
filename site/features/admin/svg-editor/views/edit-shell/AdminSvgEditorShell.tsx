"use client";

import dynamic from "next/dynamic";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

import {
  AUTHORING_WIDTH_PX,
  STAGE_GRID_COLUMNS,
  STAGE_MIN_FRACTION,
  stageMeetsMinimumAt1280,
} from "../../contracts/stageLayoutContract";
import { AdminSvgDetailsRail } from "./AdminSvgDetailsRail";
import { AdminSvgEditorFeedbackRegion } from "./AdminSvgEditorFeedbackRegion";
import { AdminSvgEditorTopBar } from "./AdminSvgEditorTopBar";
import { AdminSvgPreviewRail } from "./AdminSvgPreviewRail";
import { AdminSvgStudioSidebar } from "./AdminSvgStudioSidebar";
import { seedFootprintExcalidrawElements } from "../../editor/seedFootprintExcalidrawElements";
import { countActiveExcalidrawElements } from "../../editor/excalidrawDocumentGuards";
import type { AdminSvgEditorShellProps } from "./types";

const ExcalidrawCanvas = dynamic(() => import("../../editor/ExcalidrawClient"), {
  ssr: false,
  loading: () => (
    <p className="admin-page__meta" role="status">
      <Loader2 size={14} className="animate-spin" aria-hidden /> Loading visual
      studio…
    </p>
  ),
});

export function AdminSvgEditorShell({
  slug,
  updatedAtLabel,
  form,
  formDirty,
  formIssues,
  coreFieldIssuesCount,
  preview,
  previewPending,
  feedback,
  authoringLifecycle,
  lifecycle,
  artifactStatus,
  publishImpactLabel,
  approving,
  canPublish,
  canConvertToGlb,
  glbSourceSvg,
  glbUrl,
  glbUploading,
  glbUploadError,
  stageMeta,
  studioResetKey,
  plannerVerifyHref,
  publishArtifactHref,
  onFormChange,
  onDismissFeedback,
  onResetToPublished,
  onApproveForBuyers,
  onPublish,
  onExportAction,
  onStartGlbConversion,
  onGlbGenerated,
  onDocument,
  onError,
}: AdminSvgEditorShellProps) {
  const initialExcalidrawElements =
    countActiveExcalidrawElements(form.excalidrawElements) > 0
      ? form.excalidrawElements
      : seedFootprintExcalidrawElements(form.geometry);

  return (
    <div
      className="admin-page admin-page--svg-engine admin-svg-editor-workspace"
      data-admin-shell="edit"
      data-testid="admin-svg-edit-shell"
    >
      <AdminSvgEditorTopBar
        slug={form.slug.trim() || slug}
        updatedAtLabel={updatedAtLabel}
        sku={form.sku.trim()}
        authoringLifecycle={authoringLifecycle}
        lifecycle={lifecycle}
        artifactState={artifactStatus.state}
        approving={approving}
        submitting={feedback.submitting}
        formDirty={formDirty}
        canPublish={canPublish}
        onReset={onResetToPublished}
        onApprove={onApproveForBuyers}
        onPublish={onPublish}
        onExportAction={onExportAction}
      />
      <p
        id="admin-svg-publication-impact"
        className="sr-only"
        data-testid="admin-svg-publication-impact"
      >
        {publishImpactLabel}
      </p>

      <AdminSvgEditorFeedbackRegion
        feedback={feedback}
        slug={slug}
        plannerVerifyHref={plannerVerifyHref}
        publishArtifactHref={publishArtifactHref}
        onDismiss={onDismissFeedback}
      />

      <div
        className="admin-svg-engine-shell__status-band"
        data-testid="admin-svg-studio-status"
        aria-label="Studio draft status"
      >
        <span data-testid="admin-svg-studio-status-draft">{stageMeta.draft}</span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span data-testid="admin-svg-studio-status-validation">
          {stageMeta.validation}
        </span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span
          className="admin-svg-engine-shell__status-detail"
          data-testid="admin-svg-studio-status-footprint"
        >
          {stageMeta.footprint}
        </span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span
          className="admin-svg-engine-shell__status-detail"
          data-testid="admin-svg-studio-status-revision"
        >
          {stageMeta.revision}
        </span>
        {canPublish ? (
          <span className="admin-badge admin-badge--active admin-badge--compact admin-svg-engine-shell__status-ready">
            Ready to publish
          </span>
        ) : (
          <span className="admin-badge admin-badge--warn admin-badge--compact admin-svg-engine-shell__status-ready">
            Publish blocked
          </span>
        )}
      </div>

      <div
        className="admin-svg-engine-shell"
        data-testid="admin-svg-engine-shell"
        data-studio-node-count={form.sceneParts?.length ?? 0}
        data-stage-layout="rail-center-rail"
        data-stage-grid-columns={STAGE_GRID_COLUMNS}
        data-authoring-width-px={AUTHORING_WIDTH_PX}
        data-stage-min-fraction={STAGE_MIN_FRACTION}
        data-stage-meets-min-at-1280={stageMeetsMinimumAt1280() ? "true" : "false"}
      >
        <AdminSvgPreviewRail
          slug={slug}
          preview={preview}
          previewPending={previewPending}
          artifactStatus={artifactStatus}
        />

        <section
          aria-label="Visual authoring studio"
          className="admin-svg-engine-shell__stage"
          data-testid="admin-svg-engine-stage"
          data-region="stage-column"
        >
          <ExcalidrawCanvas
            key={studioResetKey}
            renderCustomSidebar={() => (
              <AdminSvgStudioSidebar
                geometry={form.geometry}
                stageMeta={stageMeta}
                onGeometryChange={(geometry) =>
                  onFormChange({ ...form, geometry })
                }
              />
            )}
            initialExcalidrawElements={initialExcalidrawElements}
            initialSvg=""
            checksum={artifactStatus.hash ?? ""}
            readRequest={1}
            onDocument={onDocument}
            onError={onError}
          />
        </section>

        <AdminSvgDetailsRail
          slug={slug}
          form={form}
          advancedOpen={
            preview?.ok === false || formDirty || coreFieldIssuesCount > 0
          }
          formIssues={formIssues}
          canConvertToGlb={canConvertToGlb}
          glbSourceSvg={glbSourceSvg}
          glbUrl={glbUrl}
          glbUploading={glbUploading}
          glbUploadError={glbUploadError}
          onFormChange={onFormChange}
          onStartGlbConversion={onStartGlbConversion}
          onGlbGenerated={onGlbGenerated}
        />
      </div>
    </div>
  );
}
