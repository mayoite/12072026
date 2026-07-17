import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminPlanDetailPage from "@/app/admin/plans/[id]/page";

vi.mock("@/features/admin/plans/AdminPlanDetailPageView", () => ({
  default: () => <div data-testid="admin-plan-detail-view">Plan detail</div>,
}));

describe("app/admin/plans/[id]/page.tsx", () => {
  it("renders AdminPlanDetailPageView under the admin route", () => {
    render(<AdminPlanDetailPage />);
    expect(screen.getByTestId("admin-plan-detail-view")).toBeInTheDocument();
  });
});
