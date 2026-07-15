"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

import { descriptorToFormState } from "../../form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "../../form/svgEditorFormState";
import {
  advancePublishedDraft,
} from "../../lifecycle/svgEditorDraftState";
import type { CatalogLifecycleState } from "../../lifecycle/catalogLifecycle.shared";
import { assertDraftNotStale } from "../../lifecycle/staleDraftPublishGate";
import { sceneFromDescriptor } from "../../scene/sceneFromDescriptor";
import type { SvgSceneDocument } from "../../scene/svgSceneDocument";
import {
  PLANNER_VERIFY_HREF,
  publishConfirmMessage,
  publishFailureMessage,
  publishImpactSummary,
  publishSuccessMessage,
  releasedSvgHref,
} from "../../publish/publishActionMessages";
import type { PublishDescriptorResult } from "../../publish/publishDescriptorWithPipeline";
import type { SvgArtifactStatus } from "../../publish/svgArtifactStatus.server";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

export interface FeedbackState {
  readonly submitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly publishedSlug: string | null;
}

export const INITIAL_FEEDBACK: FeedbackState = {
  submitting: false,
  errorMessage: null,
  successMessage: null,
  publishedSlug: null,
};

export interface AdminSvgStudioSnapshot {
  readonly svg?: string;
  readonly excalidrawElements?: unknown;
}

export type AdminSvgStudioDocument =
  | SvgSceneDocument
  | AdminSvgStudioSnapshot;

interface PreviewResult {
  readonly ok: boolean;
  readonly issues?: ReadonlyArray<{ path: string; message: string }>;
}

interface UseAdminSvgEditorPublishArgs {
  readonly slug: string;
  readonly descriptor: BlockDescriptor;
  readonly artifactStatus: SvgArtifactStatus;
  readonly openedBaselineGeneratedAt: number;
  readonly lifecycle: CatalogLifecycleState;
  readonly setLifecycle: Dispatch<SetStateAction<CatalogLifecycleState>>;
  readonly form: SvgEditorFormState;
  readonly formRef: MutableRefObject<SvgEditorFormState>;
  readonly publishedForm: SvgEditorFormState;
  readonly setPublishedForm: Dispatch<SetStateAction<SvgEditorFormState>>;
  readonly setPublishedFormSignature: Dispatch<SetStateAction<string>>;
  readonly setPublishedStudioScene: Dispatch<SetStateAction<SvgSceneDocument>>;
  readonly draftRevisionRef: MutableRefObject<number>;
  readonly studioDocumentRef: MutableRefObject<AdminSvgStudioDocument>;
  readonly studioDocumentGetterRef: MutableRefObject<
    (() => AdminSvgStudioDocument) | null
  >;
  readonly setStudioResetKey: Dispatch<SetStateAction<number>>;
  readonly updateDraftForm: Dispatch<SetStateAction<SvgEditorFormState>>;
  readonly preview: PreviewResult | null;
  readonly previewPending: boolean;
  readonly publishTarget: string;
  readonly footprintAligned: boolean;
  readonly coreFieldIssuesCount: number;
  readonly onPublishAction?: (
    data: SvgEditorFormState,
  ) => Promise<PublishDescriptorResult>;
  readonly refreshRoute: () => void;
}

function nowStampLabel(): string {
  return new Date().toISOString().replace("T", " ").replace(/\..*$/, " UTC");
}

function getStudioSvg(document: AdminSvgStudioDocument): string | undefined {
  return "svg" in document ? document.svg : undefined;
}

function getStudioElements(
  document: AdminSvgStudioDocument,
): unknown | undefined {
  return "excalidrawElements" in document
    ? document.excalidrawElements
    : undefined;
}

