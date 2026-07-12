"use client";

/**
 * A4 — Admin SVG Editor per-slug edit view (no-code, Puck removed).
 *
 * Replaces the Puck auto-sidebar with a bespoke schema-driven form
 * (`SvgEditorForm`) + a live compiled preview (`LiveCompiledSvgPreview` via
 * `useDebouncedCompile`). Every field is an explicit control — no free-text
 * JSON, no comma-separated strings. SVG→GLB is fed from the just-compiled SVG
 * (no file picker).
 *
 * Publish path is unchanged downstream: `onPublishAction(formState)` →
 * `formStateToDescriptorInput` → `publishDescriptorWithPipeline` (S1–S6).
 *
 * GS: semantic tokens from site/app/css/ only; no hex in tsx; anti-copy.
 * Honesty: catalog **publish** SVG, not the Fabric plan-draw canvas.
 */

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  CircleNotch as Loader2,
  Cube,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

import type {
  BlockDescriptor,
  BlockDescriptorVariant,
} from "@/features/planner/open3d/catalog/svg/svgTypes";
import { SVG_EDITOR_FIELDS } from "./svgEditorFormModel";
import { descriptorToFormState } from "./svgEditorFormAdapters";
import type { SvgEditorFormState } from "./svgEditorFormState";
import { SvgEditorForm } from "./SvgEditorForm";
import { LiveCompiledSvgPreview } from "./LiveCompiledSvgPreview";
import { useDebouncedCompile } from "./useDebouncedCompile";
import { uploadAssetToSupabase } from "./uploadAsset";
import type { SvgArtifactStatus } from "./svgArtifactStatus.server";
import type { PublishDescriptorResult } from "./publishDescriptorWithPipeline";
import { PublishedSvgPreview } from "./PublishedSvgPreview";
import { sceneFromDescriptor } from "./sceneFromDescriptor";
import { serializeSceneToDefinition } from "./scene/svgSceneSerializer";

/** Browser-only 3D islands — static import of model-viewer/three breaks RSC SSR. */
const GlbExtruderPreview = dynamic(
  () => import("./GlbExtruderPreview").then((m) => m.GlbExtruderPreview),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading
        extruder…
      </p>
    ),
  },
);
const ModelViewerPreview = dynamic(
  () => import("./ModelViewerPreview").then((m) => m.ModelViewerPreview),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading 3D
        preview…
      </p>
    ),
  },
);

/** A4.1 visual studio — SVG.js engine is client-only, so load it as an island. */
const SvgStudioCanvas = dynamic(
  () => import("./SvgStudioCanvas").then((m) => m.SvgStudioCanvas),
  {
    ssr: false,
    loading: () => (
      <p className="admin-page__meta" role="status">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Loading visual
        studio…
      </p>
    ),
  },
);

interface FeedbackState {
  readonly submitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
}

const INITIAL_FEEDBACK: FeedbackState = {
  submitting: false,
  errorMessage: null,
  successMessage: null,
};

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

export interface AdminSvgEditorEditViewProps {
  readonly slug: string;
  readonly descriptor: BlockDescriptor;
  readonly updatedAtLabel: string;
  readonly artifactStatus: SvgArtifactStatus;
  /** Server action wired by the RSC page: persists + runs the SVG pipeline. */
  readonly onPublishAction?: (
    data: SvgEditorFormState,
  ) => Promise<void | PublishDescriptorResult>;
}

