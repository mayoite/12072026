import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminCatalogListView } from "@/features/admin/catalog/AdminCatalogListView";

vi.mock("@/features/admin/catalog/AdminCatalogManager", () => ({
  AdminCatalogManager: ({
    title,
    catalogType,
  }: {
    title: string;
    catalogType: string;
  }) => (
    <div data-testid="mock-catalog-manager">
      <h1>{title}</h1>
      <span>Type: {catalogType}</span>
    </div>
  ),
}));

describe("AdminCatalogListView (name-mirror)", () => {
  it("passes props to AdminCatalogManager", () => {
    render(
      <AdminCatalogListView
        title="Standard catalog"
        description="desc"
        catalogType="standard"
      />,
    );
    expect(screen.getByTestId("mock-catalog-manager")).toBeInTheDocument();
    expect(screen.getByText("Type: standard")).toBeInTheDocument();
  });
});
