import { describe, it, expect, vi } from "vitest";
import OpsIndexPage from "@/app/ops/page";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Ops Index Page Redirect", () => {
  it("should redirect to admin customer queries path", () => {
    OpsIndexPage();
    expect(redirect).toHaveBeenCalledWith("/admin/customer-queries");
  });
});
