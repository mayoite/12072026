"use client";

/**
 * A4 — Admin SVG Editor per-slug edit view (canvas-first shell).
 *
 * Publish preview = server compile via useDebouncedCompile (same path as Publish).
 * Studio sketch is secondary drawing aid only — not release geometry.
 * Publish: formState (blocks/maker IR) → publishDescriptorWithPipeline.
 *
 * GS: semantic tokens only; no hex in tsx. Catalog publish SVG != Fabric plan-draw.
 *
 * ADM-STATE-01 / ADM-SVG-14: one authoritative lifecycle + field-level draft diff.
 * ADM-FORM-02 / ADM-PUB-01: linked field errors (SvgEditorForm) + publish blocking.
 * ADM-SVG-06: stage status shows identity, footprint, view box, zoom, selection,
 * draft, validation, and revision.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SetStateAction } from "react";
import { useRouter } from "next/navigation";

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { descriptorToFormState } from "../form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "../form/svgEditorFormState";
import { uploadAssetToSupabase } from "../publish/uploadAsset";
import type { SvgArtifactStatus } from "../publish/svgArtifactStatus.server";
import type { PublishDescriptorResult } from "../publish/publishDescriptorWithPipeline";
import type { CatalogLifecycleState } from "../lifecycle/catalogLifecycle.shared";
import { sceneFromDescriptor } from "../scene/sceneFromDescriptor";
import { resetEditorDraft } from "../lifecycle/svgEditorDraftState";
import {
  deriveAuthoringLifecycle,
  authoringLifecycleLabel,
} from "../lifecycle/authoringLifecycle";
import { validateCoreProductFields } from "../form/validateCoreProductFields";
import {
  confirmDiscardUnsavedNavigation,
  confirmResetToPublished,
} from "../contracts/destructiveConfirmMessages";
import { countActiveExcalidrawElements } from "../editor/excalidrawDocumentGuards";
import { AdminSvgEditorShell } from "./edit-shell/AdminSvgEditorShell";
import {
  type AdminSvgStudioDocument,
  useAdminSvgEditorPublish,
} from "./edit-shell/useAdminSvgEditorPublish";
import { useDebouncedCompile } from "../publish/useDebouncedCompile";

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
  const router = useRouter();

  // Controlled form state, seeded from the persisted descriptor.
  const [form, setForm] = useState<SvgEditorFormState>(() =>
    descriptorToFormState(descriptor),
  );
  /** Baseline stamp at open â€” DB-SVG-09 stale draft detection. */
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

  // Studio sketch SVG (drawing aid only — not publish geometry authority).
  const [excalidrawSvg, setExcalidrawSvg] = useState("");

  // Compile-relevant IR only. Omit studio sketch elements so Excalidraw redraw
  // does not thrash the server preview debounce.
  const formForCompile = useMemo((): SvgEditorFormState => {
    return {
      variant: form.variant,
      slug: form.slug,
      sku: form.sku,
      sourceProvenance: form.sourceProvenance,
      createdBy: form.createdBy,
      geometry: form.geometry,
      viewBox: form.viewBox,
      mounting: form.mounting,
      liveAnnouncementCategories: form.liveAnnouncementCategories,
      rovingFocus: form.rovingFocus,
      mountingPoints: form.mountingPoints,
      blocks: form.blocks,
      themeTokens: form.themeTokens,
      configurableSizingType: form.configurableSizingType,
      configurableSizeOptions: form.configurableSizeOptions,
      parameterSchema: form.parameterSchema,
      assetsGlbUrl: form.assetsGlbUrl,
      assetsSvgUrl: form.assetsSvgUrl,
      sceneViewBox: form.sceneViewBox,
      sceneParts: form.sceneParts,
      openedBaselineGeneratedAt: form.openedBaselineGeneratedAt,
    };
  }, [
    form.assetsGlbUrl,
    form.assetsSvgUrl,
    form.blocks,
    form.configurableSizeOptions,
    form.configurableSizingType,
    form.createdBy,
    form.geometry,
    form.liveAnnouncementCategories,
    form.mounting,
    form.mountingPoints,
    form.openedBaselineGeneratedAt,
    form.parameterSchema,
    form.rovingFocus,
    form.sceneParts,
    form.sceneViewBox,
    form.sku,
    form.slug,
    form.sourceProvenance,
    form.themeTokens,
    form.variant,
    form.viewBox,
  ]);

  const { result: preview, pending: previewPending } = useDebouncedCompile(
    slug,
    formForCompile,
    { delayMs: 300 },
  );

  // SVG → GLB flow, fed by the server-compiled preview SVG (no file picker).
  const [glbSourceSvg, setGlbSourceSvg] = useState<string | null>(null);
  const [glbUrl, setGlbUrl] = useState<string>("");
  const [glbUploading, setGlbUploading] = useState(false);
  const [glbUploadError, setGlbUploadError] = useState<string | null>(null);

  const compiledSvg =
    preview?.ok === true && typeof preview.svg === "string" && preview.svg.trim()
      ? preview.svg
      : null;

  const makerRecipe =
    descriptor.maker && typeof descriptor.maker.recipe === "string"
      ? descriptor.maker.recipe
      : null;

  const blockCount =
    form.blocks.length > 0
      ? form.blocks.length
      : (form.sceneParts?.length ?? 0);

  const publishIrStrip = makerRecipe
    ? `maker: ${makerRecipe}`
    : `${blockCount} blocks · ${form.variant}`;

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
            "Upload returned no URL â€” blob preview still available locally.",
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

  // A4.1 â€” starter scene for the visual studio, seeded from the descriptor.
  const studioScene = useMemo(() => sceneFromDescriptor(descriptor), [descriptor]);
  const [publishedStudioScene, setPublishedStudioScene] = useState(studioScene);
  const formSignature = useMemo(() => JSON.stringify(form), [form]);
  const formDirty = formSignature !== publishedFormSignature;
  const [studioResetKey, setStudioResetKey] = useState(0);
  const studioDocumentGetterRef = useRef<(() => AdminSvgStudioDocument) | null>(
    null,
  );
  const studioDocumentRef = useRef<AdminSvgStudioDocument>(studioScene);
  const studioInitializedRef = useRef(false);

  const handleStudioDocumentChange = useCallback((svg: string, excalidrawElements: unknown) => {
    const activeCount = countActiveExcalidrawElements(excalidrawElements);
    studioDocumentRef.current = { svg, excalidrawElements };
    if (!studioInitializedRef.current) {
      studioInitializedRef.current = true;
      const initializedForm = {
        ...formRef.current,
        excalidrawElements,
      };
      formRef.current = initializedForm;
      setForm(initializedForm);
      setPublishedForm(initializedForm);
      setPublishedFormSignature(JSON.stringify(initializedForm));
    } else {
      updateDraftForm((prev) => ({
        ...prev,
        excalidrawElements,
      }));
    }

    // Ignore empty / deleted-only scenes so publish stays blocked.
    setExcalidrawSvg(activeCount > 0 ? svg : "");
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
  }, [formDirty, slug]);

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

  const coreFieldIssues = useMemo(
    () => validateCoreProductFields(form),
    [form],
  );
  const {
    approving,
    clearFeedback,
    feedback,
    handleApproveForBuyers,
    handlePublish,
    plannerVerifyHref,
    publishArtifactHref,
    publishImpactLabel,
    setFeedback,
  } = useAdminSvgEditorPublish({
    slug,
    descriptor,
    artifactStatus,
    openedBaselineGeneratedAt,
    lifecycle,
    setLifecycle,
    form,
    formRef,
    publishedForm,
    setPublishedForm,
    setPublishedFormSignature,
    setPublishedStudioScene,
    draftRevisionRef,
    studioDocumentRef,
    studioDocumentGetterRef,
    setStudioResetKey,
    updateDraftForm,
    preview,
    previewPending,
    publishTarget,
    footprintAligned: footprintProof.aligned,
    coreFieldIssuesCount: coreFieldIssues.length,
    onPublishAction,
    refreshRoute: (publishedSlug) => {
      router.replace(`/admin/svg-editor/${encodeURIComponent(publishedSlug)}`);
    },
  });

  const canConvertToGlb = form.variant === "fixed" && compiledSvg !== null;

  const handleExportAction = useCallback(
    (action: "download-svg" | "download-descriptor" | "open-planner") => {
      const productSlug = form.slug.trim() || slug;
      if (action === "open-planner") {
        window.open(plannerVerifyHref, "_blank", "noopener,noreferrer");
        return;
      }
      if (action === "download-svg") {
        // Prefer server-compiled publish SVG; studio sketch is last resort only.
        const svg =
          (preview?.ok === true && preview.svg?.trim() ? preview.svg : null) ||
          (excalidrawSvg.trim() ? excalidrawSvg : null);
        if (!svg) {
          window.open(publishArtifactHref(productSlug), "_blank", "noopener,noreferrer");
          return;
        }
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${productSlug || "symbol"}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      // download-descriptor
      const payload = {
        slug: productSlug,
        sku: form.sku,
        geometry: form.geometry,
        viewBox: form.viewBox,
        excalidrawElements: form.excalidrawElements,
        assetsGlbUrl: form.assetsGlbUrl,
      };
      const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productSlug || "descriptor"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [
      excalidrawSvg,
      form.assetsGlbUrl,
      form.excalidrawElements,
      form.geometry,
      form.sku,
      form.slug,
      form.viewBox,
      plannerVerifyHref,
      preview,
      publishArtifactHref,
      slug,
    ],
  );

  // ADM-STATE-01: one authoritative authoring lifecycle.
  const authoringLifecycle = deriveAuthoringLifecycle({
    submitting: feedback.submitting,
    errorMessage: feedback.errorMessage,
    successMessage: feedback.successMessage,
    previewPending,
    previewOk: preview === null ? null : preview.ok === true,
    formDirty,
  });

  const formIssues = useMemo(() => {
    const previewIssues = preview?.issues ?? [];
    const corePaths = new Set(coreFieldIssues.map((issue) => issue.path));
    return [
      ...coreFieldIssues,
      ...previewIssues.filter((issue) => !corePaths.has(issue.path)),
    ];
  }, [coreFieldIssues, preview?.issues]);

  // Publish gate: server compile ok + svg payload. Do not require Excalidraw
  // non-blank when blocks/maker exist — studio sketch is not release geometry.
  const canPublish =
    Boolean(onPublishAction) &&
    (formDirty || artifactStatus.state !== "published") &&
    !feedback.submitting &&
    !previewPending &&
    preview?.ok === true &&
    Boolean(preview.svg?.trim()) &&
    footprintProof.aligned &&
    coreFieldIssues.length === 0;

  const validationStatus =
    authoringLifecycle === "validating" || previewPending
      ? "Checking draft"
      : authoringLifecycle === "invalid" || preview?.ok === false
        ? `Publish blocked${preview?.issues?.length ? ` (${preview.issues.length} issues)` : ""}`
        : preview?.ok === true
          ? footprintProof.aligned
            ? "Draft ready"
            : "Publish blocked — footprint mismatch"
          : "Waiting for draft preview";
  const stageMeta = {
    identity: `${publishTarget} \u00B7 SKU ${form.sku.trim() || "\u2014"}`,
    footprint: `Footprint ${footprintProof.widthMm}\u00D7${footprintProof.depthMm} mm`,
    draft: authoringLifecycleLabel(authoringLifecycle),
    validation: validationStatus,
    revision:
      artifactStatus.state === "missing"
        ? "Never published"
        : `Last published ${updatedAtLabel}`,
  };

  return (
    <AdminSvgEditorShell
      slug={slug}
      updatedAtLabel={updatedAtLabel}
      form={form}
      formDirty={formDirty}
      formIssues={formIssues}
      coreFieldIssuesCount={coreFieldIssues.length}
      preview={preview}
      previewPending={previewPending}
      makerRecipe={makerRecipe}
      publishIrStrip={publishIrStrip}
      studioSketchSvg={excalidrawSvg}
      feedback={feedback}
      authoringLifecycle={authoringLifecycle}
      lifecycle={lifecycle}
      artifactStatus={artifactStatus}
      publishImpactLabel={publishImpactLabel}
      approving={approving}
      canPublish={canPublish}
      canConvertToGlb={canConvertToGlb}
      glbSourceSvg={glbSourceSvg}
      glbUrl={glbUrl}
      glbUploading={glbUploading}
      glbUploadError={glbUploadError}
      stageMeta={stageMeta}
      studioResetKey={studioResetKey}
      plannerVerifyHref={plannerVerifyHref}
      publishArtifactHref={publishArtifactHref}
      onFormChange={updateDraftForm}
      onDismissFeedback={clearFeedback}
      onResetToPublished={handleResetToPublished}
      onApproveForBuyers={() => void handleApproveForBuyers()}
      onPublish={() => void handlePublish()}
      onExportAction={handleExportAction}
      onStartGlbConversion={startGlbConversion}
      onGlbGenerated={handleGlbGenerated}
      onDocument={handleStudioDocumentChange}
      onError={(message) =>
        setFeedback((prev) => ({ ...prev, errorMessage: message }))
      }
    />
  );
}

export default AdminSvgEditorEditView;
