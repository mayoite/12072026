import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("exposes status chips and demoted advanced bulk", () => {
    render(
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
    const health = screen.getByTestId("artifact-health");
    expect(health).toHaveTextContent(/published/i);
    expect(health).toHaveTextContent(/missing/i);
    expect(screen.getByTestId("admin-shell-state")).toBe(health.closest("[data-testid='admin-shell-state']"));
    const advanced = screen.getByTestId("admin-svg-advanced-import");
    expect(advanced).not.toHaveAttribute("open");
    expect(advanced).toHaveTextContent(/bulk import/i);
  });

  it("AF-05/AF-13: primary journey is symbol authoring; bulk stays advanced; no internal jargon", () => {
    render(
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

    const journey = screen.getByTestId("admin-svg-journey-copy");
    expect(journey).toHaveTextContent(/visual studio|publish/i);
    expect(journey).toHaveTextContent(/do not need to edit/i);
    expect(journey).not.toHaveTextContent(/Zod|pipeline|schema|descriptor/i);

    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent("SVG symbols");
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /New SVG symbol/i,
    );

    const advanced = screen.getByTestId("admin-svg-advanced-import");
    expect(advanced.tagName.toLowerCase()).toBe("details");
    expect(advanced).not.toHaveAttribute("open");
    expect(advanced).toHaveTextContent(/Migration tool only/i);
    expect(advanced).toHaveTextContent(/optional/i);

    const page = screen.getByTestId("admin-svg-primary-journey");
    expect(page.textContent).not.toMatch(/\bZod\b/);
    expect(page.textContent).not.toMatch(/atomic rename/i);
    expect(page.textContent).not.toMatch(/schemaVersion/i);
  });

  it("shows empty source inventory with primary New SVG symbol CTA", () => {
    render(
      <AdminSvgEditorListView
        descriptors={[]}
        refreshedAtLabel="test-time"
        artifactStatuses={{}}
        lifecycleManifest={{}}
      />,
    );
    const empty = screen.getByTestId("admin-svg-inventory-empty-source");
    expect(empty).toHaveTextContent(/No SVG symbols yet/i);
    expect(empty).toHaveTextContent(/visual studio/i);
    const cta = screen.getByTestId("admin-svg-primary-new-empty");
    expect(cta).toHaveAttribute("href", "/admin/svg-editor/new");
    expect(cta).toHaveClass("admin-btn--primary");
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveAttribute(
      "href",
      "/admin/svg-editor/new",
    );
  });
});
