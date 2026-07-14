import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/catalogs/[type]/route";
import {
  listConfiguratorCatalog,
  createConfiguratorCatalog,
  listStandardCatalog,
  createStandardCatalog,
  resolveCatalogType,
} from "@/features/admin/api/catalogAdminHandlers";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/features/admin/api/catalogAdminHandlers", () => ({
  listConfiguratorCatalog: vi.fn(),
  createConfiguratorCatalog: vi.fn(),
  listStandardCatalog: vi.fn(),
  createStandardCatalog: vi.fn(),
  resolveCatalogType: vi.fn((type: string) => (type === "standard" ? "standard" : "configurator")),
}));

describe("app/api/admin/catalogs/[type]/route.ts", () => {
  it("GET uses listStandardCatalog for standard type", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalogs/standard");
    const ctx = { params: Promise.resolve({ type: "standard" }) };
    await (GET as (req: NextRequest, _auth: unknown, ctx: typeof ctx) => Promise<unknown>)(
      req,
      null,
      ctx,
    );
    expect(resolveCatalogType).toHaveBeenCalledWith("standard");
    expect(listStandardCatalog).toHaveBeenCalledWith(req);
  });

  it("GET uses listConfiguratorCatalog for configurator type", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalogs/configurator");
    const ctx = { params: Promise.resolve({ type: "configurator" }) };
    await (GET as (req: NextRequest, _auth: unknown, ctx: typeof ctx) => Promise<unknown>)(
      req,
      null,
      ctx,
    );
    expect(listConfiguratorCatalog).toHaveBeenCalledWith(req);
  });

  it("POST uses createStandardCatalog for standard type", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalogs/standard", { method: "POST" });
    const ctx = { params: Promise.resolve({ type: "standard" }) };
    await (POST as (req: NextRequest, _auth: unknown, ctx: typeof ctx) => Promise<unknown>)(
      req,
      null,
      ctx,
    );
    expect(createStandardCatalog).toHaveBeenCalledWith(req);
  });

  it("POST uses createConfiguratorCatalog for buddy alias", async () => {
    vi.mocked(resolveCatalogType).mockReturnValue("configurator" as never);
    const req = new NextRequest("http://localhost/api/admin/catalogs/buddy", { method: "POST" });
    const ctx = { params: Promise.resolve({ type: "buddy" }) };
    await (POST as (req: NextRequest, _auth: unknown, ctx: typeof ctx) => Promise<unknown>)(
      req,
      null,
      ctx,
    );
    expect(createConfiguratorCatalog).toHaveBeenCalledWith(req);
  });
});
