import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ConfiguratorCatalogPageView from "@/features/admin/catalog/ConfiguratorCatalogPageView";

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

describe("ConfiguratorCatalogPageView", () => {
  it("renders configurator catalog list view", () => {
    render(<ConfiguratorCatalogPageView />);
    expect(screen.getByTestId("list-view").textContent).toMatch(/configurator/i);
  });
});
