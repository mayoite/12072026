import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "@/app/admin/page";

vi.mock("@/features/admin/dashboard/AdminDashboardPageView", () => ({
  default: () => <div data-testid="admin-dashboard-page-view">Admin dashboard</div>,
}));

describe("app/admin/page.tsx", () => {
  it("renders the admin dashboard page view", () => {
    render(<AdminDashboard />);
    expect(screen.getByTestId("admin-dashboard-page-view")).toBeInTheDocument();
    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });
});
