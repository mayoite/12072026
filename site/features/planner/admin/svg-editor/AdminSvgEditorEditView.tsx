"use client";

/**
 * A4 — Admin SVG Editor per-slug edit view (canvas-first shell).
 *
 * Primary surface: visual studio (SvgSceneDocument). Secondary rail: live
 * compile preview, published artifact, and advanced block metadata form.
 * Publish: formState (sceneParts → blocks) → publishDescriptorWithPipeline.
 *
 * GS: semantic tokens only; no hex in tsx. Catalog publish SVG ≠ Fabric plan-draw.
 *
 * ADM-STATE-01 / ADM-SVG-14: one authoritative lifecycle + field-level draft diff.
 * ADM-FORM-02 / ADM-PUB-01: linked field errors (SvgEditorForm) + publish blocking.
 * ADM-SVG-06: stage status shows identity, footprint, view box, zoom, selection,
 * draft, validation, and revision.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SetStateAction } from "react";
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
import type { CatalogLifecycleState } from "./catalogLifecycle.shared";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import { sceneFromDescriptor } from "./sceneFromDescriptor";
import { serializeSceneToDefinition } from "./scene/svgSceneSerializer";
import type { SvgSceneDocument } from "./scene/svgSceneDocument";
import {
  advancePublishedDraft,
  resetEditorDraft,
} from "./svgEditorDraftState";
import {
  deriveAuthoringLifecycle,
  authoringLifecycleLabel,
  authoringLifecycleBadgeClass,
  describeChangedFields,
} from "./authoringLifecycle";
import { validateCoreProductFields } from "./validateCoreProductFields";

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
  readonly publishedSlug: string | null;
}

const INITIAL_FEEDBACK: FeedbackState = {
  submitting: false,
  errorMessage: null,
  successMessage: null,
  publishedSlug: null,
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
  ) => Promise<PublishDescriptorResult>;
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
  const [publishedForm, setPublishedForm] = useState<SvgEditorFormState>(() =>
    descriptorToFormState(descriptor),
  );
  const [publishedFormSignature, setPublishedFormSignature] = useState(() =>
    JSON.stringify(descriptorToFormState(descriptor)),
  );
  const formRef = useRef(form);
  const draftRevisionRef = useRef(0);
  const updateDraftForm = useCallback((next: SetStateAction<SvgEditorFormState>) => {
    const resolved =
      typeof next === "function" ? next(formRef.current) : next;
    formRef.current = resolved;
    draftRevisionRef.current += 1;
    setForm(resolved);
  }, []);

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
          updateDraftForm((prev) => ({ ...prev, assetsGlbUrl: permanentUrl }));
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
    [slug, updateDraftForm],
  );

  const clearFeedback = useCallback(() => {
    setFeedback((prev) => ({
      ...prev,
      errorMessage: null,
      successMessage: null,
      publishedSlug: null,
    }));
  }, []);

  // A4.1 — starter scene for the visual studio, seeded from the descriptor.
  const studioScene = useMemo(() => sceneFromDescriptor(descriptor), [descriptor]);
  const [publishedStudioScene, setPublishedStudioScene] = useState(studioScene);
  const formSignature = useMemo(() => JSON.stringify(form), [form]);
  const formDirty = formSignature !== publishedFormSignature;
  const [studioResetKey, setStudioResetKey] = useState(0);
  const studioDocumentGetterRef = useRef<(() => SvgSceneDocument) | null>(null);
  const studioDocumentRef = useRef(studioScene);

  const handleStudioDocumentChange = useCallback((document: Parameters<typeof serializeSceneToDefinition>[0]) => {
    studioDocumentRef.current = document;
    const definition = serializeSceneToDefinition(document);
    updateDraftForm((prev) => {
      const next = {
        ...prev,
        sceneViewBox: definition.viewBox,
        sceneParts: definition.parts,
      };
      return next;
    });
  }, [updateDraftForm]);

  useEffect(() => {
    if (!formDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const staysOnDocument =
        destination.origin === current.origin &&
        destination.pathname === current.pathname &&
        destination.search === current.search;
      if (staysOnDocument) return;

      const leave = window.confirm(
        "Leave this editor and discard all unpublished field and studio changes?",
      );
      if (leave) return;

      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [formDirty]);

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
    if (formDirty && !window.confirm("Discard every unpublished field and studio edit, then restore the last published revision?")) {
      return;
    }
    const reset = resetEditorDraft({ baseline: publishedForm, draft: form });
    updateDraftForm(reset.draft);
    studioDocumentRef.current = publishedStudioScene;
    setStudioResetKey((key) => key + 1);
  }, [form, formDirty, publishedForm, publishedStudioScene, updateDraftForm]);

  const publishPayloadFromStudio = useCallback((): SvgEditorFormState => {
    const liveDocument =
      studioDocumentGetterRef.current?.() ?? studioDocumentRef.current;
    const definition = serializeSceneToDefinition(liveDocument);
    return {
      ...form,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    };
  }, [form]);

  const footprintProof = useMemo(() => {
    const viewBox = form.sceneViewBox ?? form.viewBox;
    return {
      widthMm: form.geometry.widthMm,
      depthMm: form.geometry.depthMm,
      aligned:
        viewBox.width === form.geometry.widthMm &&
        viewBox.height === form.geometry.depthMm,
    };
  }, [form.geometry.depthMm, form.geometry.widthMm, form.sceneViewBox, form.viewBox]);
  const publishTarget = form.slug.trim() || slug;

  const handlePublish = useCallback(async () => {
    if (!footprintProof.aligned) {
      setFeedback({
        submitting: false,
        errorMessage: "Publish is blocked because the SVG view box does not match the product width and depth in millimetres.",
        successMessage: null,
        publishedSlug: null,
      });
      return;
    }
    const coreIssues = validateCoreProductFields(form);
    if (coreIssues.length > 0) {
      setFeedback({
        submitting: false,
        errorMessage: `Publish is blocked: fix ${coreIssues.length} core field ${coreIssues.length === 1 ? "error" : "errors"} (see Advanced block fields).`,
        successMessage: null,
        publishedSlug: null,
      });
      return;
    }
    if (previewPending || preview?.ok !== true) {
      setFeedback({
        submitting: false,
        errorMessage: previewPending
          ? "Publish is blocked while validation is running."
          : "Publish is blocked until the current draft has a valid compiled preview.",
        successMessage: null,
        publishedSlug: null,
      });
      return;
    }
    const confirmed = window.confirm(
      `Publish “${publishTarget}”?\n\nThis will replace the current released SVG artifact. The previous revision remains available for rollback.`,
    );
    if (!confirmed) return;

    setFeedback({
      submitting: true,
      errorMessage: null,
      successMessage: null,
      publishedSlug: null,
    });
    try {
      if (!onPublishAction) {
        setFeedback({
          submitting: false,
          errorMessage: "Publish is unavailable (no server action wired).",
          successMessage: null,
          publishedSlug: null,
        });
        return;
      }
      const submittedScene =
        studioDocumentGetterRef.current?.() ?? studioDocumentRef.current;
      studioDocumentRef.current = submittedScene;
      const payload = publishPayloadFromStudio();
      const submittedFormSignature = JSON.stringify(payload);
      const submittedSceneSignature = JSON.stringify(submittedScene);
      const submittedRevision = draftRevisionRef.current;
      const result = await onPublishAction(payload);
      if (result.success === false) {
        setFeedback({
          submitting: false,
          errorMessage: `Publish failed for “${slug}”: ${result.error}`,
          successMessage: null,
          publishedSlug: null,
        });
        return;
      }
      const publishedSlug = result.descriptor.slug;
      const authoritativePublishedForm = descriptorToFormState(result.descriptor);
      const authoritativePublishedScene = sceneFromDescriptor(result.descriptor);
      const published = advancePublishedDraft(
        { baseline: publishedForm, draft: form },
        authoritativePublishedForm,
      );
      setPublishedForm(published.baseline);
      const authoritativeFormSignature = JSON.stringify(authoritativePublishedForm);
      const authoritativeSceneSignature = JSON.stringify(authoritativePublishedScene);
      setPublishedFormSignature(authoritativeFormSignature);
      setPublishedStudioScene(authoritativePublishedScene);
      const currentScene = studioDocumentRef.current;
      const draftStillSubmitted =
        draftRevisionRef.current === submittedRevision &&
        JSON.stringify(formRef.current) === submittedFormSignature &&
        JSON.stringify(currentScene) === submittedSceneSignature;
      if (draftStillSubmitted) {
        updateDraftForm(published.draft);
        if (authoritativeSceneSignature !== submittedSceneSignature) {
          studioDocumentRef.current = authoritativePublishedScene;
          setStudioResetKey((key) => key + 1);
        }
      }
      setFeedback({
        submitting: false,
        errorMessage: null,
        successMessage: `Published “${publishedSlug}” at ${nowStampLabel()}. Refreshing artifact preview…`,
        publishedSlug,
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
        publishedSlug: null,
      });
    }
  }, [footprintProof.aligned, form, onPublishAction, preview, previewPending, publishPayloadFromStudio, publishTarget, publishedForm, router, slug, updateDraftForm]);

  const checksumShort =
    typeof descriptor.checksum === "string" && descriptor.checksum.length > 16
      ? `${descriptor.checksum.slice(0, 16)}…`
      : (descriptor.checksum ?? "—");
  const artifactHashShort = artifactStatus.hash
    ? `${artifactStatus.hash.slice(0, 16)}…`
    : "—";

  const canConvertToGlb = form.variant === "fixed" && compiledSvg !== null;

  // ADM-STATE-01: one authoritative authoring lifecycle.
  const authoringLifecycle = deriveAuthoringLifecycle({
    submitting: feedback.submitting,
    errorMessage: feedback.errorMessage,
    successMessage: feedback.successMessage,
    previewPending,
    previewOk: preview == null ? null : preview.ok === true,
    formDirty,
  });

  // ADM-SVG-14: field-level draft vs published difference.
  const changedFields = useMemo(
    () => describeChangedFields(form, publishedForm),
    [form, publishedForm],
  );

  const coreFieldIssues = useMemo(
    () => validateCoreProductFields(form),
    [form],
  );
  const formIssues = useMemo(() => {
    const previewIssues = preview?.issues ?? [];
    const corePaths = new Set(coreFieldIssues.map((issue) => issue.path));
    return [
      ...coreFieldIssues,
      ...previewIssues.filter((issue) => !corePaths.has(issue.path)),
    ];
  }, [coreFieldIssues, preview?.issues]);

  const canPublish =
    Boolean(onPublishAction) &&
    !feedback.submitting &&
    !previewPending &&
    preview?.ok === true &&
    footprintProof.aligned &&
    coreFieldIssues.length === 0;

  const validationStatus =
    authoringLifecycle === "validating" || previewPending
      ? "Validation running"
      : authoringLifecycle === "invalid" || preview?.ok === false
        ? `Validation blocked${preview?.issues?.length ? ` (${preview.issues.length})` : ""}`
        : preview?.ok === true
          ? footprintProof.aligned
            ? "Validation ok"
            : "Validation blocked (footprint)"
          : "Validation pending";
  const identityIdShort =
    typeof descriptor.id === "string" && descriptor.id.length > 12
      ? `${descriptor.id.slice(0, 8)}…`
      : descriptor.id;
  const stageMeta = {
    identity: `Identity ${publishTarget} · id ${identityIdShort} · SKU ${form.sku.trim() || "—"}`,
    footprint: `Footprint ${footprintProof.widthMm}×${footprintProof.depthMm} mm`,
    draft: `Draft ${authoringLifecycleLabel(authoringLifecycle)}`,
    validation: validationStatus,
    revision: `Revision schema ${descriptor.schemaVersion} · ${updatedAtLabel} · ${artifactHashShort}`,
  };

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
            {" "}
            ·{" "}
            <span
              className={authoringLifecycleBadgeClass(authoringLifecycle)}
              data-testid="admin-authoring-lifecycle"
              data-lifecycle={authoringLifecycle}
            >
              {authoringLifecycleLabel(authoringLifecycle)}
            </span>
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
            · last published {updatedAtLabel}
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
            disabled={feedback.submitting || !formDirty}
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
            disabled={!canPublish}
            aria-describedby="admin-svg-publication-impact"
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

      <p
        id="admin-svg-publication-impact"
        className="admin-page__meta"
        data-testid="admin-svg-publication-impact"
      >
        Publish target: <code>{publishTarget}</code>. Authoring state:{" "}
        <strong>{authoringLifecycleLabel(authoringLifecycle)}</strong>. Live
        artifact: {artifactStatus.state}
        {artifactStatus.hash ? (
          <>
            {" "}
            · live revision <code>{artifactHashShort}</code>
          </>
        ) : null}
        . Draft schema <code>{descriptor.schemaVersion}</code>. Primary action
        Publish replaces the released SVG; prior revisions remain for rollback.
      </p>

      {coreFieldIssues.length > 0 ? (
        <div
          className="admin-alert admin-alert--warn"
          role="alert"
          data-testid="admin-core-field-errors"
        >
          <strong>
            Fix {coreFieldIssues.length} core field{" "}
            {coreFieldIssues.length === 1 ? "error" : "errors"} before
            publishing:
          </strong>
          <ul>
            {coreFieldIssues.map((issue) => (
              <li key={issue.path}>
                <a href={`#svgfield-${issue.path}`}>{issue.message}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ADM-SVG-14 field diff + ADM-PUB-01 blocking note */}
      {formDirty || authoringLifecycle === "invalid" ? (
        <div
          className="admin-alert admin-alert--warn"
          role="status"
          data-testid="admin-draft-published-diff"
        >
          <strong>Draft vs published</strong>
          {formDirty ? (
            <p className="admin-page__meta">
              Field differences:{" "}
              {changedFields.length === 0 ? (
                <span>studio-only changes</span>
              ) : (
                changedFields.map((entry, index) => (
                  <span key={entry.key}>
                    {index > 0 ? " · " : null}
                    {entry.targetId ? (
                      <a href={`#${entry.targetId}`}>{entry.label}</a>
                    ) : (
                      entry.label
                    )}
                  </span>
                ))
              )}
            </p>
          ) : null}
          {authoringLifecycle === "invalid" ? (
            <p className="admin-page__meta">
              Publication is blocked. Fix the linked validation errors in Advanced
              block fields (and the live compile panel) before publishing.
            </p>
          ) : null}
          <p className="admin-page__meta">
            Visual difference: compare <strong>Live compile</strong> (draft) with{" "}
            <strong>Published on disk</strong> (released artifact).
          </p>
        </div>
      ) : null}

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
            <span className="min-w-0 flex-1">
              {feedback.successMessage}
              {feedback.publishedSlug ? (
                <>
                  {" "}
                  <a href={`/svg-catalog/${feedback.publishedSlug}.svg`} target="_blank" rel="noreferrer">Open released SVG</a>
                  {" · "}
                  <Link href="/planner/guest">Verify in Planner</Link>
                </>
              ) : null}
            </span>
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
        data-stage-layout="1fr-rail"
      >
        <section
          aria-label="Visual authoring studio"
          className="admin-svg-engine-shell__stage"
          data-testid="admin-svg-engine-stage"
        >
          <SvgStudioCanvas
            key={studioResetKey}
            initialDocument={publishedStudioScene}
            documentGetterRef={studioDocumentGetterRef}
            onDocumentChange={handleStudioDocumentChange}
            stageMeta={stageMeta}
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

          <details
            className="admin-panel admin-svg-engine-shell__panel admin-svg-engine-shell__advanced"
            open={
              preview?.ok === false ||
              formDirty ||
              coreFieldIssues.length > 0
            }
          >
            <summary className="admin-panel__header">
              Advanced block fields
            </summary>
            <div className="admin-panel__body">
              <p className="admin-page__meta">
                Metadata and catalog fields. Geometry for publish comes from the
                visual studio, not these rows. Field errors and a linked summary
                appear here when validation fails.
              </p>
              <SvgEditorForm
                fields={SVG_EDITOR_FIELDS}
                state={form}
                variant={form.variant}
                issues={formIssues}
                onChange={updateDraftForm}
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
