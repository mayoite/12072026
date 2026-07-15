import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboardPageView from "@/features/admin/dashboard/AdminDashboardPageView";

describe("AdminDashboardPageView (name-mirror)", () => {
  it("renders platform control hub", () => {
    const { container } = render(<AdminDashboardPageView />);
    expect(screen.getByText("Platform control")).toBeInTheDocument();
    expect(screen.getByText("Admin backend")).toBeInTheDocument();
    expect(container.querySelector(".admin-hero__copy")).not.toHaveAttribute("style");
  });
});
