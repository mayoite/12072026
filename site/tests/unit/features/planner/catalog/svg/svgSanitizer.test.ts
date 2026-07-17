import { describe, expect, it } from "vitest";
import { sanitizeSvg } from "@/features/planner/catalog/svg/svgSanitizer";

describe("svgSanitizer", () => {
  it("keeps safe geometry svg", () => {
    const input =
      '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="10"/></svg>';
    const out = sanitizeSvg(input);
    expect(out.safe).toBe(true);
    expect(out.sanitized).toContain("<rect");
    expect(out.issues).toEqual([]);
  });

  it("rejects script and event handlers", () => {
    const dirty =
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="1" height="1"/></svg>';
    const out = sanitizeSvg(dirty);
    expect(out.safe).toBe(false);
    expect(out.issues.join(" ").toLowerCase()).toMatch(/script/);
    expect(out.sanitized).toBe("");
  });
});
