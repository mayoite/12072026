import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalyticsDashboard from "@/app/admin/analytics/page";

vi.mock("@/features/admin/analytics/AdminAnalyticsPageView", () => ({
  default: () => <div data-testid="admin-analytics-view">Analytics</div>,
}));

describe("app/admin/analytics/page.tsx", () => {
  it("renders the analytics page view under the admin shell route", () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByTestId("admin-analytics-view")).toBeInTheDocument();
  });
});
