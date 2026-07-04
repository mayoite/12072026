import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import OpsLayout from "@/app/ops/layout";
import { requireAuthUser } from "@/lib/auth/session";

vi.mock("@/lib/auth/session", () => ({
  requireAuthUser: vi.fn(),
}));

describe("Ops Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require admin user on the customer-queries path and render children", async () => {
    (requireAuthUser as any).mockResolvedValue({ id: "admin-1" });

    const layoutElement = await OpsLayout({
      children: <div data-testid="ops-child">Ops Content</div>,
    });

    const { getByTestId } = render(layoutElement);
    expect(getByTestId("ops-child")).toBeDefined();
    expect(requireAuthUser).toHaveBeenCalledWith("/admin/customer-queries", "admin");
  });
});
