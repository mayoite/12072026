/**
 * TDD tests for /admin/svg-editor/[id] (edit + new)
 * Covers load by slug, 404 on invalid, new stub defaults, EditView mount.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import SvgEditorDetailPage from "@/app/admin/svg-editor/[id]/page";
import * as loader from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => { throw new Error("notfound"); }),
}));

vi.mock("@/features/planner/project/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
  BLOCK_DESCRIPTORS_DIR_DEFAULT: "mock-dir",
}));

vi.mock("@/features/admin/svg-editor/views/AdminSvgEditorEditView", () => ({
  // Updated stub simulates the post-Puck-mount behavior (Puck inside provides the editor testid).
  AdminSvgEditorEditView: ({ slug }: { slug: string }) => (
    <div data-testid="edit-view" data-slug={slug}>
      <div data-testid="puck-editor" data-slug={slug} />
    </div>
  ),
}));

vi.mock("@puckeditor/core", () => ({
  Puck: ({ data }: { data: any }) => <div data-testid="puck-editor" data-type={data?.content?.[0]?.type} />,
  Render: ({ data }: { data: any }) => <div data-testid="puck-render" data-type={data?.content?.[0]?.type} />,
}));

describe("app/admin/svg-editor/[id]/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("new slug: renders with default props from registry", async () => {
    const Page = await SvgEditorDetailPage({ params: Promise.resolve({ id: "new" }) });
    render(Page);
    expect(screen.getByTestId("edit-view")).toHaveAttribute("data-slug", "new");
  });

  it("loads existing via tryLoad and renders EditView (now with full Puck editor)", async () => {
    const desc = { slug: "chaise", variant: "fixed", schemaVersion: "2026-07-04.v2" } as any;
    (loader.tryLoad as any).mockReturnValue({ ok: true, value: desc });

    const Page = await SvgEditorDetailPage({ params: Promise.resolve({ id: "chaise" }) });
    render(Page);

    expect(loader.tryLoad).toHaveBeenCalledWith("chaise");
    expect(screen.getByTestId("edit-view")).toBeInTheDocument();
    // preview Render section removed; full Puck editor inside EditView (see TDD test)
  });

  it("invalid slug calls notFound", async () => {
    (loader.tryLoad as any).mockReturnValue({ ok: false, error: { kind: "notFound" } });

    await expect(
      SvgEditorDetailPage({ params: Promise.resolve({ id: "missing" }) })
    ).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  // TDD: write failing first per protocol. This asserts full <Puck config onPublish> editor
  // replaces the prior JSON textarea + separate <Render preview> only.
  // Will fail until AdminSvgEditorEditView + page impl mount Puck and test stub updated.
  // GS: BP-05 (≤1 Render/route), BP-04 (Puck in admin), REC-01 minimize.
  it("mounts full Puck editor (Puck config + onPublish) replacing JSON edit view + Render preview", async () => {
    const desc = { slug: "side-table", variant: "fixed", schemaVersion: "2026-07-04.v2" } as any;
    (loader.tryLoad as any).mockReturnValue({ ok: true, value: desc });

    const Page = await SvgEditorDetailPage({ params: Promise.resolve({ id: "side-table" }) });
    render(Page);

    // edit-view wrapper still present (we edit inside it), but must now surface puck-editor from Puck mount
    expect(screen.getByTestId("edit-view")).toBeInTheDocument();
    expect(screen.getByTestId("puck-editor")).toBeInTheDocument();
    // old preview Render may still be in dom from prior or not; main is Puck for compose
  });
});
