import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import CrmLegacyLayout from "@/app/crm/layout";
import { requireAuthUser } from "@/lib/auth/session";

vi.mock("@/lib/auth/session", () => ({
  requireAuthUser: vi.fn(),
}));

describe("CRM Legacy Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require admin user on the target path and render children", async () => {
    (requireAuthUser as any).mockResolvedValue({ id: "admin-1" });

    const layoutElement = await CrmLegacyLayout({
      children: <div data-testid="crm-child">CRM Content</div>,
    });
    
    const { getByTestId } = render(layoutElement);
    expect(getByTestId("crm-child")).toBeDefined();
    expect(requireAuthUser).toHaveBeenCalledWith("/admin/crm/projects", "admin");
  });
});
