import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AdminSvgPreviewRail } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgPreviewRail";

vi.mock("@/features/admin/svg-editor/publish/LiveCompiledSvgPreview", () => ({
  LiveCompiledSvgPreview: ({
    result,
    pending,
  }: {
    result: { ok: boolean } | null;
    pending: boolean;
  }) => (
    <div
      data-testid="mock-live-preview"
      data-compiler-authority="compileSvgForPublish"
    >
      {pending ? "pending" : result?.ok ? "ok" : "idle"}
    </div>
  ),
}));

vi.mock("@/features/admin/svg-editor/publish/PublishedSvgPreview", () => ({
  PublishedSvgPreview: ({
    slug,
    status,
  }: {
    slug: string;
    status: { state: string };
  }) => (
    <div data-testid="mock-published-preview">
      {slug}:{status.state}
    </div>
  ),
}));

describe("AdminSvgPreviewRail", () => {
  it("renders Publish preview and released panels with server-compile honesty", () => {
    render(
      <AdminSvgPreviewRail
        slug="side-table-001"
        preview={{
          ok: true,
          phase: "ok",
          svg: "<svg></svg>",
          issues: [],
        }}
        previewPending={false}
        publishIrStrip="3 blocks · fixed"
        artifactStatus={{
          state: "published",
          bytes: 12,
          updatedAt: 1,
          hash: "abc",
          publicUrl: "/svg-catalog/side-table-001.svg",
          markup: "<svg></svg>",
        }}
      />,
    );

    expect(screen.getByLabelText("Draft and released previews")).toBeInTheDocument();
    expect(screen.getByText("Publish preview")).toBeInTheDocument();
    expect(screen.getByText("Released symbol")).toBeInTheDocument();
    expect(screen.getByText(/Same server compile as Publish/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-publish-ir-strip")).toHaveTextContent(
      /3 blocks · fixed/,
    );
    expect(screen.getByTestId("admin-svg-form-geometry-note")).toHaveTextContent(
      /blocks or maker/i,
    );
    expect(screen.getByTestId("admin-svg-studio-sketch")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-sketch")).not.toHaveAttribute(
      "data-compiler-authority",
    );
    expect(screen.getByTestId("admin-svg-released-state")).toHaveTextContent(
      /Released to Planner/i,
    );
    expect(screen.getByTestId("mock-live-preview")).toHaveTextContent("ok");
    expect(screen.getByTestId("mock-live-preview")).toHaveAttribute(
      "data-compiler-authority",
      "compileSvgForPublish",
    );
    expect(screen.getByTestId("mock-published-preview")).toHaveTextContent(
      "side-table-001:published",
    );
    expect(screen.getByTestId("admin-svg-artifact-panel")).toHaveAttribute(
      "data-artifact-state",
      "published",
    );
  });

  it("shows maker banner and IR strip when maker recipe is present", () => {
    render(
      <AdminSvgPreviewRail
        slug="oando-fluid-desk-1600"
        preview={{
          ok: true,
          phase: "ok",
          svg: "<svg></svg>",
          issues: [],
        }}
        previewPending={false}
        makerRecipe="linear-desk"
        publishIrStrip="maker: linear-desk"
        studioSketchSvg='<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'
        artifactStatus={{
          state: "published",
          bytes: 1,
          updatedAt: 1,
          hash: "abc",
          publicUrl: "/svg-catalog/oando-fluid-desk-1600.svg",
          markup: "<svg></svg>",
        }}
      />,
    );

    expect(screen.getByTestId("admin-svg-maker-geometry-banner")).toHaveTextContent(
      /Publish geometry is maker recipe/i,
    );
    expect(screen.getByTestId("admin-svg-publish-ir-strip")).toHaveTextContent(
      "maker: linear-desk",
    );
    expect(screen.queryByTestId("admin-svg-form-geometry-note")).toBeNull();
    const sketch = screen.getByTestId("admin-svg-studio-sketch-stage");
    expect(sketch).toBeInTheDocument();
    expect(sketch).not.toHaveAttribute("data-compiler-authority");
  });

  it("passes pending flag to live preview and labels missing release", () => {
    render(
      <AdminSvgPreviewRail
        slug="x"
        preview={null}
        previewPending
        artifactStatus={{
          state: "missing",
          bytes: 0,
          updatedAt: 0,
          hash: null,
          publicUrl: null,
          markup: null,
        }}
      />,
    );
    expect(screen.getByTestId("mock-live-preview")).toHaveTextContent("pending");
    expect(screen.getByTestId("admin-svg-released-state")).toHaveTextContent(
      /Not released yet/i,
    );
  });
});
