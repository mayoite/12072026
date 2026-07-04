import { describe, it, expect, vi } from "vitest";
import CrmIndexPage from "@/app/crm/page";
import { redirect } from "next/navigation";
import { CRM_PROJECTS_PATH } from "@/features/crm/crmRoutes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/crm/crmRoutes", () => ({
  CRM_PROJECTS_PATH: "/admin/crm/projects",
}));

describe("CRM Index Page Redirect", () => {
  it("should redirect to CRM projects path", () => {
    CrmIndexPage();
    expect(redirect).toHaveBeenCalledWith(`${CRM_PROJECTS_PATH}/`);
  });
});
