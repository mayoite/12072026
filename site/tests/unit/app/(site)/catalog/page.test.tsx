import { describe, it, expect, vi } from "vitest";
import { permanentRedirect } from "next/navigation";
import CatalogPage from "@/app/(site)/catalog/page";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn(),
}));

describe("app/(site)/catalog/page.tsx", () => {
  it("hard-permanentRedirects to /downloads (no soft marketing shell)", () => {
    CatalogPage();
    expect(permanentRedirect).toHaveBeenCalledWith("/downloads");
  });
});
