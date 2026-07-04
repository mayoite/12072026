import { describe, it, expect, vi } from "vitest";
import CrmClientsRedirectPage from "@/app/crm/clients/page";
import { redirect } from "next/navigation";
import { CRM_CLIENTS_PATH } from "@/features/crm/crmRoutes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/crm/crmRoutes", () => ({
  CRM_CLIENTS_PATH: "/admin/crm/clients",
}));

describe("CRM Clients Redirect Page", () => {
  it("should redirect to CRM clients path", () => {
    CrmClientsRedirectPage();
    expect(redirect).toHaveBeenCalledWith(`${CRM_CLIENTS_PATH}/`);
  });
});
