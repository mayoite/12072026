import { describe, it, expect, vi } from "vitest";
import { permanentRedirect } from "next/navigation";
import DownloadBrochurePage from "@/app/(site)/download-brochure/page";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn(),
}));

describe("app/(site)/download-brochure/page.tsx", () => {
  it("redirects to the downloads page", () => {
    DownloadBrochurePage();
    expect(permanentRedirect).toHaveBeenCalledWith("/downloads");
  });
});
