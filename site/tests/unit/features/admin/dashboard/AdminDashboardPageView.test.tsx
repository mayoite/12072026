import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboardPageView from "@/features/admin/dashboard/AdminDashboardPageView";

describe("AdminDashboardPageView (name-mirror)", () => {
  it("renders compact dashboard hub with card grid", () => {
    const { container } = render(<AdminDashboardPageView />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(container.querySelector(".grid")).toBeTruthy();
    expect(container.querySelectorAll(".shell-admin-card").length).toBeGreaterThan(3);
    expect(container.querySelector(".admin-page__header")).not.toHaveAttribute("style");
  });
});
