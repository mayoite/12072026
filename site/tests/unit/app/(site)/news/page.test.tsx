import { describe, it, expect, vi, beforeEach } from "vitest";
import { permanentRedirect } from "next/navigation";
import Page from "@/app/(site)/news/page";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

describe("app/(site)/news/page.tsx", () => {
  beforeEach(() => vi.clearAllMocks());
  it("redirects to /about", () => {
    expect(() => Page()).toThrow("NEXT_REDIRECT");
    expect(permanentRedirect).toHaveBeenCalledWith("/about");
  });
});
