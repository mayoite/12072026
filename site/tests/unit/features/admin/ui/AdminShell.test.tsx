import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { AdminShell } from "@/features/admin/ui/AdminShell";

const mockUsePathname = vi.fn(() => "/admin");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock Link from next/link to just render anchor tag
describe("AdminShell", () => {
  it("renders headers, sidebar links with active states, and children correctly", () => {
    mockUsePathname.mockReturnValue("/admin/settings");

    const { getByText, getByRole } = render(
      <AdminShell>
        <div data-testid="child-content">Main Dashboard Content</div>
      </AdminShell>
    );

    expect(getByText("Oando Admin Platform")).toBeDefined();
    expect(getByText("Admin Portal")).toBeDefined();
    expect(getByText("Main Dashboard Content")).toBeDefined();

    // Verify nav links
    const dashboardLink = getByRole("link", { name: /Dashboard/i });
    const settingsLink = getByRole("link", { name: /Settings/i });

    expect(dashboardLink.getAttribute("href")).toBe("/admin");
    expect(settingsLink.getAttribute("href")).toBe("/admin/settings");

    // settingsLink should have active class since pathname is /admin/settings
    expect(settingsLink.className).toContain("shell-admin-nav-link--active");
    expect(dashboardLink.className).not.toContain("shell-admin-nav-link--active");
  });
});
