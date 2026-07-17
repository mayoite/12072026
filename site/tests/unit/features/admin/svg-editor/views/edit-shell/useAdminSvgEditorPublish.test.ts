import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { MutableRefObject } from "react";

import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import type { PublishDescriptorResult } from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import type { SvgSceneDocument } from "@/features/admin/svg-editor/scene/svgSceneDocument";
import { sceneFromDescriptor } from "@/features/admin/svg-editor/scene/sceneFromDescriptor";
import {
  INITIAL_FEEDBACK,
  useAdminSvgEditorPublish,
  type AdminSvgStudioDocument,
} from "@/features/admin/svg-editor/views/edit-shell/useAdminSvgEditorPublish";

const { browserApiFetch } = vi.hoisted(() => ({
  browserApiFetch: vi.fn(),
}));

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch,
}));

function makeRefs(form: SvgEditorFormState, scene: SvgSceneDocument) {
  const formRef: MutableRefObject<SvgEditorFormState> = { current: form };
  const draftRevisionRef: MutableRefObject<number> = { current: 0 };
  const studioDocumentRef: MutableRefObject<AdminSvgStudioDocument> = {
    current: scene,
  };
  const studioDocumentGetterRef: MutableRefObject<
    (() => AdminSvgStudioDocument) | null
  > = { current: null };
  return {
    formRef,
    draftRevisionRef,
    studioDocumentRef,
    studioDocumentGetterRef,
  };
}

function setupHook(
  overrides: {
    footprintAligned?: boolean;
    coreFieldIssuesCount?: number;
    previewPending?: boolean;
    previewOk?: boolean;
    onPublishAction?: (
      data: SvgEditorFormState,
    ) => Promise<PublishDescriptorResult>;
    openedBaselineGeneratedAt?: number;
    lifecycle?: "draft" | "live" | "retired";
    artifactState?: "published" | "missing" | "stale";
  } = {},
) {
  const descriptor = makeNewBlockDescriptorStub();
  const form = descriptorToFormState(descriptor);
  const scene = sceneFromDescriptor(descriptor);
  const refs = makeRefs(form, scene);

  const setLifecycle = vi.fn();
  const setPublishedForm = vi.fn();
  const setPublishedFormSignature = vi.fn();
  const setPublishedStudioScene = vi.fn();
  const setStudioResetKey = vi.fn();
  const updateDraftForm = vi.fn();
  const refreshRoute = vi.fn();

  const hook = renderHook(() =>
    useAdminSvgEditorPublish({
      slug: descriptor.slug,
      descriptor,
      artifactStatus: {
        state: overrides.artifactState ?? "published",
        bytes: 1,
        updatedAt: 1,
        hash: "abcdef0123456789deadbeef",
        publicUrl: "/symbol.svg",
        markup: "<svg></svg>",
      },
      openedBaselineGeneratedAt:
        overrides.openedBaselineGeneratedAt ?? descriptor.generatedAt,
      lifecycle: overrides.lifecycle ?? "draft",
      setLifecycle,
      form,
      formRef: refs.formRef,
      publishedForm: form,
      setPublishedForm,
      setPublishedFormSignature,
      setPublishedStudioScene,
      draftRevisionRef: refs.draftRevisionRef,
      studioDocumentRef: refs.studioDocumentRef,
      studioDocumentGetterRef: refs.studioDocumentGetterRef,
      setStudioResetKey,
      updateDraftForm,
      preview:
        overrides.previewOk === false
          ? { ok: false, issues: [{ path: "x", message: "bad" }] }
          : { ok: true, issues: [] },
      previewPending: overrides.previewPending ?? false,
      publishTarget: form.slug,
      footprintAligned: overrides.footprintAligned ?? true,
      coreFieldIssuesCount: overrides.coreFieldIssuesCount ?? 0,
      onPublishAction: overrides.onPublishAction,
      refreshRoute,
    }),
  );

  return {
    ...hook,
    descriptor,
    form,
    setLifecycle,
    setPublishedForm,
    setPublishedFormSignature,
    setPublishedStudioScene,
    setStudioResetKey,
    updateDraftForm,
    refreshRoute,
    refs,
  };
}

