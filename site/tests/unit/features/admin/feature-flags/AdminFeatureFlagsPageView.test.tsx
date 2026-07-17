import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminFeatureFlagsPageView from "@/features/admin/feature-flags/AdminFeatureFlagsPageView";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
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

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  const status = init.status ?? (init.ok === false ? 500 : 200);
  const ok = init.ok ?? (status >= 200 && status < 300);
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe("AdminFeatureFlagsPageView (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads flags and shows source", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({
        success: true,
        flags: { flag_a: true, flag_b: false },
        source: "database",
      }),
    );

    render(<AdminFeatureFlagsPageView />);

    await waitFor(() =>
      expect(apiPath).toHaveBeenCalledWith("/api/admin/features"),
    );
    expect(await screen.findByText("Source: database")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Feature flags" })).toBeInTheDocument();

    const switchA = await screen.findByRole("switch", { name: /Flag A/i });
    const switchB = await screen.findByRole("switch", { name: /Flag B/i });
    expect(switchA).toHaveAttribute("aria-checked", "true");
    expect(switchB).toHaveAttribute("aria-checked", "false");
  });

  it("surfaces load failure", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({}, { ok: false, status: 500 }),
    );

    render(<AdminFeatureFlagsPageView />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to load feature flags (500)",
    );
  });

  it("PATCHes toggle via browserApiFetch (CSRF-bearing client)", async () => {
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          flags: { flag_a: false, flag_b: true },
          source: "database",
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ source: "updated-db" }));

    render(<AdminFeatureFlagsPageView />);

    const switchA = await screen.findByRole("switch", { name: /Flag A/i });
    expect(switchA).toHaveAttribute("aria-checked", "false");

    fireEvent.click(switchA);

    await waitFor(() => {
      expect(browserApiFetch).toHaveBeenLastCalledWith(
        "/api/admin/features",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ updates: { flag_a: true } }),
        }),
      );
    });

    await waitFor(() => {
      expect(switchA).toHaveAttribute("aria-checked", "true");
    });
    expect(screen.getByText("Source: updated-db")).toBeInTheDocument();
  });

  it("keeps prior flag state when PATCH fails", async () => {
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          flags: { flag_a: false, flag_b: true },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          { error: { message: "Permission denied" } },
          { ok: false, status: 403 },
        ),
      );

    render(<AdminFeatureFlagsPageView />);

    const switchA = await screen.findByRole("switch", { name: /Flag A/i });
    fireEvent.click(switchA);

    expect(await screen.findByRole("alert")).toHaveTextContent("Permission denied");
    expect(switchA).toHaveAttribute("aria-checked", "false");
  });
});
