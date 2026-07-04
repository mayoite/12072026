import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "@/app/api/admin/configurator-catalog/[id]/route";
import {
  patchConfiguratorCatalog,
  deleteConfiguratorCatalog,
} from "@/lib/api/catalogAdminHandlers";

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/lib/api/catalogAdminHandlers", () => ({
  patchConfiguratorCatalog: vi.fn(),
  deleteConfiguratorCatalog: vi.fn(),
}));

const routeContext = { params: Promise.resolve({ id: "cfg-42" }) };

describe("app/api/admin/configurator-catalog/[id]/route.ts", () => {
  it("PATCH delegates to patchConfiguratorCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/configurator-catalog/cfg-42", {
      method: "PATCH",
    });
    await (PATCH as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(patchConfiguratorCatalog).toHaveBeenCalledWith(req, "cfg-42");
  });

  it("DELETE delegates to deleteConfiguratorCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/configurator-catalog/cfg-42", {
      method: "DELETE",
    });
    await (DELETE as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(deleteConfiguratorCatalog).toHaveBeenCalledWith("cfg-42");
  });
});
