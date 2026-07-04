import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import React from "react";
import AdminAnalyticsPageView from "@/features/planner/admin/AdminAnalyticsPageView";
import { browserApiFetch, apiPath } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((path) => path),
  browserApiFetch: vi.fn(),
}));

describe("AdminAnalyticsPageView", () => {
  const mockAnalyticsData = {
    success: true,
    summary: { avgArea: 45.2, avgItems: 12, totalPlans: 150 },
    topFurniture: [{ name: "Ergonomic Chair", count: 80, category: "Seating" }],
    exports: [{ format: "PDF", count: 42 }],
    plansCreated: [
      { date: "2026-06-25", count: 5 },
      { date: "2026-06-26", count: 8 },
    ],
    activeUsers: [
      { date: "2026-06-25", activeUsers: 3 },
      { date: "2026-06-26", activeUsers: 4 },
    ],
    source: "database",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays analytics data on mount", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockAnalyticsData,
    };
    vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

    render(<AdminAnalyticsPageView />);

    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());

    expect(apiPath).toHaveBeenCalledWith("/api/admin/analytics?period=30d");
    expect(screen.getByText("Source: database")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument(); // totalPlans
    expect(screen.getByText("12")).toBeInTheDocument(); // avgItems
    expect(screen.getByText("45.2")).toBeInTheDocument(); // avgArea
    expect(screen.getByText("Ergonomic Chair")).toBeInTheDocument();
    expect(screen.getByText("Seating · 80")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("2026-06-26")).toBeInTheDocument();
  });

  it("reloads analytics when the period is changed", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockAnalyticsData,
    };
    vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

    render(<AdminAnalyticsPageView />);

    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());

    const select = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(select, { target: { value: "7d" } });
    });

    await waitFor(() => expect(apiPath).toHaveBeenLastCalledWith("/api/admin/analytics?period=7d"));
  });

  it("handles network failure by showing an error", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({}),
    };
    vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

    render(<AdminAnalyticsPageView />);

    await waitFor(() => screen.getByRole("alert"));

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load analytics (401)");
  });

  it("triggers refresh when clicking Refresh button", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockAnalyticsData,
    };
    vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

    render(<AdminAnalyticsPageView />);

    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());

    const refreshButton = screen.getByRole("button", { name: /Refresh/i });
    await act(async () => {
      fireEvent.click(refreshButton);
    });

    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(2));
  });
});
