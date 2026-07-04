/**
 * TDD tests for /admin/svg-editor/[id] (edit + new)
 * Covers load by slug, 404 on invalid, new stub defaults, EditView mount.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import SvgEditorDetailPage from "@/app/admin/svg-editor/[id]/page";
import * as loader from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => { throw new Error("notfound"); }),
}));

vi.mock("@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
}));

vi.mock("@/features/planner/admin/svg-editor/AdminSvgEditorEditView", () => ({
  AdminSvgEditorEditView: ({ slug }: { slug: string }) => <div data-testid="edit-view" data-slug={slug} />,
}));

vi.mock("@puckeditor/core", () => ({
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

  it("loads existing via tryLoad and renders EditView + preview", async () => {
    const desc = { slug: "chaise", variant: "fixed", schemaVersion: "2026-07-04.v2" } as any;
    (loader.tryLoad as any).mockReturnValue({ ok: true, value: desc });

    const Page = await SvgEditorDetailPage({ params: Promise.resolve({ id: "chaise" }) });
    render(Page);

    expect(loader.tryLoad).toHaveBeenCalledWith("chaise");
    expect(screen.getByTestId("edit-view")).toBeInTheDocument();
    expect(screen.getByTestId("puck-render")).toBeInTheDocument();
  });

  it("invalid slug calls notFound", async () => {
    (loader.tryLoad as any).mockReturnValue({ ok: false, error: { kind: "notFound" } });

    await expect(
      SvgEditorDetailPage({ params: Promise.resolve({ id: "missing" }) })
    ).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });
});
