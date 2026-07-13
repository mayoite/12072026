"use client";

/**
 * A4 — Admin SVG Editor per-slug edit view (canvas-first shell).
 *
 * Primary surface: visual studio (SvgSceneDocument). Secondary rail: live
 * compile preview, published artifact, and advanced block metadata form.
 * Publish: formState (sceneParts → blocks) → publishDescriptorWithPipeline.
 *
 * GS: semantic tokens only; no hex in tsx. Catalog publish SVG ≠ Fabric plan-draw.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
} from "@/features/planner/project/catalog/svg/svgTypes";
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
import { DescriptorRevisionPanel } from "./DescriptorRevisionPanel";
import { proveDescriptorFootprintMm } from "./footprintMmProof";
import type { CatalogLifecycleState } from "./catalogLifecycle.shared";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import { sceneFromDescriptor } from "./sceneFromDescriptor";
import { serializeSceneToDefinition } from "./scene/svgSceneSerializer";
import type { SvgSceneDocument } from "./scene/svgSceneDocument";

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
  readonly catalogLifecycle: CatalogLifecycleState;
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
  catalogLifecycle,
  onPublishAction,
}: AdminSvgEditorEditViewProps) {
  const [lifecycle, setLifecycle] = useState(catalogLifecycle);
  const [approving, setApproving] = useState(false);
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
  const publishedSceneSignature = useMemo(
    () => JSON.stringify(serializeSceneToDefinition(studioScene).parts),
    [studioScene],
  );
  const sceneDirty = useMemo(() => {
    const current = JSON.stringify(form.sceneParts ?? []);
    return current !== publishedSceneSignature;
  }, [form.sceneParts, publishedSceneSignature]);
  const [studioResetKey, setStudioResetKey] = useState(0);
  const studioDocumentGetterRef = useRef<(() => SvgSceneDocument) | null>(null);
  const studioDocumentRef = useRef(studioScene);
  studioDocumentRef.current = studioScene;
  const publishFormRef = useRef(form);
  publishFormRef.current = form;

  const handleStudioDocumentChange = useCallback((document: Parameters<typeof serializeSceneToDefinition>[0]) => {
    studioDocumentRef.current = document;
    const definition = serializeSceneToDefinition(document);
    setForm((prev) => {
      const next = {
        ...prev,
        sceneViewBox: definition.viewBox,
        sceneParts: definition.parts,
      };
      publishFormRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!sceneDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [sceneDirty]);

  const handleApproveForBuyers = useCallback(async () => {
    if (artifactStatus.state !== "published") return;
    setApproving(true);
    try {
      const response = await browserApiFetch(apiPath(`/api/admin/svg-editor/${slug}/lifecycle`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "live" }),
      });
      if (!response.ok) return;
      setLifecycle("live");
      router.refresh();
    } finally {
      setApproving(false);
    }
  }, [artifactStatus.state, router, slug]);

  const handleResetToPublished = useCallback(() => {
    if (sceneDirty && !window.confirm("Discard unpublished studio edits and restore the last published scene?")) {
      return;
    }
    const seed = descriptorToFormState(descriptor);
    setForm(seed);
    publishFormRef.current = seed;
    studioDocumentRef.current = studioScene;
    setStudioResetKey((key) => key + 1);
  }, [descriptor, sceneDirty, studioScene]);

  const publishPayloadFromStudio = useCallback((): SvgEditorFormState => {
    const liveDocument =
      studioDocumentGetterRef.current?.() ?? studioDocumentRef.current;
    const definition = serializeSceneToDefinition(liveDocument);
    return {
      ...publishFormRef.current,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    };
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
      const result = await onPublishAction(publishPayloadFromStudio());
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
  }, [onPublishAction, publishPayloadFromStudio, router, slug]);

  const footprintProof = useMemo(() => proveDescriptorFootprintMm(descriptor), [descriptor]);

  const checksumShort =
    typeof descriptor.checksum === "string" && descriptor.checksum.length > 16
      ? `${descriptor.checksum.slice(0, 16)}…`
      : (descriptor.checksum ?? "—");
  const artifactHashShort = artifactStatus.hash
    ? `${artifactStatus.hash.slice(0, 16)}…`
    : "—";

  const canConvertToGlb = form.variant === "fixed" && compiledSvg !== null;

  return (
    <div className="admin-page admin-page--svg-engine">
      <header className="admin-page__header admin-svg-engine-header">
        <div>
          <p className="admin-page__eyebrow">Catalog assets · SVG studio</p>
          <h1 className="admin-page__title">
            <code>{slug}</code>
          </h1>
          <p className="admin-page__meta">
            <span className="admin-badge">{variantTitle(form.variant)}</span> ·{" "}
            {describeVariant(form.variant)} · schema{" "}
            <code>{descriptor.schemaVersion}</code> ·{" "}
            <code className="admin-page__checksum">{checksumShort}</code>
            {sceneDirty ? (
              <>
                {" "}
                · <span className="admin-badge admin-badge--warn">Unsaved studio edits</span>
              </>
            ) : null}
            {" "}
            ·{" "}
            <span
              className={
                lifecycle === "live"
                  ? "admin-badge admin-badge--active"
                  : lifecycle === "retired"
                    ? "admin-badge admin-badge--hidden"
                    : "admin-badge admin-badge--warn"
              }
            >
              {lifecycle}
            </span>
            {" "}
            ·{" "}
            <span
              data-testid="admin-footprint-mm-proof"
              data-aligned={footprintProof.aligned ? "true" : "false"}
              data-width-mm={footprintProof.widthMm}
              data-depth-mm={footprintProof.depthMm}
              className={
                footprintProof.aligned
                  ? "admin-badge admin-badge--active"
                  : "admin-badge admin-badge--warn"
              }
            >
              {footprintProof.widthMm}×{footprintProof.depthMm} mm
              {footprintProof.aligned ? "" : " · viewBox mismatch"}
            </span>
          </p>
        </div>
        <div className="admin-page__actions">
          <Link
            href="/admin/svg-editor"
            className="admin-btn admin-btn--outline"
          >
            <ArrowLeft size={14} aria-hidden />
            Back
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={handleResetToPublished}
            disabled={feedback.submitting || !sceneDirty}
          >
            Reset to published
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => void handleApproveForBuyers()}
            disabled={
              approving ||
              feedback.submitting ||
              lifecycle === "live" ||
              artifactStatus.state !== "published"
            }
          >
            Approve for buyers
          </button>
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

      <div aria-live="polite" aria-atomic="true" className="admin-svg-engine-feedback">
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

      {/* Canvas-first shell: stage owns the viewport; form is a secondary rail. */}
      <div
        className="admin-svg-engine-shell"
        data-testid="admin-svg-engine-shell"
        data-studio-node-count={form.sceneParts?.length ?? 0}
      >
        <section
          aria-label="Visual authoring studio"
          className="admin-svg-engine-shell__stage"
        >
          <SvgStudioCanvas
            key={studioResetKey}
            initialDocument={studioScene}
            documentGetterRef={studioDocumentGetterRef}
            onDocumentChange={handleStudioDocumentChange}
          />
        </section>

        <aside
          aria-label="Preview and block details"
          className="admin-svg-engine-shell__rail"
        >
          <div className="admin-panel admin-svg-engine-shell__panel">
            <div className="admin-panel__header">Live compile</div>
            <div className="admin-panel__body">
              <LiveCompiledSvgPreview result={preview} pending={previewPending} />
            </div>
          </div>

          <article
            className="admin-panel admin-svg-engine-shell__panel"
            data-artifact-state={artifactStatus.state}
            data-testid="admin-svg-artifact-panel"
          >
            <div className="admin-panel__header">Published on disk</div>
            <div className="admin-panel__body">
              <p className="admin-page__meta">
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
                </span>{" "}
                {artifactStatus.bytes > 0
                  ? `${artifactStatus.bytes.toLocaleString()} bytes`
                  : "No bytes"}{" "}
                · SHA <code className="admin-page__checksum">{artifactHashShort}</code>
              </p>
              <PublishedSvgPreview
                slug={slug}
                status={artifactStatus}
                size="panel"
              />
            </div>
          </article>

          <DescriptorRevisionPanel slug={slug} />

          <details className="admin-panel admin-svg-engine-shell__panel admin-svg-engine-shell__advanced">
            <summary className="admin-panel__header">
              Advanced block fields
            </summary>
            <div className="admin-panel__body">
              <p className="admin-page__meta">
                Metadata and catalog fields. Geometry for publish comes from the
                visual studio, not these rows.
              </p>
              <SvgEditorForm
                fields={SVG_EDITOR_FIELDS}
                state={form}
                variant={form.variant}
                issues={preview?.issues ?? []}
                onChange={setForm}
              />
            </div>
          </details>

          <details className="admin-panel admin-svg-engine-shell__panel">
            <summary className="admin-panel__header">SVG → generated GLB</summary>
            <div className="admin-panel__body">
              {form.variant === "fixed" ? (
                <>
                  <p className="admin-page__copy">
                    Convert the current footprint SVG to a system-generated GLB
                    under <code>catalog-assets/generated/</code>.
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
          </details>
        </aside>
      </div>
    </div>
  );
}

export default AdminSvgEditorEditView;
