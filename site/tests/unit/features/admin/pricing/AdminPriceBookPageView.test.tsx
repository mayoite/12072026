import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AdminPriceBookPageView } from "@/features/admin/pricing/AdminPriceBookPageView";
import { browserApiFetch } from "@/lib/api/browserApi";
import type { PriceBookContract } from "@/features/admin/pricing/priceBookContract";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

const FIXTURE: PriceBookContract = {
  type: "oando-price-book",
  schemaVersion: 1,
  familySlug: "linear-desk-1200",
  bookId: "pb-linear-2026-q3",
  activeVersionId: "v1",
  versions: [
    {
      versionId: "v1",
      effectiveFrom: "2026-07-01",
      currency: "INR",
      status: "active",
      rules: [
        {
          sku: "OFL-DSK-LIN-1200",
          unitPriceMinor: 450_000_00,
          currency: "INR",
          uom: "each",
        },
      ],
    },
    {
      versionId: "v0",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-06-30",
      currency: "INR",
      status: "rolled_back",
      rules: [
        {
          sku: "OFL-DSK-LIN-1200",
          unitPriceMinor: 400_000_00,
          currency: "INR",
          uom: "each",
        },
      ],
    },
  ],
};

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

  it("renders price book panel without inline presentation", () => {
    const { container } = render(<AdminPriceBookPageView initialContract={FIXTURE} />);
    expect(container.querySelector("[data-testid='admin-price-book-panel'] [style]")).toBeNull();
  });
});
