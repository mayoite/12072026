import { describe, it, expect, vi } from "vitest";
import OpsCustomerQueriesRedirectPage from "@/app/ops/customer-queries/page";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Ops Customer Queries Redirect Page", () => {
  it("should redirect to admin customer queries", () => {
    OpsCustomerQueriesRedirectPage();
    expect(redirect).toHaveBeenCalledWith("/admin/customer-queries");
  });
});
