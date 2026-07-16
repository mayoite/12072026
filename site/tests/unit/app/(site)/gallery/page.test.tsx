import { describe, it, expect, vi, beforeEach } from "vitest";
import { permanentRedirect } from "next/navigation";
import Page from "@/app/(site)/gallery/page";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

describe("app/(site)/gallery/page.tsx", () => {
  beforeEach(() => vi.clearAllMocks());
  it("redirects to /portfolio", () => {
    expect(() => Page()).toThrow("NEXT_REDIRECT");
    expect(permanentRedirect).toHaveBeenCalledWith("/portfolio");
  });
});
