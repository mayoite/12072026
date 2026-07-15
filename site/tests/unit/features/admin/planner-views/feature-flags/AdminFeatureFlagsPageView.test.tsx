import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import React from "react";
import AdminFeatureFlagsPageView from "@/features/admin/feature-flags/AdminFeatureFlagsPageView";
import { browserApiFetch, apiPath } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((path) => path),
  browserApiFetch: vi.fn(),
}));

vi.mock("@/features/planner/lib/featureFlags", () => ({
  getAllFlagsGrouped: () => [
    {
      group: "General",
      flags: [
        { name: "flag_a", description: "Flag A", defaultValue: false },
        { name: "flag_b", description: "Flag B", defaultValue: true },
      ],
    },
  ],
}));

describe("AdminFeatureFlagsPageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays feature flags on mount", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        flags: { flag_a: true, flag_b: false },
        source: "database",
      }),
    };
    vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

    await act(async () => {
      render(<AdminFeatureFlagsPageView />);
    });

    await waitFor(() => expect(apiPath).toHaveBeenCalledWith("/api/admin/features"));
    expect(screen.getByText("Source: database")).toBeInTheDocument();

    const switchA = await screen.findByRole("switch", { name: /Flag A/i });
    const switchB = await screen.findByRole("switch", { name: /Flag B/i });
    expect(switchA).toHaveAttribute("aria-checked", "true");
    expect(switchB).toHaveAttribute("aria-checked", "false");
  });

  it("handles loading failure on mount", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };
    vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

    await act(async () => {
      render(<AdminFeatureFlagsPageView />);
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("Failed to load feature flags (500)");
  });

  it("allows toggling a feature flag via PATCH", async () => {
    const mockLoadResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        flags: { flag_a: false, flag_b: true },
        source: "database",
      }),
    };
    const mockPatchResponse = {
      ok: true,
      status: 200,
      json: async () => ({ source: "updated-db" }),
    };

    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(mockLoadResponse as any)
      .mockResolvedValueOnce(mockPatchResponse as any);

    await act(async () => {
      render(<AdminFeatureFlagsPageView />);
    });

    const switchA = await screen.findByRole("switch", { name: /Flag A/i });
    expect(switchA).toHaveAttribute("aria-checked", "false");

    await act(async () => {
      fireEvent.click(switchA);
    });

    expect(browserApiFetch).toHaveBeenLastCalledWith(
      "/api/admin/features",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ updates: { flag_a: true } }),
      }),
    );

    expect(switchA).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Source: updated-db")).toBeInTheDocument();
  });

  it("handles patching failure correctly", async () => {
    const mockLoadResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        flags: { flag_a: false, flag_b: true },
      }),
    };
    const mockPatchResponse = {
      ok: false,
      status: 403,
      json: async () => ({ error: { message: "Permission denied" } }),
    };

    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(mockLoadResponse as any)
      .mockResolvedValueOnce(mockPatchResponse as any);

    await act(async () => {
      render(<AdminFeatureFlagsPageView />);
    });

    const switchA = await screen.findByRole("switch", { name: /Flag A/i });
    await act(async () => {
      fireEvent.click(switchA);
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("Permission denied");
    expect(switchA).toHaveAttribute("aria-checked", "false");
  });
});