export function AdminSvgEditorEditView({
  slug,
  descriptor,
  updatedAtLabel,
  artifactStatus,
  onPublishAction,
}: AdminSvgEditorEditViewProps) {
  const router = useRouter();

  // Controlled form state, seeded from the persisted descriptor.
  const [form, setForm] = useState<SvgEditorFormState>(() =>
    descriptorToFormState(descriptor),
  );

  // Live compiled preview (debounced real compile; no disk I/O).
  const { result: preview, pending: previewPending } = useDebouncedCompile(
    slug,
    form,
  );

  const [feedback, setFeedback] = useState<FeedbackState>(INITIAL_FEEDBACK);

  // SVG → GLB flow, fed by the just-compiled preview SVG (no file picker).
  const [glbSourceSvg, setGlbSourceSvg] = useState<string | null>(null);
  const [glbUrl, setGlbUrl] = useState<string>("");
  const [glbUploading, setGlbUploading] = useState(false);
  const [glbUploadError, setGlbUploadError] = useState<string | null>(null);

  const compiledSvg = preview?.ok === true ? (preview.svg ?? null) : null;

  const startGlbConversion = useCallback(() => {
    if (compiledSvg) setGlbSourceSvg(compiledSvg);
  }, [compiledSvg]);

  const handleGlbGenerated = useCallback(
    async (blob: Blob) => {
      const localUrl = URL.createObjectURL(blob);
      setGlbUrl(localUrl);
      setGlbUploadError(null);
      setGlbUploading(true);
      try {
        const permanentUrl = await uploadAssetToSupabase(
          blob,
          `${slug || "generated"}.glb`,
        );
        if (permanentUrl) {
          setGlbUrl(permanentUrl);
          // Record the generated GLB on the fixed-variant descriptor field.
          setForm((prev) => ({ ...prev, assetsGlbUrl: permanentUrl }));
        } else {
          setGlbUploadError(
            "Upload returned no URL — blob preview still available locally.",
          );
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setGlbUploadError(`GLB upload failed: ${message}`);
      } finally {
        setGlbUploading(false);
      }
    },
    [slug],
  );

  const clearFeedback = useCallback(() => {
    setFeedback((prev) => ({
      ...prev,
      errorMessage: null,
      successMessage: null,
    }));
  }, []);

  // A4.1 — starter scene for the visual studio, seeded from the descriptor.
  const studioScene = useMemo(() => sceneFromDescriptor(descriptor), [descriptor]);
  const handleStudioDocumentChange = useCallback((document: Parameters<typeof serializeSceneToDefinition>[0]) => {
    const definition = serializeSceneToDefinition(document);
    setForm((prev) => ({
      ...prev,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    }));
  }, []);

  const handlePublish = useCallback(async () => {
    setFeedback({ submitting: true, errorMessage: null, successMessage: null });
    try {
      if (!onPublishAction) {
        setFeedback({
          submitting: false,
          errorMessage: "Publish is unavailable (no server action wired).",
          successMessage: null,
        });
        return;
      }
      const result = await onPublishAction(form);
      if (result && result.success === false) {
        setFeedback({
          submitting: false,
          errorMessage: `Publish failed for “${slug}”: ${result.error}`,
          successMessage: null,
        });
        return;
      }
      const publishedSlug =
        result && result.success === true ? result.descriptor.slug : slug;
      setFeedback({
        submitting: false,
        errorMessage: null,
        successMessage: `Published “${publishedSlug}” → /svg-catalog/${publishedSlug}.svg · ${nowStampLabel()}. Refreshing artifact preview…`,
      });
      router.refresh();
    } catch (networkError) {
      const message =
        networkError instanceof Error
          ? networkError.message
          : String(networkError);
      setFeedback({
        submitting: false,
        errorMessage: `Publish failed for “${slug}”: ${message}`,
        successMessage: null,
      });
    }
  }, [onPublishAction, form, router, slug]);

  const checksumShort =
    typeof descriptor.checksum === "string" && descriptor.checksum.length > 16
      ? `${descriptor.checksum.slice(0, 16)}…`
      : (descriptor.checksum ?? "—");
  const artifactHashShort = artifactStatus.hash
    ? `${artifactStatus.hash.slice(0, 16)}…`
    : "—";

  const canConvertToGlb = form.variant === "fixed" && compiledSvg !== null;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">
            Catalog assets · SVG block editor
          </p>
          <h1 className="admin-page__title">
            <code>{slug}</code>
          </h1>
          <p className="admin-page__copy">{describeVariant(form.variant)}</p>
          <p className="admin-page__meta">
            Publishing requires a real admin session. Local auth bypass is for
            development and test runs only. It is disabled in production.
          </p>
          <p className="admin-page__meta">
            <span className="admin-badge">{variantTitle(form.variant)}</span> ·
            schema <code>{descriptor.schemaVersion}</code> · checksum{" "}
            <code className="admin-page__checksum">{checksumShort}</code> ·
            loaded <code>{updatedAtLabel}</code>
          </p>
        </div>
        <div className="admin-page__actions">
          <Link
            href="/admin/svg-editor"
            className="admin-btn admin-btn--outline"
          >
            <ArrowLeft size={14} aria-hidden />
            Back to list
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handlePublish}
            disabled={feedback.submitting}
          >
            {feedback.submitting ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <CheckCircle size={14} aria-hidden />
            )}
            Publish
          </button>
        </div>
      </header>

      <div aria-live="polite" aria-atomic="true">
        {feedback.submitting ? (
          <div
            role="status"
            className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
            aria-busy="true"
          >
            <Loader2 size={16} className="animate-spin shrink-0" aria-hidden />
            <span>
              Publishing <code>{slug}</code>… Persist + SVG pipeline in
              progress.
            </span>
          </div>
        ) : null}
        {feedback.errorMessage ? (
          <div
            role="alert"
            className="admin-alert admin-alert--error flex flex-wrap items-center gap-3"
          >
            <WarningCircle size={16} className="shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">{feedback.errorMessage}</span>
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
        {feedback.successMessage ? (
          <div
            role="status"
            className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
          >
            <CheckCircle size={16} className="shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">{feedback.successMessage}</span>
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

      {/* Split: no-code form (left) + live compiled preview (right). */}
      <section
        aria-label="Visual authoring studio"
        className="admin-panel admin-svg-editor-layout__studio"
      >
        <div className="admin-panel__header">Visual studio (A4.1)</div>
        <div className="admin-panel__body">
          <SvgStudioCanvas
            initialDocument={studioScene}
            onDocumentChange={handleStudioDocumentChange}
          />
        </div>
      </section>

      <section
        aria-label="No-code SVG editor"
        className="admin-svg-editor-layout"
      >
        <div className="admin-svg-editor-layout__form admin-panel">
          <div className="admin-panel__header">Block fields</div>
          <div className="admin-panel__body">
            <SvgEditorForm
              fields={SVG_EDITOR_FIELDS}
              state={form}
              variant={form.variant}
              issues={preview?.issues ?? []}
              onChange={setForm}
            />
          </div>
        </div>

        <div className="admin-svg-editor-layout__preview admin-panel">
          <div className="admin-panel__header">Live preview</div>
          <div className="admin-panel__body">
            <LiveCompiledSvgPreview result={preview} pending={previewPending} />
          </div>

          {/* SVG → GLB, fed from the compiled preview (no file picker). */}
          <div className="admin-glb-panel">
            <div className="admin-panel__header">SVG → generated GLB</div>
            <div className="admin-panel__body">
              {form.variant === "fixed" ? (
                <>
                  <p className="admin-page__copy">
                    Convert the current footprint SVG to a system-generated GLB
                    under <code>catalog-assets/generated/</code>.
                    System-generated only — not a designer static asset.
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    onClick={startGlbConversion}
                    disabled={!canConvertToGlb}
                  >
                    <Cube size={14} aria-hidden />
                    Convert to 3D (GLB)
                  </button>
                  {!canConvertToGlb ? (
                    <p className="admin-page__meta">
                      Generate a valid preview first, then convert.
                    </p>
                  ) : null}
                  {glbSourceSvg ? (
                    <GlbExtruderPreview
                      svgString={glbSourceSvg}
                      onGlbGenerated={handleGlbGenerated}
                    />
                  ) : null}
                  {glbUploading ? (
                    <div
                      role="status"
                      className="admin-alert admin-alert--info flex flex-wrap items-center gap-3"
                      aria-busy="true"
                    >
                      <Loader2
                        size={14}
                        className="animate-spin shrink-0"
                        aria-hidden
                      />
                      Uploading generated GLB…
                    </div>
                  ) : null}
                  {glbUploadError ? (
                    <div
                      role="alert"
                      className="admin-alert admin-alert--warn flex flex-wrap items-center gap-3"
                    >
                      <WarningCircle
                        size={14}
                        className="shrink-0"
                        aria-hidden
                      />
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
                  3D generation is available for fixed-variant blocks.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Published artifact on disk (updates after Publish + refresh). */}
      <section aria-label="Published artifact" className="admin-page__summary">
        <article
          className="admin-page__summary-card admin-panel"
          data-artifact-state={artifactStatus.state}
          data-testid="admin-svg-artifact-panel"
        >
          <div className="admin-panel__header">Published SVG artifact</div>
          <div className="admin-panel__body">
            <p className="admin-page__summary-card-value">
              <span
                className={
                  artifactStatus.state === "published"
                    ? "admin-badge admin-badge--active"
                    : artifactStatus.state === "invalid"
                      ? "admin-badge admin-badge--warn"
                      : "admin-badge admin-badge--hidden"
                }
              >
                {artifactStatus.state === "published"
                  ? "Published"
                  : artifactStatus.state === "invalid"
                    ? "Invalid SVG"
                    : "Missing"}
              </span>
            </p>
            <p className="admin-page__meta">
              {artifactStatus.bytes > 0
                ? `${artifactStatus.bytes.toLocaleString()} bytes`
                : "No bytes on disk"}
              {artifactStatus.publicUrl ? (
                <>
                  {" · "}
                  <code>{artifactStatus.publicUrl}</code>
                </>
              ) : null}
            </p>
            <p className="admin-page__meta">
              SHA-256{" "}
              <code className="admin-page__checksum">{artifactHashShort}</code>
            </p>
            <PublishedSvgPreview
              slug={slug}
              status={artifactStatus}
              size="panel"
            />
          </div>
        </article>
      </section>
    </div>
  );
}

export default AdminSvgEditorEditView;
