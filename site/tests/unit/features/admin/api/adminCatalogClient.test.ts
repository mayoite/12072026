import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAdminCatalogItem,
  deleteAdminCatalogItem,
  fetchAdminCatalog,
  patchAdminCatalogItem,
} from "@/features/admin/api/adminCatalogClient";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

function mockResponse(init: {
  ok: boolean;
  status: number;
  body?: unknown;
  jsonThrows?: boolean;
}): Response {
  return {
    ok: init.ok,
    status: init.status,
    json: init.jsonThrows
      ? async () => {
          throw new Error("bad json");
        }
      : async () => init.body ?? {},
  } as Response;
}

describe("adminCatalogClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAdminCatalog hits standard path with query", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({ ok: true, status: 200, body: { success: true, items: [] } }),
    );
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

  it("maps buddy and configurator types to configurator path", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({ ok: true, status: 200, body: { items: [] } }),
    );
    await fetchAdminCatalog("buddy");
    expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/configurator");
    await fetchAdminCatalog("configurator", { q: "x" });
    expect(apiPath).toHaveBeenCalledWith(
      "/api/admin/catalogs/configurator?q=x",
    );
  });

  it("omits undefined and empty-string query values", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({ ok: true, status: 200, body: {} }),
    );
    await fetchAdminCatalog("standard", {
      page: 2,
      search: "",
      category: undefined,
      limit: 0,
    });
    expect(apiPath).toHaveBeenCalledWith(
      "/api/admin/catalogs/standard?page=2&limit=0",
    );
  });

  it("create/patch/delete call browserApiFetch with methods and paths", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({ ok: true, status: 200, body: { success: true } }),
    );
    await createAdminCatalogItem("standard", { name: "x" });
    await patchAdminCatalogItem("configurator", "id-1", { name: "y" });
    await deleteAdminCatalogItem("buddy", "id-2");
    expect(browserApiFetch).toHaveBeenCalledTimes(3);
    expect(apiPath).toHaveBeenNthCalledWith(1, "/api/admin/catalogs/standard");
    expect(apiPath).toHaveBeenNthCalledWith(
      2,
      "/api/admin/catalogs/configurator/id-1",
    );
    expect(apiPath).toHaveBeenNthCalledWith(
      3,
      "/api/admin/catalogs/configurator/id-2",
    );
    expect(vi.mocked(browserApiFetch).mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
    });
    expect(vi.mocked(browserApiFetch).mock.calls[1]?.[1]).toMatchObject({
      method: "PATCH",
    });
    expect(vi.mocked(browserApiFetch).mock.calls[2]?.[1]).toMatchObject({
      method: "DELETE",
    });
  });

  it("throws string error from body.error", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({
        ok: false,
        status: 400,
        body: { error: "plain fail" },
      }),
    );
    await expect(fetchAdminCatalog("standard")).rejects.toThrow("plain fail");
  });

  it("throws message from body.error.message", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({
        ok: false,
        status: 422,
        body: { error: { message: "validation failed" } },
      }),
    );
    await expect(
      createAdminCatalogItem("standard", { name: "" }),
    ).rejects.toThrow("validation failed");
  });

  it("falls back to status text when error body is empty or unreadable", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({ ok: false, status: 500, body: {} }),
    );
    await expect(patchAdminCatalogItem("standard", "1", {})).rejects.toThrow(
      "Request failed (500)",
    );

    vi.mocked(browserApiFetch).mockResolvedValue(
      mockResponse({ ok: false, status: 503, jsonThrows: true }),
    );
    await expect(deleteAdminCatalogItem("standard", "1")).rejects.toThrow(
      "Request failed (503)",
    );
  });
});
