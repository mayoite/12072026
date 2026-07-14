import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AdminLayoutShell from "@/features/admin/AdminLayoutShell";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <div data-testid="mock-logo" />,
}));

describe("AdminLayoutShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/admin");
  });

  it("renders side navigation links and child content", () => {
    render(
      <AdminLayoutShell>
        <div data-testid="admin-child">Dashboard content</div>
      </AdminLayoutShell>
    );

    expect(screen.getByTestId("admin-child")).toBeInTheDocument();
    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    
    // Overview Dashboard link should be rendered
    const dashboardLinks = screen.getAllByRole("link", { name: /Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });

  it("keeps header quick actions accessible by name", () => {
    render(
      <AdminLayoutShell>
        <div />
      </AdminLayoutShell>
    );

    expect(screen.getByRole("link", { name: "View site" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open planner" })).toBeInTheDocument();
  });

  it("assigns active class based on path matching", () => {
    mockUsePathname.mockReturnValue("/admin/plans");
    render(
      <AdminLayoutShell>
        <div />
      </AdminLayoutShell>
    );

    // Plans link should have active class
    const plansLink = screen.getByRole("link", { name: /Plans/i });
    expect(plansLink.className).toContain("shell-admin-nav-link--active");

    // Dashboard link should NOT have active class
    const dashboardLink = screen.getAllByRole("link", { name: /Dashboard/i })[0];
    expect(dashboardLink.className).not.toContain("shell-admin-nav-link--active");
  });

  it("toggles mobile menu open/close", () => {
    render(
      <AdminLayoutShell>
        <div />
      </AdminLayoutShell>
    );

    const toggleButton = screen.getByRole("button", { name: /Open menu/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    // Open mobile sidebar
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-label", "Close menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Close menu by clicking backdrop
    const backdrop = screen.getByLabelText("Close navigation");
    fireEvent.click(backdrop);
    expect(toggleButton).toHaveAttribute("aria-label", "Open menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes mobile menu when clicking nav links", () => {
    render(
      <AdminLayoutShell>
        <div />
      </AdminLayoutShell>
    );

    const toggleButton = screen.getByRole("button", { name: /Open menu/i });
    fireEvent.click(toggleButton); // open

    // Click a nav link
    const plansLink = screen.getByRole("link", { name: /Plans/i });
    fireEvent.click(plansLink);

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
