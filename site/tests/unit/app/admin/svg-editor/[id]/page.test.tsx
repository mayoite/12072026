/**
 * Page tests for /admin/svg-editor/[id] (edit + new).
 * Covers load by slug, 404 on invalid, new stub defaults, EditView mount.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import SvgEditorDetailPage from "@/app/admin/svg-editor/[id]/page";
import * as loader from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("notfound");
  }),
}));

vi.mock("@/features/planner/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
  BLOCK_DESCRIPTORS_DIR_DEFAULT: "mock-dir",
}));

vi.mock("@/features/admin/svg-editor/publish/newBlockDescriptorStub", () => ({
  makeNewBlockDescriptorStub: () =>
    ({
      slug: "new-block",
      variant: "fixed",
      schemaVersion: "2026-07-04.v2",
    }) satisfies Pick<BlockDescriptor, "slug" | "variant" | "schemaVersion">,
}));

vi.mock("@/features/admin/svg-editor/publish/svgArtifactStatus.server", () => ({
  readSvgArtifactStatus: vi.fn(() => ({
    state: "ok",
    bytes: 12,
    updatedAt: null,
    hash: null,
    publicUrl: null,
    markup: null,
  })),
}));

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
  readLifecycleManifest: vi.fn(() => ({})),
  resolveCatalogLifecycle: vi.fn(() => "released"),
}));

vi.mock("@/features/admin/svg-editor/publish/publishSvgEditorAction", () => ({
  publishSvgEditorAction: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/views/AdminSvgEditorEditView", () => ({
  AdminSvgEditorEditView: ({
    slug,
    updatedAtLabel,
    catalogLifecycle,
  }: {
    slug: string;
    updatedAtLabel: string;
    catalogLifecycle: string;
  }) => (
    <div
      data-testid="edit-view"
      data-slug={slug}
      data-updated={updatedAtLabel}
      data-lifecycle={catalogLifecycle}
    >
      <div data-testid="puck-editor" data-slug={slug} />
    </div>
  ),
}));

function descriptorStub(
  overrides: Partial<BlockDescriptor> & Pick<BlockDescriptor, "slug">,
): BlockDescriptor {
  return {
    variant: "fixed",
    schemaVersion: "2026-07-04.v2",
    ...overrides,
  } as BlockDescriptor;
}

describe("app/admin/svg-editor/[id]/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("new slug: renders with default props from stub", async () => {
    const Page = await SvgEditorDetailPage({
      params: Promise.resolve({ id: "new" }),
    });
    render(Page);

    expect(screen.getByTestId("edit-view")).toHaveAttribute(
      "data-slug",
      "new-block",
    );
    expect(screen.getByTestId("edit-view")).toHaveAttribute(
      "data-lifecycle",
      "draft",
    );
    expect(screen.getByTestId("edit-view")).toHaveAttribute(
      "data-updated",
      "Not published",
    );
  });

  it("loads existing via tryLoad and renders EditView", async () => {
    const desc = descriptorStub({ slug: "chaise" });
    vi.mocked(loader.tryLoad).mockReturnValue({ ok: true, value: desc });

    const Page = await SvgEditorDetailPage({
      params: Promise.resolve({ id: "chaise" }),
    });
    render(Page);

    expect(loader.tryLoad).toHaveBeenCalledWith("chaise");
    expect(screen.getByTestId("edit-view")).toBeInTheDocument();
    expect(screen.getByTestId("edit-view")).toHaveAttribute(
      "data-slug",
      "chaise",
    );
  });

  it("invalid slug calls notFound", async () => {
    vi.mocked(loader.tryLoad).mockReturnValue({
      ok: false,
      error: {
        kind: "notFound",
        code: "404.not_found",
        fieldPath: "slug:missing",
        message: 'Block descriptor "missing" not found',
        slug: "missing",
      },
    });

    await expect(
      SvgEditorDetailPage({ params: Promise.resolve({ id: "missing" }) }),
    ).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  it("mounts edit shell surface for compose (editor landmark)", async () => {
    const desc = descriptorStub({ slug: "side-table" });
    vi.mocked(loader.tryLoad).mockReturnValue({ ok: true, value: desc });

    const Page = await SvgEditorDetailPage({
      params: Promise.resolve({ id: "side-table" }),
    });
    render(Page);

    expect(screen.getByTestId("edit-view")).toBeInTheDocument();
    expect(screen.getByTestId("puck-editor")).toBeInTheDocument();
  });
});
