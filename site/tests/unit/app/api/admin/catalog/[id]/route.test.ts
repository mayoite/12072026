import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "@/app/api/admin/catalog/[id]/route";
import {
  patchStandardCatalog,
  deleteStandardCatalog,
} from "@/lib/api/catalogAdminHandlers";

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/lib/api/catalogAdminHandlers", () => ({
  patchStandardCatalog: vi.fn(),
  deleteStandardCatalog: vi.fn(),
}));

const routeContext = { params: Promise.resolve({ id: "std-1" }) };

describe("app/api/admin/catalog/[id]/route.ts", () => {
  it("PATCH delegates to patchStandardCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalog/std-1", { method: "PATCH" });
    await (PATCH as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(patchStandardCatalog).toHaveBeenCalledWith(req, "std-1");
  });

  it("DELETE delegates to deleteStandardCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalog/std-1", { method: "DELETE" });
    await (DELETE as (req: NextRequest, _auth: unknown, ctx: typeof routeContext) => Promise<unknown>)(
      req,
      null,
      routeContext,
    );
    expect(deleteStandardCatalog).toHaveBeenCalledWith("std-1");
  });
});
