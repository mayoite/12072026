import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchAdminCatalog,
  createAdminCatalogItem,
  patchAdminCatalogItem,
  deleteAdminCatalogItem,
} from "@/features/admin/api/adminCatalogClient";
import { browserApiFetch, apiPath } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((path) => path),
  browserApiFetch: vi.fn(),
}));

describe("adminCatalogClient API functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminCatalog", () => {
    it("fetches the correct standard catalog path with query parameters", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ success: true, items: [] }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      const result = await fetchAdminCatalog("standard", { page: 1, limit: 10, search: "desk" });

      expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/standard?page=1&limit=10&search=desk");
      expect(browserApiFetch).toHaveBeenCalled();
      expect(result).toEqual({ success: true, items: [] });
    });

    it("resolves configurator and buddy catalogs to configurator path", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ success: true, items: [] }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      await fetchAdminCatalog("buddy");
      expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/configurator");

      await fetchAdminCatalog("configurator");
      expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/configurator");
    });

    it("throws appropriate error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({ error: { message: "Invalid parameters" } }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      await expect(fetchAdminCatalog("standard")).rejects.toThrow("Invalid parameters");
    });

    it("throws error with string error fallback", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({ error: "Server crashed" }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      await expect(fetchAdminCatalog("standard")).rejects.toThrow("Server crashed");
    });

    it("throws fallback error when no message details exist", async () => {
      const mockResponse = {
        ok: false,
        status: 502,
        json: async () => ({}),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      await expect(fetchAdminCatalog("standard")).rejects.toThrow("Request failed (502)");
    });
  });

  describe("createAdminCatalogItem", () => {
    it("creates standard catalog item with correct payload", async () => {
      const payload = { name: "New Table", category: "Tables" };
      const mockResponse = {
        ok: true,
        status: 201,
        json: async () => ({ success: true, item: { id: "item-1", ...payload } }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      const result = await createAdminCatalogItem("standard", payload);

      expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/standard");
      expect(browserApiFetch).toHaveBeenCalledWith(
        "/api/admin/catalogs/standard",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("patchAdminCatalogItem", () => {
    it("patches standard catalog item", async () => {
      const payload = { name: "Updated Table" };
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ success: true, item: { id: "item-1", ...payload } }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      const result = await patchAdminCatalogItem("standard", "item-1", payload);

      expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/standard/item-1");
      expect(browserApiFetch).toHaveBeenCalledWith(
        "/api/admin/catalogs/standard/item-1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("deleteAdminCatalogItem", () => {
    it("deletes standard catalog item successfully", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      await expect(deleteAdminCatalogItem("standard", "item-1")).resolves.toBeUndefined();
      expect(apiPath).toHaveBeenCalledWith("/api/admin/catalogs/standard/item-1");
    });

    it("throws error when deletion fails", async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        json: async () => ({ error: "Forbidden action" }),
      };
      vi.mocked(browserApiFetch).mockResolvedValue(mockResponse as any);

      await expect(deleteAdminCatalogItem("standard", "item-1")).rejects.toThrow("Forbidden action");
    });
  });
});
