import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { SvgSceneDocument } from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import type { SvgEditorFormState } from "@/features/planner/admin/svg-editor/svgEditorFormState";

const refresh = vi.fn();
const studioMetrics = vi.hoisted(() => ({ mounts: 0 }));
const formControls = vi.hoisted(() => ({ edit: null as (() => void) | null }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/features/planner/admin/svg-editor/useDebouncedCompile", () => ({
  useDebouncedCompile: () => ({ result: { ok: true, svg: "<svg></svg>", issues: [] }, pending: false }),
}));
vi.mock("@/features/planner/admin/svg-editor/SvgEditorForm", () => ({
  SvgEditorForm: (props: Record<string, unknown>) => {
    formControls.edit = () => {
      const state = props.state as SvgEditorFormState;
      const onChange = props.onChange as (next: SvgEditorFormState) => void;
      onChange({ ...state, sku: `${state.sku}-edited` });
    };
    return <><span data-testid="form-sku">{(props.state as SvgEditorFormState).sku}</span><button type="button" onClick={() => formControls.edit?.()}>Edit field</button></>;
  },
}));
vi.mock("@/features/planner/admin/svg-editor/LiveCompiledSvgPreview", () => ({ LiveCompiledSvgPreview: () => null }));
vi.mock("@/features/planner/admin/svg-editor/PublishedSvgPreview", () => ({ PublishedSvgPreview: () => null }));
vi.mock("@/features/planner/admin/svg-editor/DescriptorRevisionPanel", () => ({ DescriptorRevisionPanel: () => null }));
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>) => {
      if (!String(loader).includes("SvgStudioCanvas")) return () => null;
      return function StudioStub(props: Record<string, unknown>) {
    const document = props.initialDocument as SvgSceneDocument | undefined;
    const [liveDocument, setLiveDocument] = useState(document);
    const [mountId] = useState(() => ++studioMetrics.mounts);
    const getterRef = props.documentGetterRef as MutableRefObject<(() => SvgSceneDocument) | null> | undefined;
    useEffect(() => {
      if (!getterRef || !liveDocument) return;
      getterRef.current = () => liveDocument;
      return () => { getterRef.current = null; };
    }, [getterRef, liveDocument]);
    if (!liveDocument) return null;
    return (
      <div>
        <span data-testid="studio-node-count">{liveDocument.nodes.length}</span>
        <span data-testid="studio-mount-id">{mountId}</span>
        <button
          type="button"
          onClick={() => {
            const onChange = props.onDocumentChange as ((next: SvgSceneDocument) => void) | undefined;
            const next = {
              ...liveDocument,
              nodes: [...liveDocument.nodes, {
                kind: "rect",
                id: `added-${liveDocument.nodes.length}`,
                name: "Added",
                locked: false,
                hidden: false,
                style: { fillToken: "currentColor", strokeToken: "currentColor", lineWeight: 1 },
                x: 1,
                y: 1,
                width: 1,
                height: 1,
              }],
            };
            setLiveDocument(next);
            onChange?.(next);
          }}
        >
          Edit studio
        </button>
      </div>
    );
      };
  },
}));

import { AdminSvgEditorEditView } from "@/features/planner/admin/svg-editor/AdminSvgEditorEditView";

const descriptor = JSON.parse(fs.readFileSync(path.join(process.cwd(), "block-descriptors/side-table-001.json"), "utf8")) as BlockDescriptor;
const artifactStatus = { state: "published" as const, bytes: 1, updatedAt: 1, hash: "hash", publicUrl: "/symbol.svg", markup: "<svg></svg>" };

