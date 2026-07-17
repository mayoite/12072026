import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlannerCatalogManagement from "@/app/admin/planner-catalog/page";

vi.mock("@/features/admin/catalog/ConfiguratorCatalogPageView", () => ({
  default: () => (
    <div data-testid="admin-planner-catalog-view">Planner catalog</div>
  ),
}));

describe("app/admin/planner-catalog/page.tsx", () => {
  it("renders ConfiguratorCatalogPageView under the admin route", () => {
    render(<PlannerCatalogManagement />);
    expect(screen.getByTestId("admin-planner-catalog-view")).toBeInTheDocument();
  });
});
