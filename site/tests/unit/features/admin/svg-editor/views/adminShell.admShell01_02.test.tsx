/**
 * ADM-SHELL-01 — title, scope, source, state, one primary action.
 * ADM-SHELL-02 — secondary/destructive do not compete with primary.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { AdminSvgEditorListView } from "@/features/admin/svg-editor/views/AdminSvgEditorListView";
import { AdminSvgEditorEditView } from "@/features/admin/svg-editor/views/AdminSvgEditorEditView";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/features/admin/svg-editor/publish/useDebouncedCompile", () => ({
  useDebouncedCompile: () => ({
    result: { ok: true, svg: "<svg></svg>", issues: [], phase: "ok" },
    pending: false,
  }),
}));
vi.mock("@/features/admin/svg-editor/form/SvgEditorForm", () => ({
  SvgEditorForm: () => null,
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
vi.mock("next/dynamic", () => ({
  default: () => () => null,
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
vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(),
}));

const listDescriptor = {
  slug: "side-table-001",
  sku: "OFL-TBL-001",
  variant: "fixed",
  sourceProvenance: "native",
  generatedAt: 1_700_000_000_000,
  geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
} as unknown as BlockDescriptor;

const editDescriptor = JSON.parse(
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

function assertShellLandmarks() {
  expect(screen.getByTestId("admin-shell-header")).toBeInTheDocument();
  expect(screen.getByTestId("admin-shell-scope")).toHaveTextContent(/\S/);
  expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(/\S/);
  expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(/\S/);
  expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(/\S/);
  expect(screen.getByTestId("admin-shell-primary-action")).toBeInTheDocument();
}

function assertSinglePrimaryInActions() {
  const actions = screen.getByTestId("admin-shell-actions");
  const primaries = within(actions).queryAllByRole("link", {}).filter((el) =>
    el.classList.contains("admin-btn--primary"),
  );
  const primaryButtons = within(actions)
    .queryAllByRole("button")
    .filter((el) => el.classList.contains("admin-btn--primary"));
  const allPrimaries = [...primaries, ...primaryButtons];
  // Also catch <a> and <button> with primary class regardless of role quirks
  const byClass = actions.querySelectorAll(".admin-btn--primary");
  expect(byClass.length).toBe(1);
  expect(allPrimaries.length).toBe(1);
  expect(screen.getByTestId("admin-shell-primary-action")).toHaveClass(
    "admin-btn--primary",
  );
}

function assertSecondaryNotPrimary(testId: string) {
  const el = screen.getByTestId(testId);
  expect(el).toHaveClass("admin-btn--outline");
  expect(el).not.toHaveClass("admin-btn--primary");
}

describe("ADM-SHELL-01 list page landmarks", () => {
  it("exposes title, scope, source, state, and one primary action", () => {
    render(
      <AdminSvgEditorListView
        descriptors={[listDescriptor]}
        refreshedAtLabel="test-time"
        artifactStatuses={{
          "side-table-001": {
            state: "published",
            bytes: 12,
            updatedAt: 1,
            hash: "abc",
            publicUrl: "/svg-catalog/side-table-001.svg",
            markup: "<svg></svg>",
          },
        }}
        lifecycleManifest={{}}
      />,
    );

    assertShellLandmarks();
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(/SVG symbols/i);
    expect(screen.getByTestId("admin-shell-scope")).toHaveTextContent(/SVG authoring/i);
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(
      /local disk inventory/i,
    );
    expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(/published/i);
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /New SVG symbol/i,
    );
  });
});

describe("ADM-SHELL-01 edit page landmarks", () => {
  it("exposes title, scope, source, state, and one primary action", () => {
    render(
      <AdminSvgEditorEditView
        slug={editDescriptor.slug}
        descriptor={editDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    assertShellLandmarks();
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(
      editDescriptor.slug,
    );
    expect(screen.getByTestId("admin-shell-scope")).toHaveTextContent(/SVG studio/i);
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(
      /Published today/i,
    );
    expect(screen.getByTestId("admin-shell-state")).toBeInTheDocument();
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /Publish/i,
    );
    expect(screen.getByTestId("admin-shell-header")).not.toHaveTextContent(
      /Products DB not live|checksum|Block descriptor draft|Publish target:/i,
    );
  });
});

describe("ADM-SHELL-02 primary is unique; secondary/destructive do not compete", () => {
  it("list header has exactly one primary action", () => {
    render(
      <AdminSvgEditorListView
        descriptors={[listDescriptor]}
        refreshedAtLabel="test-time"
        artifactStatuses={{
          "side-table-001": {
            state: "published",
            bytes: 12,
            updatedAt: 1,
            hash: "abc",
            publicUrl: "/svg-catalog/side-table-001.svg",
            markup: "<svg></svg>",
          },
        }}
        lifecycleManifest={{}}
      />,
    );

    assertSinglePrimaryInActions();
    // Advanced bulk path stays non-primary
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).toHaveClass(
      "admin-btn--outline",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).not.toHaveClass(
      "admin-btn--primary",
    );
  });

  it("edit header primary is Publish; secondary and destructive stay outline", () => {
    render(
      <AdminSvgEditorEditView
        slug={editDescriptor.slug}
        descriptor={editDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    assertSinglePrimaryInActions();
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /Publish/i,
    );
    assertSecondaryNotPrimary("admin-shell-secondary-back");
    assertSecondaryNotPrimary("admin-shell-destructive-reset");
    assertSecondaryNotPrimary("admin-shell-secondary-approve");
  });
});

describe("ADM-SHELL hardcoded layout removal", () => {
  it("renders the edit shell header controls without inline style attributes", () => {
    render(
      <AdminSvgEditorEditView
        slug={editDescriptor.slug}
        descriptor={editDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );

    expect(screen.getByTestId("admin-svg-edit-shell")).not.toHaveAttribute(
      "style",
    );
    expect(screen.getByTestId("admin-shell-header")).not.toHaveAttribute(
      "style",
    );
    expect(
      screen.getByTestId("admin-shell-primary-action"),
    ).not.toHaveAttribute("style");
    expect(
      screen.getByTestId("admin-shell-destructive-reset"),
    ).not.toHaveAttribute("style");
    expect(
      screen.getByTestId("admin-shell-secondary-approve"),
    ).not.toHaveAttribute("style");
    expect(screen.getByTestId("admin-shell-secondary-back")).not.toHaveAttribute(
      "style",
    );
  });
});
