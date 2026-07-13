import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminSvgEditorListView } from "@/features/planner/admin/svg-editor/AdminSvgEditorListView";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

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

vi.mock("@/features/planner/admin/svg-editor/PublishedSvgPreview", () => ({
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
} as unknown as BlockDescriptor;

describe("ADM-SVG-01 primary no-code SVG journey", () => {
  it("presents visual authoring as primary and keeps bulk CSV advanced", () => {
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
    expect(copy).toHaveTextContent(/visual studio/i);
    expect(copy).toHaveTextContent(/do not need to edit JSON/i);
    expect(copy.textContent ?? "").not.toMatch(/Zod|atomic-rename|pipeline/i);

    const primary = screen.getByTestId("admin-svg-primary-new");
    expect(primary).toHaveAttribute("href", "/admin/svg-editor/new");
    expect(primary).toHaveClass("admin-btn--primary");
    expect(primary).toHaveTextContent(/New SVG symbol/);

    const advanced = screen.getByTestId("admin-svg-advanced-import");
    expect(advanced.tagName.toLowerCase()).toBe("details");
    expect(advanced).not.toHaveAttribute("open");
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).toHaveClass(
      "admin-btn--outline",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).not.toHaveClass(
      "admin-btn--primary",
    );

    expect(screen.getByRole("link", { name: /side-table-001/i })).toHaveAttribute(
      "href",
      "/admin/svg-editor/side-table-001",
    );
  });
});
