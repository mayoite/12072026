import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlansManagement from "@/app/admin/plans/page";

vi.mock("@/features/admin/plans/AdminPlansPageView", () => ({
  default: () => <div data-testid="admin-plans-view">Plans</div>,
}));

describe("app/admin/plans/page.tsx", () => {
  it("renders AdminPlansPageView under the admin route", () => {
    render(<PlansManagement />);
    expect(screen.getByTestId("admin-plans-view")).toBeInTheDocument();
  });
});
