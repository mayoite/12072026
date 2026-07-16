import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AdminLayoutShell from "@/features/admin/ui/AdminLayoutShell";

const mockUsePathname = vi.fn(() => "/admin");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: ({ variant }: { variant?: string }) => (
    <div data-testid="mock-logo" data-variant={variant ?? "orange"} />
  ),
}));

describe("AdminLayoutShell (name-mirror)", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/admin");
  });

  it("renders nav and children", () => {
    render(
      <AdminLayoutShell>
        <div data-testid="child">content</div>
      </AdminLayoutShell>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-logo").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Dashboard/i }).length).toBeGreaterThan(0);
  });

  it("exposes mobile menu toggle, Console badge, and landmark labels", () => {
    render(
      <AdminLayoutShell>
        <div>content</div>
      </AdminLayoutShell>,
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-controls", "admin-mobile-sidebar");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByLabelText("Admin navigation")).toBeInTheDocument();
    expect(screen.getByText("Console")).toBeInTheDocument();
    expect(screen.getByText("One&Only Admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View site" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Open planner" })).toHaveAttribute(
      "href",
      "/planner/guest",
    );
  });

  it("shows current page context from nav", () => {
    mockUsePathname.mockReturnValue("/admin/settings");
    render(
      <AdminLayoutShell>
        <div>content</div>
      </AdminLayoutShell>,
    );
    expect(document.querySelector(".shell-admin-context__title")?.textContent).toBe(
      "Settings",
    );
    expect(screen.getByText("Now")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("marks only the deepest CRM route as current (not Hub + Projects)", () => {
    mockUsePathname.mockReturnValue("/admin/crm/projects");
    render(
      <AdminLayoutShell>
        <div>content</div>
      </AdminLayoutShell>,
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Hub" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("can collapse a nav group", () => {
    render(
      <AdminLayoutShell>
        <div>content</div>
      </AdminLayoutShell>,
    );
    const catalogToggle = screen.getByRole("button", { name: /Catalog/i });
    expect(catalogToggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(catalogToggle);
    expect(catalogToggle).toHaveAttribute("aria-expanded", "false");
  });
});



