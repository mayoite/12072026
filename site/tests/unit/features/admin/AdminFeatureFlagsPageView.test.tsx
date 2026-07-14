import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminFeatureFlagsPageView from "@/features/admin/AdminFeatureFlagsPageView";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

describe("AdminFeatureFlagsPageView (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders after loading flags", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        flags: { demo_mode: false },
        source: "defaults",
      }),
    } as Response);
    render(<AdminFeatureFlagsPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Feature flags" })).toBeInTheDocument();
    });
    expect(screen.getByText(/Source:/i)).toBeInTheDocument();
  });
});
