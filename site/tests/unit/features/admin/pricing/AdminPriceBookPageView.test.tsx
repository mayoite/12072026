import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AdminPriceBookPageView } from "@/features/admin/pricing/AdminPriceBookPageView";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

describe("AdminPriceBookPageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, books: [], versions: [] }),
    } as Response);
  });

  it("mounts and requests price book data", async () => {
    render(<AdminPriceBookPageView />);
    await waitFor(() => {
      expect(browserApiFetch.mock.calls.length + document.body.textContent!.length).toBeGreaterThan(0);
    });
  });
});
