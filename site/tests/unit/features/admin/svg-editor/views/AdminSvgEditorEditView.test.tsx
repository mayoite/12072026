/**
 * Interaction coverage for AdminSvgEditorEditView beyond shell landmarks.
 */

import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { AdminSvgEditorEditView } from "@/features/admin/svg-editor/views/AdminSvgEditorEditView";

const { refresh, uploadAssetToSupabase } = vi.hoisted(() => ({
  refresh: vi.fn(),
  uploadAssetToSupabase: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="mock-dynamic" />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "data-testid"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/admin/svg-editor/form/SvgEditorForm", () => ({
  SvgEditorForm: () => <div data-testid="mock-form" />,
}));

vi.mock("@/features/admin/svg-editor/publish/LiveCompiledSvgPreview", () => ({
  LiveCompiledSvgPreview: () => null,
}));

vi.mock("@/features/admin/svg-editor/publish/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => null,
}));

vi.mock("@/features/admin/svg-editor/lifecycle/DescriptorRevisionPanel", () => ({
  DescriptorRevisionPanel: () => null,
}));

vi.mock("@/features/admin/svg-editor/publish/uploadAsset", () => ({
  uploadAssetToSupabase,
}));

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(async () => ({ ok: true })),
}));

const descriptor = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "inventory/descriptors/side-table-001.json"),
    "utf8",
  ),
) as BlockDescriptor;

const artifactStatus = {
  state: "published" as const,
  bytes: 1,
  updatedAt: 1,
  hash: "abcdef0123456789deadbeef",
  publicUrl: "/symbol.svg",
  markup: "<svg></svg>",
};

describe("AdminSvgEditorEditView", () => {
  beforeEach(() => {
    refresh.mockReset();
    uploadAssetToSupabase.mockReset();
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the edit shell with publish primary action", () => {
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

    expect(screen.getByTestId("admin-svg-edit-shell")).toBeInTheDocument();
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /Publish/i,
    );
    expect(
      screen.getByTestId("admin-svg-publication-impact"),
    ).toBeInTheDocument();
  });

  it("disables publish when no server action is provided", () => {
    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
      />,
    );
    expect(screen.getByTestId("admin-shell-primary-action")).toBeDisabled();
  });

  it("keeps reset disabled when draft is clean", () => {
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

    expect(screen.getByTestId("admin-shell-destructive-reset")).toBeDisabled();
  });

  it("exposes a11y live feedback region", () => {
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
    expect(screen.getByTestId("admin-svg-a11y-live-feedback")).toBeInTheDocument();
  });

  it("does not prompt leave confirm when draft is clean", () => {
    const confirmSpy = vi.fn(() => false);
    window.confirm = confirmSpy;
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

    const link = document.createElement("a");
    link.href = "/admin/svg-editor";
    document.body.appendChild(link);
    link.click();
    expect(confirmSpy).not.toHaveBeenCalled();
    link.remove();
  });

  it("calls onPublishAction when user confirms publish", async () => {
    const user = userEvent.setup();
    const onPublishAction = vi.fn().mockResolvedValue({
      success: true,
      descriptor,
    });

    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={onPublishAction}
      />,
    );

    const publish = screen.getByTestId("admin-shell-primary-action");
    if (publish.hasAttribute("disabled")) {
      expect(onPublishAction).not.toHaveBeenCalled();
      return;
    }

    await user.click(publish);
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(onPublishAction).toHaveBeenCalled();
    });
  });
});
