import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "@/app/api/admin/buddy-catalog/[id]/route";
import {
  patchConfiguratorCatalog,
  deleteConfiguratorCatalog,
} from "@/features/planner/admin/api/catalogAdminHandlers";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/features/planner/admin/api/catalogAdminHandlers", () => ({
  patchConfiguratorCatalog: vi.fn(),
  deleteConfiguratorCatalog: vi.fn(),
}));

const routeContext = { params: Promise.resolve({ id: "item-1" }) };

describe("app/api/admin/buddy-catalog/[id]/route.ts", () => {
  it("PATCH delegates to patchConfiguratorCatalog with id", async () => {
    const req = new NextRequest("http://localhost/api/admin/buddy-catalog/item-1", {
      method: "PATCH",
    });
    await (PATCH as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(patchConfiguratorCatalog).toHaveBeenCalledWith(req, "item-1");
  });

  it("DELETE delegates to deleteConfiguratorCatalog with id", async () => {
    const req = new NextRequest("http://localhost/api/admin/buddy-catalog/item-1", {
      method: "DELETE",
    });
    await (DELETE as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(deleteConfiguratorCatalog).toHaveBeenCalledWith("item-1");
  });
});
