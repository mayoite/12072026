import { describe, it, expect, vi } from "vitest";
import CrmProjectDetailRedirectPage from "@/app/crm/projects/[id]/page";
import { redirect } from "next/navigation";
import { crmProjectDetailPath } from "@/features/crm/crmRoutes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/crm/crmRoutes", () => ({
  crmProjectDetailPath: vi.fn((id) => `/admin/crm/projects/${id}`),
}));

describe("CRM Project Detail Redirect Page", () => {
  it("should resolve params and redirect to detail page path", async () => {
    const params = Promise.resolve({ id: "proj-999" });
    await CrmProjectDetailRedirectPage({ params });
    expect(crmProjectDetailPath).toHaveBeenCalledWith("proj-999");
    expect(redirect).toHaveBeenCalledWith("/admin/crm/projects/proj-999/");
  });
});
