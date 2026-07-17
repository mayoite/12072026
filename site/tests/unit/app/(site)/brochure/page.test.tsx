import { describe, it, expect, vi } from "vitest";
import { permanentRedirect } from "next/navigation";
import BrochurePage from "@/app/(site)/brochure/page";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn(),
}));

describe("app/(site)/brochure/page.tsx", () => {
  it("hard-permanentRedirects to /downloads (no soft marketing shell)", () => {
    BrochurePage();
    expect(permanentRedirect).toHaveBeenCalledWith("/downloads");
  });
});
