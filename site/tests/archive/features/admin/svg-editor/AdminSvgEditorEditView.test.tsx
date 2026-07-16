import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { SvgSceneDocument } from "@/features/admin/svg-editor/scene/svgSceneDocument";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/svgEditorFormState";

const refresh = vi.fn();
const studioMetrics = vi.hoisted(() => ({ mounts: 0 }));
const formControls = vi.hoisted(() => ({ edit: null as (() => void) | null }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/features/admin/svg-editor/useDebouncedCompile", () => ({
  useDebouncedCompile: () => ({ result: { ok: true, svg: "<svg></svg>", issues: [] }, pending: false }),
}));
vi.mock("@/features/admin/svg-editor/SvgEditorForm", () => ({
  SvgEditorForm: (props: Record<string, unknown>) => {
    formControls.edit = () => {
      const state = props.state as SvgEditorFormState;
      const onChange = props.onChange as (next: SvgEditorFormState) => void;
      onChange({ ...state, sku: `${state.sku}-edited` });
    };
    return <><span data-testid="form-sku">{(props.state as SvgEditorFormState).sku}</span><button type="button" onClick={() => formControls.edit?.()}>Edit field</button></>;
  },
}));
vi.mock("@/features/admin/svg-editor/LiveCompiledSvgPreview", () => ({ LiveCompiledSvgPreview: () => null }));
vi.mock("@/features/admin/svg-editor/PublishedSvgPreview", () => ({ PublishedSvgPreview: () => null }));
vi.mock("@/features/admin/svg-editor/DescriptorRevisionPanel", () => ({ DescriptorRevisionPanel: () => null }));
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>) => {
      if (!String(loader).includes("SvgStudioCanvas")) return () => null;
      return function StudioStub(props: Record<string, unknown>) {
    const document = props.initialDocument as SvgSceneDocument | undefined;
    const [liveDocument, setLiveDocument] = useState(document);
    const [mountId] = useState(() => ++studioMetrics.mounts);
    const getterRef = props.documentGetterRef as MutableRefObject<(() => SvgSceneDocument) | null> | undefined;
    const stageMeta = props.stageMeta as
      | {
          identity: string;
          footprint: string;
          draft: string;
          validation: string;
          revision: string;
        }
      | undefined;
    useEffect(() => {
      if (!getterRef || !liveDocument) throw new Error("expected live document");
      getterRef.current = () => liveDocument;
      return () => { getterRef.current = null; };
    }, [getterRef, liveDocument]);
    if (!liveDocument) return null;
    return (
      <div>
        <div data-testid="admin-stage-status" aria-label="Canvas status">
          {stageMeta ? (
            <>
              <span data-testid="admin-status-identity">{stageMeta.identity}</span>
              <span data-testid="admin-status-footprint">{stageMeta.footprint}</span>
            </>
          ) : null}
          <span data-testid="admin-status-viewbox">
            View box {liveDocument.viewBox.width} × {liveDocument.viewBox.height}
          </span>
          <span data-testid="admin-status-zoom">Zoom 100%</span>
          <span data-testid="admin-status-selection">No selection</span>
          {stageMeta ? (
            <>
              <span data-testid="admin-status-draft">{stageMeta.draft}</span>
              <span data-testid="admin-status-validation">{stageMeta.validation}</span>
              <span data-testid="admin-status-revision">{stageMeta.revision}</span>
            </>
          ) : null}
          <span data-testid="admin-status-layers">{liveDocument.nodes.length} layers</span>
        </div>
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

import { AdminSvgEditorEditView } from "@/features/admin/svg-editor/AdminSvgEditorEditView";

const descriptor = JSON.parse(fs.readFileSync(path.join(process.cwd(), "inventory/descriptors/side-table-001.json"), "utf8")) as BlockDescriptor;
const artifactStatus = { state: "published" as const, bytes: 1, updatedAt: 1, hash: "hash", publicUrl: "/symbol.svg", markup: "<svg></svg>" };

/** Prefer the lifecycle badge — "Unpublished changes" also appears in impact copy. */
function expectAuthoringLifecycle(state: string, label: string) {
  const badge = screen.getByTestId("admin-authoring-lifecycle");
  expect(badge).toHaveAttribute("data-lifecycle", state);
  expect(badge).toHaveTextContent(label);
}

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
    expectAuthoringLifecycle("dirty", "Unpublished changes");
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
    expectAuthoringLifecycle("dirty", "Unpublished changes");
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
    // Error wins over dirty in the single lifecycle; draft fields stay intact.
    expectAuthoringLifecycle("error", "Publish error");
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

    expectAuthoringLifecycle("dirty", "Unpublished changes");
    expect(reset).toHaveFocus();
  });

  it("surfaces core product field errors in a linked page summary", () => {
    const invalid = {
      ...descriptor,
      slug: "",
      geometry: { ...descriptor.geometry, widthMm: 0 },
    };
    render(
      <AdminSvgEditorEditView
        slug="side-table-001"
        descriptor={invalid}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    const summary = screen.getByTestId("admin-core-field-errors");
    expect(summary).toHaveAttribute("role", "alert");
    expect(summary).toHaveTextContent(/core field/i);
    expect(summary.querySelector('a[href="#svgfield-slug"]')).toBeDefined();
    expect(summary.querySelector('a[href="#svgfield-geometry.widthMm"]')).toBeDefined();
    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled();
  });

  it("keeps the svg editor shell compact and moves verbose operator copy out", () => {
    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(
      /Published today/i,
    );
    expect(screen.getByTestId("admin-shell-header")).not.toHaveTextContent(
      /Products DB not live|checksum|Block descriptor draft|Publish target:/i,
    );
    expect(screen.getByTestId("admin-svg-publication-impact")).toHaveClass(
      "sr-only",
    );
    expect(screen.queryByTestId("admin-svg-publishing-details")).toBeNull();
    expect(screen.queryByTestId("admin-svg-advanced-details")).toBeNull();
  });

  it("exposes shell layout contract for ADM-SVG-04 at 1280px", () => {
    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
      />,
    );
    const shell = screen.getByTestId("admin-svg-engine-shell");
    expect(shell).toHaveAttribute(
      "data-stage-grid-columns",
      "minmax(0, 1fr) minmax(280px, 22rem)",
    );
    expect(shell).toHaveAttribute("data-authoring-width-px", "1280");
    expect(shell).toHaveAttribute("data-stage-min-fraction", "0.55");
    expect(shell).toHaveAttribute("data-stage-meets-min-at-1280", "true");
    expect(screen.getByTestId("admin-svg-engine-stage")).toBeInTheDocument();
  });

  it("exposes identity, footprint, view box, zoom, selection, draft, validation, and revision on the stage (ADM-SVG-06)", () => {
    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
      />,
    );

    expect(screen.getByTestId("admin-stage-status")).toBeInTheDocument();
    expect(screen.getByTestId("admin-status-identity")).toHaveTextContent(
      new RegExp(`Identity ${descriptor.slug}`),
    );
    expect(screen.getByTestId("admin-status-identity")).toHaveTextContent(/SKU/);
    expect(screen.getByTestId("admin-status-footprint")).toHaveTextContent(/Footprint \d+×\d+ mm/);
    expect(screen.getByTestId("admin-status-viewbox")).toHaveTextContent(/View box/);
    expect(screen.getByTestId("admin-status-zoom")).toHaveTextContent(/Zoom \d+%/);
    expect(screen.getByTestId("admin-status-selection")).toHaveTextContent(/selection/i);
    expect(screen.getByTestId("admin-status-draft")).toHaveTextContent(/Draft /);
    expect(screen.getByTestId("admin-status-validation")).toHaveTextContent(/Validation /);
    expect(screen.getByTestId("admin-status-revision")).toHaveTextContent(/Revision today/);
    expect(screen.getByTestId("admin-status-revision")).toHaveTextContent(/checksum/i);
  });
});
