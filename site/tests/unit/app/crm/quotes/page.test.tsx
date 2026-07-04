import { describe, it, expect, vi } from "vitest";
import CrmQuotesRedirectPage from "@/app/crm/quotes/page";
import { redirect } from "next/navigation";
import { CRM_QUOTES_PATH } from "@/features/crm/crmRoutes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/crm/crmRoutes", () => ({
  CRM_QUOTES_PATH: "/admin/crm/quotes",
}));

describe("CRM Quotes Redirect Page", () => {
  it("should redirect to CRM quotes path", () => {
    CrmQuotesRedirectPage();
    expect(redirect).toHaveBeenCalledWith(`${CRM_QUOTES_PATH}/`);
  });
});
