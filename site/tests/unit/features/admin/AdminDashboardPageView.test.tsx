import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboardPageView from "@/features/admin/AdminDashboardPageView";

describe("AdminDashboardPageView (name-mirror)", () => {
  it("renders platform control hub", () => {
    render(<AdminDashboardPageView />);
    expect(screen.getByText("Platform control")).toBeInTheDocument();
    expect(screen.getByText("Admin backend")).toBeInTheDocument();
  });
});
