import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminSvgEditorListView } from "@/features/admin/svg-editor/views/AdminSvgEditorListView";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

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

vi.mock("@/features/admin/svg-editor/publish/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => <span data-testid="preview-stub" />,
}));

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
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

describe("AdminSvgEditorListView (name-mirror)", () => {
  it("renders inventory row for descriptor", () => {
    const { container } = render(
      <AdminSvgEditorListView
        descriptors={[descriptor]}
        refreshedAtLabel="test-time"
        artifactStatuses={{
          "side-table-001": {
            state: "published",
            publicUrl: "/svg-catalog/side-table-001.svg",
          } as never,
        }}
        lifecycleManifest={{}}
      />,
    );
    expect(screen.getByText(/side-table-001/i)).toBeInTheDocument();
    expect(container.querySelector("[data-testid='admin-svg-inventory'] [style]")).toBeNull();
  });
});
