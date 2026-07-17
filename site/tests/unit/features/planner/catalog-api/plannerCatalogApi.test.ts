import { describe, it, expect, vi } from "vitest";
import { fetchPlannerCatalogItems } from "@/features/planner/catalog-api/plannerCatalogApi";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn().mockImplementation((path) => path),
  browserApiFetch: vi.fn(),
}));

describe("plannerCatalogApi", () => {
  it("returns items from api path", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ id: "1", name: "Mock Desk" }],
        source: "database",
      }),
    } as Response);

    const result = await fetchPlannerCatalogItems();
    expect(result.items.length).toBe(1);
    expect(result.source).toBe("database");
  });

  it("handles failed api responses cleanly without pretending static managed data", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    const result = await fetchPlannerCatalogItems();
    expect(result.items).toEqual([]);
    expect(result.source).toBe("managed-fetch-failed");
    expect(result.error).toContain("503");
  });

  it("surfaces network failures honestly", async () => {
    vi.mocked(browserApiFetch).mockRejectedValue(new Error("offline"));
    const result = await fetchPlannerCatalogItems();
    expect(result.items).toEqual([]);
    expect(result.source).toBe("managed-fetch-failed");
    expect(result.error).toBe("offline");
  });
});
