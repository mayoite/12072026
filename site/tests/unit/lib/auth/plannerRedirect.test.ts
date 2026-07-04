import { describe, it, expect } from "vitest";
import { sanitizeNextPath, buildAccessRedirect } from "@/lib/auth/plannerRedirect";

describe("plannerRedirect", () => {
  it("sanitizes next paths correctly", () => {
    expect(sanitizeNextPath("/dashboard")).toBe("/dashboard");
    expect(sanitizeNextPath("http://external.com")).toBe("/choose-product");
    expect(sanitizeNextPath("//malicious")).toBe("/choose-product");
    expect(sanitizeNextPath(null)).toBe("/choose-product");
  });

  it("builds access redirect URLs", () => {
    expect(buildAccessRedirect("/dashboard")).toBe("/access?next=%2Fdashboard");
    expect(buildAccessRedirect(null)).toBe("/access?next=%2Fchoose-product");
  });
});
