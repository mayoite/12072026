import { describe, it, expect, vi } from "vitest";
import AdminCrmIndexPage from "@/app/admin/crm/page";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (href: string) => mockRedirect(href),
}));

describe("app/admin/crm/page.tsx", () => {
  it("redirects to the projects shell", () => {
    AdminCrmIndexPage();

    expect(mockRedirect).toHaveBeenCalledWith("/admin/crm/projects/");
  });
});
