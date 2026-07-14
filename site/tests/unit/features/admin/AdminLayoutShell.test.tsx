import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLayoutShell from "@/features/admin/AdminLayoutShell";

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
});
