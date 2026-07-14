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
    } as any);

    const result = await fetchPlannerCatalogItems();
    expect(result.items.length).toBe(1);
    expect(result.source).toBe("database");
  });

  it("handles failed api responses cleanly", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: false,
    } as any);

    const result = await fetchPlannerCatalogItems();
    expect(result.items).toEqual([]);
    expect(result.source).toBe("static");
  });
});
