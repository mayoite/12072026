import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminAnalyticsPageView from "@/features/admin/analytics/AdminAnalyticsPageView";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

describe("AdminAnalyticsPageView (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads analytics summary from live source", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        summary: { avgArea: 45.2, avgItems: 12, totalPlans: 150 },
        topFurniture: [{ name: "Task chair", count: 10, category: "seating" }],
        exports: [{ format: "PDF", count: 150 }],
        plansCreated: [
          { date: "2026-07-01", count: 2 },
          { date: "2026-07-02", count: 5 },
        ],
        activeUsers: [
          { date: "2026-07-01", activeUsers: 1 },
          { date: "2026-07-02", activeUsers: 2 },
        ],
        peakDayPlans: 5,
        periodDays: 30,
        databaseConfigured: true,
        furnitureSource: "catalog-sample",
        source: "drizzle_plans",
      }),
    } as Response);

    render(<AdminAnalyticsPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
    expect(apiPath).toHaveBeenCalledWith("/api/admin/analytics?period=30d");
    await waitFor(() => {
      expect(screen.getByText(/Live planner database/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Total plans").closest(".admin-panel")).toHaveTextContent(
      "150",
    );
    expect(screen.getByLabelText(/Bar chart of plans created/i)).toBeInTheDocument();
  });

  it("shows empty state when no plans in period", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        summary: { avgArea: 0, avgItems: 0, totalPlans: 0 },
        topFurniture: [],
        exports: [],
        plansCreated: Array.from({ length: 7 }, (_, i) => ({
          date: `2026-07-0${i + 1}`,
          count: 0,
        })),
        activeUsers: [],
        peakDayPlans: 0,
        periodDays: 7,
        databaseConfigured: true,
        furnitureSource: "none",
        source: "drizzle_plans-empty",
      }),
    } as Response);

    render(<AdminAnalyticsPageView />);
    await waitFor(() => {
      expect(screen.getByText(/No plan activity yet/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /Review plans/i })).toHaveAttribute(
      "href",
      "/admin/plans",
    );
  });
});