export function useAdminSvgEditorPublish({
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
  footprintAligned,
  coreFieldIssuesCount,
  onPublishAction,
  refreshRoute,
}: UseAdminSvgEditorPublishArgs) {
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [approving, setApproving] = useState(false);

  const publishImpactLabel = useMemo(
    () =>
      publishImpactSummary({
        targetSlug: publishTarget,
        draftSchemaVersion: String(descriptor.schemaVersion),
        liveArtifactState: artifactStatus.state,
        liveRevisionShort: artifactStatus.hash
          ? `${artifactStatus.hash.slice(0, 16)}...`
          : null,
      }),
    [
      artifactStatus.hash,
      artifactStatus.state,
      descriptor.schemaVersion,
      publishTarget,
    ],
  );

  const clearFeedback = useCallback(() => {
    setFeedback((prev) => ({
      ...prev,
      errorMessage: null,
      successMessage: null,
      publishedSlug: null,
    }));
  }, []);

  const handleApproveForBuyers = useCallback(async () => {
    if (artifactStatus.state !== "published" || lifecycle === "live") return;
    setApproving(true);
    try {
      const response = await browserApiFetch(
        apiPath(`/api/admin/svg-editor/${slug}/lifecycle`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: "live" }),
        },
      );
      if (!response.ok) return;
      setLifecycle("live");
      refreshRoute();
    } finally {
      setApproving(false);
    }
  }, [
    artifactStatus.state,
    lifecycle,
    refreshRoute,
    setLifecycle,
    slug,
  ]);

  const handlePublish = useCallback(async () => {
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

    if (!footprintAligned) {
      setFeedback({
        submitting: false,
        errorMessage:
          "Publish is blocked because the SVG view box does not match the product width and depth in millimetres.",
        successMessage: null,
        publishedSlug: null,
      });
      return;
    }

    if (coreFieldIssuesCount > 0) {
      setFeedback({
        submitting: false,
        errorMessage: `Publish is blocked: fix ${coreFieldIssuesCount} core field ${coreFieldIssuesCount === 1 ? "error" : "errors"} (see Advanced block fields).`,
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

    if (
      !window.confirm(
        publishConfirmMessage({
          targetSlug: publishTarget,
          draftSchemaVersion: String(descriptor.schemaVersion),
          liveArtifactState: artifactStatus.state,
          liveRevisionShort: artifactStatus.hash
            ? `${artifactStatus.hash.slice(0, 16)}...`
            : null,
        }),
      )
    ) {
      return;
    }

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
      const payload: SvgEditorFormState = {
        ...form,
        excalidrawElements:
          getStudioElements(studioDocumentRef.current) ?? form.excalidrawElements,
        compiledSvg: getStudioSvg(studioDocumentRef.current) ?? "",
      };
      const submittedFormSignature = JSON.stringify(payload);
      const submittedSceneSignature = JSON.stringify(submittedScene);
      const submittedRevision = draftRevisionRef.current;
      const result = await onPublishAction(payload);

      if (result.success === false) {
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

      const authoritativeFormSignature = JSON.stringify(
        authoritativePublishedForm,
      );
      const authoritativeSceneSignature = JSON.stringify(
        authoritativePublishedScene,
      );
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
        successMessage: publishSuccessMessage(publishedSlug, nowStampLabel()),
        publishedSlug,
      });
      refreshRoute();
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
    coreFieldIssuesCount,
    descriptor.generatedAt,
    descriptor.schemaVersion,
    draftRevisionRef,
    footprintAligned,
    form,
    formRef,
    onPublishAction,
    openedBaselineGeneratedAt,
    preview,
    previewPending,
    publishTarget,
    publishedForm,
    refreshRoute,
    setPublishedForm,
    setPublishedFormSignature,
    setPublishedStudioScene,
    setStudioResetKey,
    slug,
    studioDocumentGetterRef,
    studioDocumentRef,
    updateDraftForm,
  ]);

  return {
    approving,
    clearFeedback,
    feedback,
    handleApproveForBuyers,
    handlePublish,
    publishImpactLabel,
    setFeedback,
    plannerVerifyHref: PLANNER_VERIFY_HREF,
    publishArtifactHref: releasedSvgHref,
  };
}
