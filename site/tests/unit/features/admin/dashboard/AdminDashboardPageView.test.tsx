import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboardPageView from "@/features/admin/dashboard/AdminDashboardPageView";

describe("AdminDashboardPageView (name-mirror)", () => {
  it("renders compact dashboard hub with KPI strip and card grid", () => {
    const { container } = render(<AdminDashboardPageView />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Quick operations")).toBeInTheDocument();
    expect(container.querySelectorAll(".admin-kpi").length).toBe(4);
    expect(container.querySelector(".grid")).not.toBeNull();
    expect(container.querySelectorAll(".shell-admin-card").length).toBeGreaterThan(3);
    expect(container.querySelector(".admin-page__header")).not.toHaveAttribute("style");
  });

  it("renders hub sections and CRM browser-storage warning", () => {
    render(<AdminDashboardPageView />);
    expect(screen.getByRole("heading", { name: /Planner operations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Catalog" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /CRM & ops/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "System" })).toBeInTheDocument();
    expect(screen.getByText(/Browser-only CRM storage\./i)).toBeInTheDocument();
  });
});
