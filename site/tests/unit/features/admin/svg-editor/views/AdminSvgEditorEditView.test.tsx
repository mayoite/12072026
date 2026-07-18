/**
 * Interaction coverage for AdminSvgEditorEditView beyond shell landmarks.
 * Task 6: Publish preview is server compile via useDebouncedCompile — not Excalidraw.
 */

import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { AdminSvgEditorEditView } from "@/features/admin/svg-editor/views/AdminSvgEditorEditView";

const { refresh, uploadAssetToSupabase, useDebouncedCompile } = vi.hoisted(() => ({
  refresh: vi.fn(),
  uploadAssetToSupabase: vi.fn(),
  useDebouncedCompile: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, replace: vi.fn(), push: vi.fn() }),
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

vi.mock("@/features/admin/svg-editor/publish/useDebouncedCompile", () => ({
  useDebouncedCompile,
}));

vi.mock("@/features/admin/svg-editor/publish/LiveCompiledSvgPreview", () => ({
  LiveCompiledSvgPreview: ({
    result,
    pending,
  }: {
    result: { ok?: boolean; svg?: string } | null;
    pending: boolean;
  }) => (
    <div
      data-testid="admin-svg-livepreview"
      data-compiler-authority="compileSvgForPublish"
      data-pending={pending ? "true" : "false"}
      data-from-hook={result?.ok === true && result.svg === "<svg data-server='1'/>" ? "true" : "false"}
    >
      {result?.ok ? "server-ok" : "server-idle"}
    </div>
  ),
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

const HOOK_SVG = "<svg data-server='1'/>";

function loadDescriptor(slugFile: string): BlockDescriptor {
  return JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "inventory/descriptors", slugFile),
      "utf8",
    ),
  ) as BlockDescriptor;
}

const descriptor = loadDescriptor("oando-classy-meeting-1800.json");
const makerDescriptor = loadDescriptor("oando-fluid-desk-1600.json");

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
    useDebouncedCompile.mockReset();
    useDebouncedCompile.mockReturnValue({
      result: {
        ok: true,
        phase: "ok",
        svg: HOOK_SVG,
        issues: [],
      },
      pending: false,
    });
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uses useDebouncedCompile for publish preview (not Excalidraw SVG)", () => {
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

    expect(useDebouncedCompile).toHaveBeenCalled();
    const [slugArg, formArg, optsArg] = useDebouncedCompile.mock.calls[0] as [
      string,
      Record<string, unknown>,
      { delayMs?: number },
    ];
    expect(slugArg).toBe(descriptor.slug);
    expect(optsArg).toEqual({ delayMs: 300 });
    // Compile form must not thrash on studio sketch elements alone.
    expect(formArg).not.toHaveProperty("excalidrawElements");
    expect(formArg).toHaveProperty("blocks");
    expect(formArg).toHaveProperty("variant", "fixed");

    const live = screen.getByTestId("admin-svg-livepreview");
    expect(live).toHaveAttribute("data-from-hook", "true");
    expect(live).toHaveAttribute("data-compiler-authority", "compileSvgForPublish");
    expect(live).toHaveTextContent("server-ok");
    expect(screen.getByText("Publish preview")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-sketch")).not.toHaveAttribute(
      "data-compiler-authority",
    );
  });

  it("shows maker banner and IR strip when descriptor has maker", () => {
    render(
      <AdminSvgEditorEditView
        slug={makerDescriptor.slug}
        descriptor={makerDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    expect(screen.getByTestId("admin-svg-maker-geometry-banner")).toHaveTextContent(
      /Publish geometry is maker recipe/i,
    );
    expect(screen.getByTestId("admin-svg-publish-ir-strip")).toHaveTextContent(
      /maker:\s*linear-desk/,
    );
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
    // Unpublished so canPublish is true without form dirty.
    const draftArtifact = { ...artifactStatus, state: "missing" as const };

    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={draftArtifact}
        catalogLifecycle="draft"
        onPublishAction={onPublishAction}
      />,
    );

    const publish = screen.getByTestId("admin-shell-primary-action");
    expect(publish).not.toBeDisabled();

    await user.click(publish);
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(onPublishAction).toHaveBeenCalled();
    });
  });

  it("does not fabricate preview from Excalidraw when hook returns null", () => {
    useDebouncedCompile.mockReturnValue({
      result: null,
      pending: true,
    });

    render(
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel="today"
        artifactStatus={{ ...artifactStatus, state: "missing" }}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    expect(useDebouncedCompile).toHaveBeenCalled();
    expect(screen.getByTestId("admin-svg-livepreview")).toHaveAttribute(
      "data-from-hook",
      "false",
    );
    expect(screen.getByTestId("admin-shell-primary-action")).toBeDisabled();
  });
});