describe("AdminSvgEditorEditView draft recovery", () => {
  beforeEach(() => {
    refresh.mockReset();
    studioMetrics.mounts = 0;
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    formControls.edit = null;
    vi.restoreAllMocks();
  });

  it("preserves field and studio edits made while publish is pending", async () => {
    let resolvePublish: ((value: { success: true; descriptor: BlockDescriptor }) => void) | undefined;
    const publish = vi.fn(() => new Promise<{ success: true; descriptor: BlockDescriptor }>((resolve) => { resolvePublish = resolve; }));
    render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" onPublishAction={publish} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(publish).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Edit field" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    const postSubmitCount = screen.getByTestId("studio-node-count").textContent;

    resolvePublish?.({ success: true, descriptor });
    await waitFor(() => expect(screen.getByRole("button", { name: "Publish" })).not.toBeDisabled());

    expect(screen.getByTestId("studio-node-count")).toHaveTextContent(postSubmitCount ?? "");
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
    expect(studioMetrics.mounts).toBe(1);
  });

  it("preserves a post-submit edit when success resolves in the same turn", async () => {
    let resolvePublish: ((value: { success: true; descriptor: BlockDescriptor }) => void) | undefined;
    const publish = vi.fn(() => new Promise<{ success: true; descriptor: BlockDescriptor }>((resolve) => { resolvePublish = resolve; }));
    render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" onPublishAction={publish} />);
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(publish).toHaveBeenCalledOnce());

    await act(async () => {
      formControls.edit?.();
      resolvePublish?.({ success: true, descriptor });
      await Promise.resolve();
    });

    expect(screen.getByTestId("form-sku")).toHaveTextContent(/-edited$/);
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
    expect(studioMetrics.mounts).toBe(1);
  });

  it("does not remount an unchanged successful publication", async () => {
    const publish = vi.fn(async () => ({ success: true as const, descriptor }));
    render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" onPublishAction={publish} />);
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(studioMetrics.mounts).toBe(1);
  });

  it("reset restores the scene from the latest successful publication", async () => {
    const publish = vi.fn(async (_draft: SvgEditorFormState) => ({
      success: true as const,
      descriptor: {
        ...descriptor,
        blocks: [
          ...(descriptor.blocks ?? []),
          { ...descriptor.blocks![0]!, id: "normalized-a" },
          { ...descriptor.blocks![0]!, id: "normalized-b" },
        ],
      },
    }));
    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={publish}
      />,
    );
    const originalCount = Number(screen.getByTestId("studio-node-count").textContent);

    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(publish).toHaveBeenCalledOnce());
    await screen.findByText(/Published “.*” at/);
    expect(screen.getByTestId("studio-node-count")).toHaveTextContent(String(originalCount + 2));
    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset to published" }));

    expect(screen.getByTestId("studio-node-count")).toHaveTextContent(String(originalCount + 2));
  });

  it("warns before unload only while the unified draft is dirty", () => {
    render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" />);

    const cleanExit = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(cleanExit);
    expect(cleanExit.defaultPrevented).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    const dirtyExit = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(dirtyExit);
    expect(dirtyExit.defaultPrevented).toBe(true);
  });

  it("keeps the dirty draft and avoids a false success after publish failure", async () => {
    const publish = vi.fn(async () => ({ success: false as const, error: "pipeline stopped" }));
    render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" onPublishAction={publish} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit field" }));
    const editedSku = screen.getByTestId("form-sku").textContent;
    const publishButton = screen.getByRole("button", { name: "Publish" });
    publishButton.focus();
    fireEvent.click(publishButton);

    expect(await screen.findByRole("alert")).toHaveTextContent("pipeline stopped");
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
    expect(screen.getByTestId("form-sku")).toHaveTextContent(editedSku ?? "");
    expect(publishButton).toHaveFocus();
    expect(screen.queryByText(/Published “.*” at/)).not.toBeInTheDocument();
  });

  it("removes dirty exit listeners after reset, publish, and unmount", async () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const publish = vi.fn(async () => ({ success: true as const, descriptor }));
    const view = render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" onPublishAction={publish} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    const resetListener = add.mock.calls.find(([type]) => type === "beforeunload")?.[1];
    fireEvent.click(screen.getByRole("button", { name: "Reset to published" }));
    expect(remove).toHaveBeenCalledWith("beforeunload", resetListener);

    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    const publishListener = add.mock.calls.filter(([type]) => type === "beforeunload").at(-1)?.[1];
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(remove).toHaveBeenCalledWith("beforeunload", publishListener);

    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    const unmountListener = add.mock.calls.filter(([type]) => type === "beforeunload").at(-1)?.[1];
    view.unmount();
    expect(remove).toHaveBeenCalledWith("beforeunload", unmountListener);
  });

  it("canceling reset preserves the draft and focused control", () => {
    render(<AdminSvgEditorEditView slug={descriptor.slug} descriptor={descriptor} updatedAtLabel="today" artifactStatus={artifactStatus} catalogLifecycle="draft" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit studio" }));
    window.confirm = vi.fn(() => false);
    const reset = screen.getByRole("button", { name: "Reset to published" });
    reset.focus();

    fireEvent.click(reset);

    expect(screen.getByText("Unpublished changes")).toBeInTheDocument();
    expect(reset).toHaveFocus();
  });
});
