import { describe, it, expect, vi } from "vitest";
import { fetchConfiguratorCatalogItems } from "@/features/planner/catalog-api/configuratorCatalogApi";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn().mockImplementation((path) => path),
  browserApiFetch: vi.fn(),
}));

describe("configuratorCatalogApi", () => {
  it("returns items from api path", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ id: "cfg-1", name: "Linear WS" }],
        source: "configurator_products",
      }),
    } as Response);

    const result = await fetchConfiguratorCatalogItems();
    expect(result.items.length).toBe(1);
    expect(result.source).toBe("configurator_products");
  });

  it("handles failed api responses cleanly without pretending static configurator data", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: false,
      status: 502,
    } as Response);

    const result = await fetchConfiguratorCatalogItems();
    expect(result.items).toEqual([]);
    expect(result.source).toBe("configurator-fetch-failed");
    expect(result.error).toContain("502");
  });

  it("surfaces network failures honestly", async () => {
    vi.mocked(browserApiFetch).mockRejectedValue(new Error("offline"));
    const result = await fetchConfiguratorCatalogItems();
    expect(result.items).toEqual([]);
    expect(result.source).toBe("configurator-fetch-failed");
    expect(result.error).toBe("offline");
  });
});
