import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminSvgEditorListView } from "@/features/admin/svg-editor/views/AdminSvgEditorListView";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

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

vi.mock("@/features/admin/svg-editor/publish/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => <span data-testid="preview-stub" />,
}));

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (path: string) => path,
  browserApiFetch: vi.fn(),
}));

const descriptor = {
  slug: "side-table-001",
  sku: "OFL-TBL-001",
  variant: "fixed",
  sourceProvenance: "native",
  generatedAt: 1_700_000_000_000,
  geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
} as unknown as BlockDescriptor;

describe("ADM-SVG-01 primary no-code SVG journey", () => {
  it("presents order-factory desk as primary and keeps bulk CSV advanced", () => {
    render(
      <AdminSvgEditorListView
        descriptors={[descriptor]}
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

    expect(screen.getByTestId("admin-svg-primary-journey")).toBeInTheDocument();
    const copy = screen.getByTestId("admin-svg-journey-copy");
    expect(copy).toHaveTextContent(/linear desk|publish/i);
    expect(copy).toHaveTextContent(/do not need to edit/i);
    expect(copy.textContent ?? "").not.toMatch(/Zod|atomic-rename|pipeline/i);

    const primary = screen.getByTestId("admin-shell-primary-action");
    expect(primary).toHaveAttribute("href", "/admin/svg-editor/parametric");
    expect(primary).toHaveClass("admin-btn--primary");
    expect(primary).toHaveTextContent(/New linear desk/);

    const freehand = screen.getByTestId("admin-shell-freehand-new");
    expect(freehand).toHaveAttribute("href", "/admin/svg-editor/new");
    expect(freehand).toHaveClass("admin-btn--outline");
    expect(freehand).not.toHaveClass("admin-btn--primary");
    expect(freehand).toHaveTextContent(/New SVG symbol/);

    const advanced = screen.getByTestId("admin-svg-advanced-import");
    expect(advanced.tagName.toLowerCase()).toBe("details");
    expect(advanced).not.toHaveAttribute("open");
    expect(screen.getByTestId("admin-svg-advanced-section")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-inventory")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-inventory-search")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-filter-lifecycle")).toBeInTheDocument();
    // Advanced bulk tools stay demoted (outline only; details closed)
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).toHaveClass(
      "admin-btn--outline",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).not.toHaveClass(
      "admin-btn--primary",
    );
    // Default hero source is product language only
    const source = screen.getByTestId("admin-shell-source");
    expect(source).toHaveTextContent(/Product inventory/i);
    expect(source).toHaveTextContent(/refreshed/i);
    expect(source.textContent ?? "").not.toMatch(
      /Dual-write|block-descriptor|Zod|pipeline|atomic-rename|cutover complete/i,
    );
    // Truthful dual-write detail stays collapsible
    const release = screen.getByTestId("admin-shell-release-source");
    expect(release.tagName.toLowerCase()).toBe("details");
    expect(release).not.toHaveAttribute("open");
    const releaseDetail = screen.getByTestId("admin-shell-release-source-detail");
    expect(releaseDetail).toHaveTextContent(/Dual-write: skipped_no_db/i);
    expect(releaseDetail).toHaveTextContent(
      /live authority remains disk until cutover/i,
    );

    const edit = screen.getByTestId("admin-svg-edit-side-table-001");
    expect(edit).toHaveAttribute("href", "/admin/svg-editor/side-table-001");
    // Row edit must not compete with header primary
    expect(edit).toHaveClass("admin-btn--outline");
    expect(edit).not.toHaveClass("admin-btn--primary");

    // ADM-SVG-02 inventory surfaces (primary chrome)
    expect(screen.getByTestId("admin-svg-inventory-search")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-filter-artifact")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-filter-lifecycle")).toBeInTheDocument();
    expect(screen.getByTestId("preview-stub")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open side-table-001 identity/i })).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-validation-side-table-001")).toHaveTextContent(
      /^Published$/,
    );
    expect(screen.getByTestId("admin-svg-last-change-side-table-001")).toBeInTheDocument();

    // Only header New linear desk is primary on the list surface
    const primaries = document.querySelectorAll(".admin-btn--primary");
    expect(primaries).toHaveLength(1);
    expect(primaries[0]).toHaveAttribute(
      "data-testid",
      "admin-shell-primary-action",
    );
  });
});
