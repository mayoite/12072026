import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/buddy-catalog/route";
import {
  listConfiguratorCatalog,
  createConfiguratorCatalog,
} from "@/lib/api/catalogAdminHandlers";

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: unknown) => handler,
}));

vi.mock("@/lib/api/catalogAdminHandlers", () => ({
  listConfiguratorCatalog: vi.fn(),
  createConfiguratorCatalog: vi.fn(),
}));

describe("app/api/admin/buddy-catalog/route.ts", () => {
  it("GET delegates to listConfiguratorCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/buddy-catalog");
    await (GET as (req: NextRequest) => Promise<unknown>)(req);
    expect(listConfiguratorCatalog).toHaveBeenCalledWith(req);
  });

  it("POST delegates to createConfiguratorCatalog", async () => {
    const req = new NextRequest("http://localhost/api/admin/buddy-catalog", { method: "POST" });
    await (POST as (req: NextRequest) => Promise<unknown>)(req);
    expect(createConfiguratorCatalog).toHaveBeenCalledWith(req);
  });
});
