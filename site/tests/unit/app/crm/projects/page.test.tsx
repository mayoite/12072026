import { describe, it, expect, vi } from "vitest";
import CrmProjectsRedirectPage from "@/app/crm/projects/page";
import { redirect } from "next/navigation";
import { CRM_PROJECTS_PATH } from "@/features/crm/crmRoutes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/crm/crmRoutes", () => ({
  CRM_PROJECTS_PATH: "/admin/crm/projects",
}));

describe("CRM Projects Redirect Page", () => {
  it("should redirect to CRM projects path", () => {
    CrmProjectsRedirectPage();
    expect(redirect).toHaveBeenCalledWith(`${CRM_PROJECTS_PATH}/`);
  });
});
