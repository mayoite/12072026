import { describe, expect, it } from "vitest";

import { sanitizeCatalogSvgMarkup } from "@/features/planner/admin/svg-editor/svgArtifactStatus.server";

describe("sanitizeCatalogSvgMarkup", () => {
  it("accepts a minimal catalog SVG", () => {
    const raw =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0h10v10H0z" fill="currentColor"/></svg>';
    expect(sanitizeCatalogSvgMarkup(raw)).toBe(raw);
  });

  it("rejects markup that is not an svg root", () => {
    expect(sanitizeCatalogSvgMarkup("<div>nope</div>")).toBeNull();
  });

  it("rejects script tags fail-closed", () => {
    const raw =
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    expect(sanitizeCatalogSvgMarkup(raw)).toBeNull();
  });

  it("rejects inline event handlers", () => {
    const raw =
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>';
    expect(sanitizeCatalogSvgMarkup(raw)).toBeNull();
  });
});
