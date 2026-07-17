import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminWorkspaceCatalogPage from "@/app/admin/workspace-catalog/page";

vi.mock("@/features/admin/workspace-catalog/AdminWorkspaceCatalogPageView", () => ({
  default: () => (
    <div data-testid="admin-workspace-catalog-view">Workspace catalog</div>
  ),
}));

describe("app/admin/workspace-catalog/page.tsx", () => {
  it("renders AdminWorkspaceCatalogPageView under the admin route", () => {
    render(<AdminWorkspaceCatalogPage />);
    expect(
      screen.getByTestId("admin-workspace-catalog-view"),
    ).toBeInTheDocument();
  });
});
