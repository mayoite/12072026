import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { AdminSvgEditorShell } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgEditorShell";
import { INITIAL_FEEDBACK } from "@/features/admin/svg-editor/views/edit-shell/useAdminSvgEditorPublish";
import type { AdminSvgEditorShellProps } from "@/features/admin/svg-editor/views/edit-shell/types";

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

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="mock-excalidraw-canvas" />,
}));

vi.mock("@/features/admin/svg-editor/form/SvgEditorForm", () => ({
  SvgEditorForm: () => null,
}));

vi.mock("@/features/admin/svg-editor/lifecycle/DescriptorRevisionPanel", () => ({
  DescriptorRevisionPanel: () => null,
}));

vi.mock("@/features/admin/svg-editor/publish/LiveCompiledSvgPreview", () => ({
  LiveCompiledSvgPreview: () => null,
}));

vi.mock("@/features/admin/svg-editor/publish/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => null,
}));

function shellProps(
  overrides: Partial<AdminSvgEditorShellProps> = {},
): AdminSvgEditorShellProps {
  const form = descriptorToFormState(makeNewBlockDescriptorStub());
  return {
    slug: "new-block",
    updatedAtLabel: "today",
    form,
    formDirty: false,
    formIssues: [],
    coreFieldIssuesCount: 0,
    preview: { ok: true, phase: "ok", svg: "<svg></svg>", issues: [] },
    previewPending: false,
    feedback: INITIAL_FEEDBACK,
    authoringLifecycle: "clean",
    lifecycle: "draft",
    artifactStatus: {
      state: "published",
      bytes: 1,
      updatedAt: 1,
      hash: "deadbeef",
      publicUrl: "/symbol.svg",
      markup: "<svg></svg>",
    },
    publishImpactLabel: "Publish target: new-block.",
    approving: false,
    canPublish: true,
    canConvertToGlb: false,
    glbSourceSvg: null,
    glbUrl: "",
    glbUploading: false,
    glbUploadError: null,
    stageMeta: {
      identity: "Identity new-block",
      footprint: "Footprint 600×600 mm",
      draft: "In sync with published",
      validation: "Draft ready",
      revision: "Last published today",
    },
    studioResetKey: 0,
    plannerVerifyHref: "/planner/guest",
    publishArtifactHref: (s) => `/svg-catalog/${s}.svg`,
    onFormChange: vi.fn(),
    onDismissFeedback: vi.fn(),
    onResetToPublished: vi.fn(),
    onApproveForBuyers: vi.fn(),
    onPublish: vi.fn(),
    onStartGlbConversion: vi.fn(),
    onGlbGenerated: vi.fn(),
    onDocument: vi.fn(),
    onError: vi.fn(),
    ...overrides,
  };
}

describe("AdminSvgEditorShell", () => {
  it("composes top bar, feedback, status band, rails, and stage landmarks", () => {
    render(<AdminSvgEditorShell {...shellProps()} />);

    expect(screen.getByTestId("admin-svg-edit-shell")).toHaveAttribute(
      "data-admin-shell",
      "edit",
    );
    expect(screen.getByTestId("admin-shell-header")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-a11y-live-feedback")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-publication-impact")).toHaveTextContent(
      /Publish target/,
    );
    expect(screen.getByTestId("admin-svg-publication-impact")).toHaveClass(
      "sr-only",
    );
    expect(screen.getByTestId("admin-svg-studio-status")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-status-draft")).toHaveTextContent(
      /In sync/i,
    );
    expect(screen.getByTestId("admin-svg-studio-status-validation")).toHaveTextContent(
      /Draft ready/i,
    );
    expect(screen.getByTestId("admin-svg-engine-shell")).toHaveAttribute(
      "data-stage-layout",
      "rail-center-rail",
    );
    expect(screen.getByTestId("admin-svg-engine-stage")).toBeInTheDocument();
    expect(screen.getByTestId("mock-excalidraw-canvas")).toBeInTheDocument();
    expect(screen.getByLabelText("Draft and released previews")).toBeInTheDocument();
    expect(screen.getByText("Publish preview")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-sketch")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Product details and history"),
    ).toBeInTheDocument();
  });

  it("shows Ready to publish when canPublish; blocked badge otherwise", () => {
    const { rerender } = render(
      <AdminSvgEditorShell {...shellProps({ canPublish: true })} />,
    );
    expect(screen.getByText(/Ready to publish/i)).toBeInTheDocument();

    rerender(<AdminSvgEditorShell {...shellProps({ canPublish: false })} />);
    expect(screen.getByText(/Publish blocked/i)).toBeInTheDocument();
  });

  it("exposes studio node count from form.sceneParts", () => {
    const form = descriptorToFormState(makeNewBlockDescriptorStub());
    render(
      <AdminSvgEditorShell
        {...shellProps({
          form: {
            ...form,
            sceneParts: [{ id: "p1" }] as typeof form.sceneParts,
          },
        })}
      />,
    );
    expect(screen.getByTestId("admin-svg-engine-shell")).toHaveAttribute(
      "data-studio-node-count",
      "1",
    );
  });

  it("keeps product details visible and marks dirty drafts for attention", () => {
    render(<AdminSvgEditorShell {...shellProps({ formDirty: true })} />);
    const productDetails = screen.getByText("Product details").closest("section");
    expect(productDetails).toHaveAttribute("data-attention", "true");
  });
});
