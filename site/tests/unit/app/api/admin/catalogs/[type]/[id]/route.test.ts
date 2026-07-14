import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "@/app/api/admin/catalogs/[type]/[id]/route";
import {
  _patchConfiguratorCatalog,
  deleteConfiguratorCatalog,
  patchStandardCatalog,
  deleteStandardCatalog,
  resolveCatalogType,
} from "@/features/admin/api/catalogAdminHandlers";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/features/admin/api/catalogAdminHandlers", () => ({
  patchConfiguratorCatalog: vi.fn(),
  deleteConfiguratorCatalog: vi.fn(),
  patchStandardCatalog: vi.fn(),
  deleteStandardCatalog: vi.fn(),
  resolveCatalogType: vi.fn((type: string) => (type === "standard" ? "standard" : "configurator")),
}));

const routeContext = { params: Promise.resolve({ type: "standard", id: "item-9" }) };

describe("app/api/admin/catalogs/[type]/[id]/route.ts", () => {
  it("PATCH delegates to patchStandardCatalog for standard type", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalogs/standard/item-9", {
      method: "PATCH",
    });
    await (PATCH as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(patchStandardCatalog).toHaveBeenCalledWith(req, "item-9");
  });

  it("DELETE delegates to deleteConfiguratorCatalog for configurator type", async () => {
    vi.mocked(resolveCatalogType).mockReturnValue("configurator" as never);
    const ctx = { params: Promise.resolve({ type: "configurator", id: "cfg-1" }) };
    const req = new NextRequest("http://localhost/api/admin/catalogs/configurator/cfg-1", {
      method: "DELETE",
    });
    await (DELETE as (req: NextRequest, _auth: unknown, ctx: typeof ctx) => Promise<unknown>)(
      req,
      null,
      ctx,
    );
    expect(deleteConfiguratorCatalog).toHaveBeenCalledWith("cfg-1");
    expect(deleteStandardCatalog).not.toHaveBeenCalled();
  });
});
