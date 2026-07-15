import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminCatalogPageView from "@/features/admin/catalog/AdminCatalogPageView";

vi.mock("@/features/admin/catalog/AdminCatalogListView", () => ({
  AdminCatalogListView: ({
    title,
    catalogType,
  }: {
    title: string;
    catalogType: string;
  }) => (
    <div data-testid="list-view">
      {title}:{catalogType}
    </div>
  ),
}));

describe("AdminCatalogPageView", () => {
  it("renders standard catalog list view", () => {
    render(<AdminCatalogPageView />);
    expect(screen.getByTestId("list-view").textContent).toMatch(/standard/i);
  });
});
