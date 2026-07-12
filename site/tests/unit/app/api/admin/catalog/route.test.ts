import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/catalog/route";
import {
  listStandardCatalog,
  createStandardCatalog,
} from "@/features/planner/admin/api/catalogAdminHandlers";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/features/planner/admin/api/catalogAdminHandlers", () => ({
  listStandardCatalog: vi.fn(),
  createStandardCatalog: vi.fn(),
}));

describe("app/api/admin/catalog/route.ts", () => {
  it("GET delegates to listStandardCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalog");
    await (GET as (req: NextRequest) => Promise<unknown>)(req);
    expect(listStandardCatalog).toHaveBeenCalledWith(req);
  });

  it("POST delegates to createStandardCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/catalog", { method: "POST" });
    await (POST as (req: NextRequest) => Promise<unknown>)(req);
    expect(createStandardCatalog).toHaveBeenCalledWith(req);
  });
});
