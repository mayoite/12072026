import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminAnalyticsPageView from "@/features/admin/analytics/AdminAnalyticsPageView";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  const status = init.status ?? (init.ok === false ? 500 : 200);
  const ok = init.ok ?? (status >= 200 && status < 300);
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

const livePayload = {
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
};

describe("AdminAnalyticsPageView (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads analytics summary from live source", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(jsonResponse(livePayload));

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
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({
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
    );

    render(<AdminAnalyticsPageView />);
    await waitFor(() => {
      expect(screen.getByText(/No plan activity yet/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /Review plans/i })).toHaveAttribute(
      "href",
      "/admin/plans",
    );
  });

  it("reloads when period changes", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(jsonResponse(livePayload));

    render(<AdminAnalyticsPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "7d" } });

    await waitFor(() =>
      expect(apiPath).toHaveBeenLastCalledWith("/api/admin/analytics?period=7d"),
    );
  });

  it("shows error on unauth/failure status", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({}, { ok: false, status: 401 }),
    );

    render(<AdminAnalyticsPageView />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to load analytics (401)",
    );
  });

  it("refresh button reloads", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(jsonResponse(livePayload));

    render(<AdminAnalyticsPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /Refresh/i }));

    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(2));
  });
});
