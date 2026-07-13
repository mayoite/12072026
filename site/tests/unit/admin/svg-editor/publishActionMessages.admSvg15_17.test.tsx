/**
 * ADM-SVG-15 / 16 / 17 — primary publish names target+versions; failure honesty;
 * success links to artifact + Planner.
 */

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { vi } from "vitest";

import {
  PLANNER_VERIFY_HREF,
  publishConfirmMessage,
  publishFailureMessage,
  publishImpactSummary,
  publishSuccessMessage,
  releasedSvgHref,
} from "@/features/planner/admin/svg-editor/publishActionMessages";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/features/planner/admin/svg-editor/useDebouncedCompile", () => ({
  useDebouncedCompile: () => ({
    result: { ok: true, svg: "<svg></svg>", issues: [], phase: "ok" },
    pending: false,
  }),
}));
vi.mock("@/features/planner/admin/svg-editor/SvgEditorForm", () => ({
  SvgEditorForm: () => null,
}));
vi.mock("@/features/planner/admin/svg-editor/LiveCompiledSvgPreview", () => ({
  LiveCompiledSvgPreview: () => null,
}));
vi.mock("@/features/planner/admin/svg-editor/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => null,
}));
vi.mock("@/features/planner/admin/svg-editor/DescriptorRevisionPanel", () => ({
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
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { AdminSvgEditorEditView } from "@/features/planner/admin/svg-editor/AdminSvgEditorEditView";

const descriptor = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "block-descriptors/side-table-001.json"),
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

describe("ADM-SVG-15 publish names target and versions", () => {
  it("impact and confirm copy name target, draft schema, and live revision", () => {
    const input = {
      targetSlug: "side-table-001",
      draftSchemaVersion: "2026-07-04.v2",
      liveArtifactState: "published",
      liveRevisionShort: "abcdef0123456789…",
    };
    const impact = publishImpactSummary(input);
    expect(impact).toContain("side-table-001");
    expect(impact).toContain("2026-07-04.v2");
    expect(impact).toMatch(/live revision|Live artifact/i);
    const confirm = publishConfirmMessage(input);
    expect(confirm).toContain("Target product");
    expect(confirm).toContain("Draft schema version");
    expect(confirm).toMatch(/Impact/);
  });

  it("renders one primary Publish control described by impact text", () => {
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
    const publish = screen.getByTestId("admin-shell-primary-action");
    expect(publish).toHaveAttribute(
      "aria-describedby",
      "admin-svg-publication-impact",
    );
    expect(screen.getByTestId("admin-svg-publication-impact")).toHaveTextContent(
      descriptor.slug,
    );
    expect(screen.getByTestId("admin-svg-publication-impact")).toHaveTextContent(
      /Draft schema|live revision|Live artifact/i,
    );
  });
});

describe("ADM-SVG-16 failure never false success", () => {
  it("failure message states live artifact was not replaced", () => {
    expect(publishFailureMessage("side-table-001", "pipeline stopped")).toMatch(
      /not replaced/i,
    );
  });

  it("failed publish shows failure alert without success links", async () => {
    window.confirm = vi.fn(() => true);
    const publish = vi.fn(async () => ({
      success: false as const,
      error: "pipeline stopped",
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
    fireEvent.click(screen.getByTestId("admin-shell-primary-action"));
    expect(await screen.findByTestId("admin-svg-publish-failure")).toHaveTextContent(
      /not replaced|pipeline stopped/i,
    );
    expect(screen.queryByTestId("admin-svg-publish-success")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("admin-svg-publish-success-artifact"),
    ).not.toBeInTheDocument();
  });
});

describe("ADM-SVG-17 success links artifact and Planner", () => {
  it("builds stable hrefs", () => {
    expect(releasedSvgHref("side-table-001")).toBe(
      "/svg-catalog/side-table-001.svg",
    );
    expect(PLANNER_VERIFY_HREF).toBe("/planner/guest");
    expect(publishSuccessMessage("side-table-001", "now")).toMatch(/Published/);
  });

  it("successful publish shows Open released SVG and Verify in Planner", async () => {
    window.confirm = vi.fn(() => true);
    const publish = vi.fn(async () => ({
      success: true as const,
      descriptor,
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
    fireEvent.click(screen.getByTestId("admin-shell-primary-action"));
    await waitFor(() => {
      expect(screen.getByTestId("admin-svg-publish-success")).toBeInTheDocument();
    });
    const artifact = screen.getByTestId("admin-svg-publish-success-artifact");
    expect(artifact).toHaveAttribute(
      "href",
      `/svg-catalog/${descriptor.slug}.svg`,
    );
    expect(screen.getByTestId("admin-svg-publish-success-planner")).toHaveAttribute(
      "href",
      "/planner/guest",
    );
  });
});
