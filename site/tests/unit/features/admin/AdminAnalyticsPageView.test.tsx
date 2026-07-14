import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminAnalyticsPageView from "@/features/admin/AdminAnalyticsPageView";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

describe("AdminAnalyticsPageView (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads analytics summary", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        summary: { avgArea: 45.2, avgItems: 12, totalPlans: 150 },
        topFurniture: [],
        exports: [],
        plansCreated: [],
        activeUsers: [],
        source: "database",
      }),
    } as Response);

    render(<AdminAnalyticsPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
    expect(apiPath).toHaveBeenCalledWith("/api/admin/analytics?period=30d");
    await waitFor(() => {
      expect(screen.getByText("Source: database")).toBeInTheDocument();
    });
  });
});
