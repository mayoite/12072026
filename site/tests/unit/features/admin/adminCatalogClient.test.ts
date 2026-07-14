import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAdminCatalogItem,
  deleteAdminCatalogItem,
  fetchAdminCatalog,
  patchAdminCatalogItem,
} from "@/features/admin/adminCatalogClient";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

describe("adminCatalogClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAdminCatalog hits standard path with query", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, items: [] }),
    } as Response);
    const result = await fetchAdminCatalog("standard", {
      page: 1,
      limit: 10,
      search: "desk",
    });
    expect(apiPath).toHaveBeenCalledWith(
      "/api/admin/catalogs/standard?page=1&limit=10&search=desk",
    );
    expect(result).toEqual({ success: true, items: [] });
  });

  it("create/patch/delete call browserApiFetch", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response);
    await createAdminCatalogItem("standard", { name: "x" });
    await patchAdminCatalogItem("standard", "id-1", { name: "y" });
    await deleteAdminCatalogItem("standard", "id-1");
    expect(browserApiFetch).toHaveBeenCalledTimes(3);
  });
});
