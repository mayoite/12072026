import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLayoutShell from "@/features/admin/ui/AdminLayoutShell";

const mockUsePathname = vi.fn(() => "/admin");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <div data-testid="mock-logo" />,
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
    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Dashboard/i }).length).toBeGreaterThan(0);
  });

  it("exposes mobile menu toggle and landmark labels", () => {
    render(
      <AdminLayoutShell>
        <div>content</div>
      </AdminLayoutShell>,
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-controls", "admin-mobile-sidebar");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByLabelText("Admin navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View site" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Open planner" })).toHaveAttribute(
      "href",
      "/planner/guest",
    );
  });
});