describe("useAdminSvgEditorPublish", () => {
  beforeEach(() => {
    browserApiFetch.mockReset();
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes a neutral initial feedback state", () => {
    expect(INITIAL_FEEDBACK).toEqual({
      submitting: false,
      errorMessage: null,
      successMessage: null,
      publishedSlug: null,
    });
  });

  it("builds publish impact label from artifact + schema", () => {
    const { result, descriptor } = setupHook();
    expect(result.current.publishImpactLabel).toContain(descriptor.slug);
    expect(result.current.publishImpactLabel).toContain("abcdef0123456789");
    expect(result.current.plannerVerifyHref).toBe("/planner/guest");
    expect(result.current.publishArtifactHref("x")).toBe("/svg-catalog/x.svg");
  });

  it("clearFeedback wipes error/success without touching submitting", async () => {
    const { result } = setupHook();
    await act(async () => {
      result.current.setFeedback({
        submitting: true,
        errorMessage: "e",
        successMessage: "s",
        publishedSlug: "x",
      });
    });
    await act(async () => {
      result.current.clearFeedback();
    });
    expect(result.current.feedback).toEqual({
      submitting: true,
      errorMessage: null,
      successMessage: null,
      publishedSlug: null,
    });
  });

  it("skips approve when artifact not published or already live", async () => {
    const missing = setupHook({ artifactState: "missing" });
    await act(async () => {
      await missing.result.current.handleApproveForBuyers();
    });
    expect(browserApiFetch).not.toHaveBeenCalled();
    missing.unmount();

    const live = setupHook({ lifecycle: "live" });
    await act(async () => {
      await live.result.current.handleApproveForBuyers();
    });
    expect(browserApiFetch).not.toHaveBeenCalled();
  });

  it("approves for buyers via lifecycle PATCH and refreshes", async () => {
    browserApiFetch.mockResolvedValue({ ok: true });
    const { result, setLifecycle, refreshRoute, descriptor } = setupHook();

    await act(async () => {
      await result.current.handleApproveForBuyers();
    });

    expect(browserApiFetch).toHaveBeenCalledWith(
      `/api/admin/svg-editor/${descriptor.slug}/lifecycle`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ state: "live" }),
      }),
    );
    expect(setLifecycle).toHaveBeenCalledWith("live");
    expect(refreshRoute).toHaveBeenCalledWith(descriptor.slug);
    expect(result.current.approving).toBe(false);
  });

  it("does not set live lifecycle when approve response is not ok", async () => {
    browserApiFetch.mockResolvedValue({ ok: false });
    const { result, setLifecycle, refreshRoute } = setupHook();

    await act(async () => {
      await result.current.handleApproveForBuyers();
    });

    expect(setLifecycle).not.toHaveBeenCalled();
    expect(refreshRoute).not.toHaveBeenCalled();
  });

  it("blocks publish when draft is stale", async () => {
    // Client opened with a different stamp than server descriptor.generatedAt.
    const { result } = setupHook({
      openedBaselineGeneratedAt: 1,
    });
    await act(async () => {
      await result.current.handlePublish();
    });
    expect(result.current.feedback.errorMessage).toMatch(
      /baseline changed|missing baseline|stale|reload/i,
    );
  });

  it("blocks publish when footprint is not aligned", async () => {
    const { result } = setupHook({ footprintAligned: false });
    await act(async () => {
      await result.current.handlePublish();
    });
    expect(result.current.feedback.errorMessage).toMatch(/view box does not match/i);
  });

  it("blocks publish when core field issues exist (singular and plural)", async () => {
    const one = setupHook({ coreFieldIssuesCount: 1 });
    await act(async () => {
      await one.result.current.handlePublish();
    });
    expect(one.result.current.feedback.errorMessage).toMatch(
      /1 product field issue under Product details/i,
    );
    one.unmount();

    const many = setupHook({ coreFieldIssuesCount: 3 });
    await act(async () => {
      await many.result.current.handlePublish();
    });
    expect(many.result.current.feedback.errorMessage).toMatch(
      /3 product field issues under Product details/i,
    );
  });

  it("blocks publish while preview pending or invalid", async () => {
    const pending = setupHook({ previewPending: true });
    await act(async () => {
      await pending.result.current.handlePublish();
    });
    expect(pending.result.current.feedback.errorMessage).toMatch(
      /still being checked/i,
    );
    pending.unmount();

    const bad = setupHook({ previewOk: false });
    await act(async () => {
      await bad.result.current.handlePublish();
    });
    expect(bad.result.current.feedback.errorMessage).toMatch(
      /valid Planner preview/i,
    );
  });

  it("aborts publish when user cancels confirm", async () => {
    window.confirm = vi.fn(() => false);
    const onPublishAction = vi.fn();
    const { result } = setupHook({ onPublishAction });
    await act(async () => {
      await result.current.handlePublish();
    });
    expect(onPublishAction).not.toHaveBeenCalled();
    expect(result.current.feedback.submitting).toBe(false);
  });

  it("reports error when no publish action is wired", async () => {
    const { result } = setupHook();
    await act(async () => {
      await result.current.handlePublish();
    });
    expect(result.current.feedback.errorMessage).toMatch(
      /no server action wired/i,
    );
  });

  it("reports publish failure from action result", async () => {
    const onPublishAction = vi.fn().mockResolvedValue({
      success: false,
      error: "pipeline exploded",
    } satisfies PublishDescriptorResult);
    const { result, descriptor } = setupHook({ onPublishAction });

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(result.current.feedback.errorMessage).toContain(descriptor.slug);
    expect(result.current.feedback.errorMessage).toContain("pipeline exploded");
    expect(result.current.feedback.submitting).toBe(false);
  });

  it("publishes successfully and advances baseline", async () => {
    const onPublishAction = vi.fn().mockResolvedValue({
      success: true,
      descriptor: {
        ...makeNewBlockDescriptorStub(),
        slug: "published-slug",
      },
    } satisfies PublishDescriptorResult);

    const { result, setPublishedForm, setPublishedFormSignature, refreshRoute, descriptor } =
      setupHook({ onPublishAction });

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(onPublishAction).toHaveBeenCalledTimes(1);
    const payload = onPublishAction.mock.calls[0]?.[0];
    expect(payload?.openedBaselineGeneratedAt).toBe(descriptor.generatedAt);
    expect(setPublishedForm).toHaveBeenCalled();
    expect(setPublishedFormSignature).toHaveBeenCalled();
    expect(result.current.feedback.successMessage).toMatch(/Published/);
    expect(result.current.feedback.publishedSlug).toBe("published-slug");
    expect(refreshRoute).toHaveBeenCalledWith("published-slug");
  });

  it("surfaces network exceptions as publish failure", async () => {
    const onPublishAction = vi
      .fn()
      .mockRejectedValue(new Error("network down"));
    const { result } = setupHook({ onPublishAction });

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(result.current.feedback.errorMessage).toMatch(/network down/);
    expect(result.current.feedback.submitting).toBe(false);
  });
});
