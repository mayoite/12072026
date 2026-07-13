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
import {
  AUTHORING_WIDTH_PX,
  STAGE_GRID_COLUMNS,
  STAGE_MIN_FRACTION,
  stageMeetsMinimumAt1280,
} from "./stageLayoutContract";
import {
  confirmDiscardUnsavedNavigation,
  confirmResetToPublished,
} from "./destructiveConfirmMessages";
import {
  PLANNER_VERIFY_HREF,
  publishConfirmMessage,
  publishFailureMessage,
  publishImpactSummary,
  publishSuccessMessage,
  releasedSvgHref,
} from "./publishActionMessages";
import {
  declareSvgEditSources,
  formatDataSourceBanner,
} from "./adminDataSourceEditability";
import { phoneAuthoringBlockedMessage } from "@/features/planner/admin/adminMobileReview";
import { assertDraftNotStale } from "./staleDraftPublishGate";

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
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
      return "Fixed size product.";
    case "configurable":
      return "Options or bounded size choices.";
    case "parametric":
      return "Sized in the studio with a clear footprint.";
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
  /** Baseline stamp at open — DB-SVG-09 stale draft detection. */
  const [openedBaselineGeneratedAt] = useState(() => descriptor.generatedAt);

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

      const leave = window.confirm(confirmDiscardUnsavedNavigation(slug));
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
    // ADM-SVG-11: always require deliberate confirmation when the draft differs.
    if (formDirty && !window.confirm(confirmResetToPublished(slug))) {
      return;
    }
    const reset = resetEditorDraft({ baseline: publishedForm, draft: form });
    updateDraftForm(reset.draft);
    studioDocumentRef.current = publishedStudioScene;
    setStudioResetKey((key) => key + 1);
  }, [form, formDirty, publishedForm, publishedStudioScene, slug, updateDraftForm]);

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
    // DB-SVG-09 disk path: refuse publish if baseline moved under the draft.
    const stale = assertDraftNotStale({
      slug,
      clientBaselineGeneratedAt: openedBaselineGeneratedAt ?? 0,
      serverBaselineGeneratedAt: descriptor.generatedAt ?? 0,
    });
    if (!stale.ok) {
      setFeedback({
        submitting: false,
        errorMessage: stale.error,
        successMessage: null,
        publishedSlug: null,
      });
      return;
    }
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
    const impactInput = {
      targetSlug: publishTarget,
      draftSchemaVersion: String(descriptor.schemaVersion),
      liveArtifactState: artifactStatus.state,
      liveRevisionShort: artifactStatus.hash
        ? `${artifactStatus.hash.slice(0, 16)}…`
        : null,
    };
    // ADM-SVG-15: primary publish names target + draft/live versions before run.
    if (!window.confirm(publishConfirmMessage(impactInput))) return;

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
        // ADM-SVG-16: never show success; live artifact remains the previous release.
        setFeedback({
          submitting: false,
          errorMessage: publishFailureMessage(slug, result.error),
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
        // ADM-SVG-17: success text + publishedSlug drives artifact/Planner links.
        successMessage: publishSuccessMessage(publishedSlug, nowStampLabel()),
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
        errorMessage: publishFailureMessage(slug, message),
        successMessage: null,
        publishedSlug: null,
      });
    }
  }, [
    artifactStatus.hash,
    artifactStatus.state,
    descriptor.generatedAt,
    descriptor.schemaVersion,
    footprintProof.aligned,
    form,
    onPublishAction,
    openedBaselineGeneratedAt,
    preview,
    previewPending,
    publishPayloadFromStudio,
    publishTarget,
    publishedForm,
    router,
    slug,
    updateDraftForm,
  ]);

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
  const stageMeta = {
    identity: `Identity ${publishTarget} · SKU ${form.sku.trim() || "—"}`,
    footprint: `Footprint ${footprintProof.widthMm}×${footprintProof.depthMm} mm`,
    draft: `Draft ${authoringLifecycleLabel(authoringLifecycle)}`,
    validation: validationStatus,
    revision: `Revision ${updatedAtLabel} · checksum ${artifactHashShort}`,
  };

  return (
    <div
      className="admin-page admin-page--svg-engine"
      data-admin-shell="edit"
      data-testid="admin-svg-edit-shell"
    >
      <header
        className="admin-page__header admin-svg-engine-header"
        data-testid="admin-shell-header"
      >
        <div>
          {/* ADM-SHELL-01: title, scope, source, state */}
          <p className="admin-page__eyebrow" data-testid="admin-shell-scope">
            Catalog assets · SVG studio
          </p>
          <h1 className="admin-page__title" data-testid="admin-shell-title">
            <code>{slug}</code>
          </h1>
          <p className="admin-page__meta" data-testid="admin-shell-source">
            Source: local disk draft + published symbol · Products DB not live ·
            checksum{" "}
            <code className="admin-page__checksum">{checksumShort}</code>
          </p>
          <p
            className="admin-page__meta"
            data-testid="admin-shell-state"
            aria-live="polite"
            aria-atomic="false"
          >
            <span className="admin-badge">{variantTitle(form.variant)}</span> ·{" "}
            {describeVariant(form.variant)} ·{" "}
            <span
              className={authoringLifecycleBadgeClass(authoringLifecycle)}
              data-testid="admin-authoring-lifecycle"
              data-lifecycle={authoringLifecycle}
            >
              {authoringLifecycleLabel(authoringLifecycle)}
            </span>{" "}
            ·{" "}
            <span
              className={
                lifecycle === "live"
                  ? "admin-badge admin-badge--active"
                  : lifecycle === "retired"
                    ? "admin-badge admin-badge--hidden"
                    : "admin-badge admin-badge--warn"
              }
              data-testid="admin-shell-catalog-lifecycle"
            >
              {lifecycle}
            </span>{" "}
            · last published {updatedAtLabel} ·{" "}
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
              {footprintProof.aligned ? "" : " · drawing does not match footprint"}
            </span>
          </p>
        </div>
        {/* ADM-SHELL-02: primary Publish only; secondary/destructive stay outline */}
        <div className="admin-page__actions" data-testid="admin-shell-actions">
          <Link
            href="/admin/svg-editor"
            className="admin-btn admin-btn--outline"
            data-testid="admin-shell-secondary-back"
          >
            <ArrowLeft size={14} aria-hidden />
            Back
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={handleResetToPublished}
            disabled={feedback.submitting || !formDirty}
            data-testid="admin-shell-destructive-reset"
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
            data-testid="admin-shell-secondary-approve"
          >
            Approve for buyers
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handlePublish}
            disabled={!canPublish}
            aria-describedby="admin-svg-publication-impact"
            data-testid="admin-shell-primary-action"
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

      {/* ADM-STATE-02 — editability explicit before write */}
      <p
        className="admin-page__meta"
        data-testid="admin-data-source-editability"
        data-editable={
          lifecycle === "retired" || !onPublishAction ? "false" : "true"
        }
      >
        {formatDataSourceBanner(
          declareSvgEditSources({
            catalogLifecycle: lifecycle,
            hasOnPublishAction: Boolean(onPublishAction),
          }),
        )}
      </p>

      {/* ADM-MOB-02 — declare unsupported phone authoring before work */}
      <p
        className="admin-page__meta admin-phone-authoring-notice"
        data-testid="admin-phone-authoring-notice"
      >
        {phoneAuthoringBlockedMessage()}
      </p>

      <p
        id="admin-svg-publication-impact"
        className="admin-page__meta"
        data-testid="admin-svg-publication-impact"
      >
        {publishImpactSummary({
          targetSlug: publishTarget,
          draftSchemaVersion: String(descriptor.schemaVersion),
          liveArtifactState: artifactStatus.state,
          liveRevisionShort: artifactStatus.hash ? artifactHashShort : null,
        })}{" "}
        Authoring state:{" "}
        <strong>{authoringLifecycleLabel(authoringLifecycle)}</strong>.
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
              Publication is blocked. Fix the linked validation errors and the
              draft preview before publishing.
            </p>
          ) : null}
          <p className="admin-page__meta">
            Visual difference: compare <strong>Draft preview</strong> with{" "}
            <strong>Published symbol</strong>.
          </p>
        </div>
      ) : null}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="admin-svg-engine-feedback"
        data-testid="admin-svg-a11y-live-feedback"
      >
        {feedback.submitting ? (
          <div
            role="status"
            className="admin-alert admin-alert--info" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}
            aria-busy="true"
          >
            <Loader2 size={16} className="animate-spin shrink-0" aria-hidden />
            <span>
              Publishing <code>{slug}</code>… saving draft and releasing the
              Planner symbol.
            </span>
          </div>
        ) : null}
        {feedback.errorMessage ? (
          <div
            role="alert"
            className="admin-alert admin-alert--error" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}
            data-testid="admin-svg-publish-failure"
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
            className="admin-alert admin-alert--info" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}
            data-testid="admin-svg-publish-success"
          >
            <CheckCircle size={16} className="shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">
              {feedback.successMessage}
              {feedback.publishedSlug ? (
                <>
                  {" "}
                  <a
                    href={releasedSvgHref(feedback.publishedSlug)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="admin-svg-publish-success-artifact"
                  >
                    Open released SVG
                  </a>
                  {" · "}
                  <Link
                    href={PLANNER_VERIFY_HREF}
                    data-testid="admin-svg-publish-success-planner"
                  >
                    Verify in Planner
                  </Link>
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
        data-stage-grid-columns={STAGE_GRID_COLUMNS}
        data-authoring-width-px={AUTHORING_WIDTH_PX}
        data-stage-min-fraction={STAGE_MIN_FRACTION}
        data-stage-meets-min-at-1280={
          stageMeetsMinimumAt1280() ? "true" : "false"
        }
      >
        <section
          aria-label="Visual authoring studio"
          className="admin-svg-engine-shell__stage"
          data-testid="admin-svg-engine-stage"
          data-region="stage-column"
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
          <div className="admin-panel admin-svg-engine-shell__panel" data-testid="admin-svg-ai-panel">
            <div className="admin-panel__header">✨ AI Generate</div>
            <div className="admin-panel__body">
              <p className="admin-page__meta">
                Generate an SVG footprint from a text prompt.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const prompt = new FormData(form).get("prompt") as string;
                  if (!prompt) return;
                  
                  const btn = form.querySelector('button');
                  if (btn) btn.disabled = true;
                  
                  try {
                    const res = await fetch("/api/admin/svg-editor/ai-generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ prompt }),
                    });
                    const data = await res.json();
                    if (data.success && data.svg) {
                      // Inject the generated SVG directly into the studio document
                      handleStudioDocumentChange(data.svg);
                    } else {
                      alert(data.error?.message || "Generation failed");
                    }
                  } catch (err) {
                    alert("Generation failed");
                  } finally {
                    if (btn) btn.disabled = false;
                  }
                }}
                className="admin-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
              >
                <div className="admin-field">
                  <label className="admin-field__label" htmlFor="ai-prompt">Prompt</label>
                  <input
                    id="ai-prompt"
                    type="text"
                    name="prompt"
                    placeholder="e.g. Minimalist top-down office chair"
                    className="admin-field__input"
                    required
                  />
                </div>
                <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">
                  Generate SVG
                </button>
              </form>
            </div>
          </div>

          <div className="admin-panel admin-svg-engine-shell__panel">
            <div className="admin-panel__header">Draft preview</div>
            <div className="admin-panel__body">
              <LiveCompiledSvgPreview
                result={preview}
                pending={previewPending}
                meta={{
                  identity: stageMeta.identity,
                  footprint: stageMeta.footprint,
                  validation: stageMeta.validation,
                }}
              />
            </div>
          </div>

          <article
            className="admin-panel admin-svg-engine-shell__panel"
            data-artifact-state={artifactStatus.state}
            data-testid="admin-svg-artifact-panel"
          >
            <div className="admin-panel__header">Published symbol</div>
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
                      ? "Needs attention"
                      : "Missing"}
                </span>{" "}
                {artifactStatus.bytes > 0
                  ? formatBytes(artifactStatus.bytes)
                  : "No published symbol yet"}{" "}
                · checksum{" "}
                <code className="admin-page__checksum">{artifactHashShort}</code>
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
                      className="admin-alert admin-alert--info" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}
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
                      className="admin-alert admin-alert--warn" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}
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
