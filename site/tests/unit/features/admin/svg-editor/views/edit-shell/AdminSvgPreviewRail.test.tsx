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
    <div data-testid="mock-live-preview">
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
  it("renders draft and released preview panels with operator state", () => {
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
    expect(screen.getByText("Draft preview")).toBeInTheDocument();
    expect(screen.getByText("Released symbol")).toBeInTheDocument();
    expect(screen.getByText(/What Publish will release/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-released-state")).toHaveTextContent(
      /Released to Planner/i,
    );
    expect(screen.getByTestId("mock-live-preview")).toHaveTextContent("ok");
    expect(screen.getByTestId("mock-published-preview")).toHaveTextContent(
      "side-table-001:published",
    );
    expect(screen.getByTestId("admin-svg-artifact-panel")).toHaveAttribute(
      "data-artifact-state",
      "published",
    );
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
