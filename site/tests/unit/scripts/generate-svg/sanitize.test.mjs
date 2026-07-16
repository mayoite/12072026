import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isSvgSafe, sanitizeSvg } from "../../features/planner/project/catalog/svg/svgSanitizer.ts";

describe("svg sanitizer", () => {
  const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100"/></svg>`;

  it("accepts clean svg and fragment-only use references", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><symbol id="shape"><rect width="10" height="10"/></symbol></defs><use href="#shape"/></svg>`;
    const result = sanitizeSvg(svg);
    assert.equal(result.safe, true);
    assert.equal(isSvgSafe(svg), true);
  });

  it("rejects script elements", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`);
    assert.equal(result.safe, false);
    assert.match(result.issues[0] ?? "", /script/);
  });

  it("rejects inline event handlers", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="bad()"/></svg>`);
    assert.equal(result.safe, false);
    assert.match(result.issues[0] ?? "", /blocked attribute|blocked event attribute/);
  });

  it("rejects foreignObject", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div/></foreignObject></svg>`);
    assert.equal(result.safe, false);
  });

  it("rejects javascript urls in href attributes", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><image href="javascript:alert(1)"/></svg>`);
    assert.equal(result.safe, false);
    assert.match(result.issues[0] ?? "", /unsafe URL reference/);
  });

  it("rejects external use references", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><use href="https://example.com/icon.svg#shape"/></svg>`);
    assert.equal(result.safe, false);
    assert.match(result.issues[0] ?? "", /unsafe URL reference/);
  });

  it("rejects oversized attribute values", () => {
    const oversized = `<svg xmlns="http://www.w3.org/2000/svg"><rect data-label="${"x".repeat(4_100)}"/></svg>`;
    const result = sanitizeSvg(oversized);
    assert.equal(result.safe, false);
    assert.match(result.issues[0] ?? "", /oversized attribute value/);
  });

  it("rejects malformed roots", () => {
    assert.equal(sanitizeSvg(`<div>no svg</div>`).safe, false);
    assert.equal(sanitizeSvg(cleanSvg.replace("</svg>", "")).safe, false);
  });
});
