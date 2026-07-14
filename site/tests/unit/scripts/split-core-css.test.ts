// @vitest-environment node
/**
 * Name-mirror: scripts/split-core-css.mjs
 */
import { describe, expect, it } from "vitest";
import {
  MAX_HARD,
  MAX_SOFT,
  planFile,
  splitByMarkers,
  trimTrailingBlank,
} from "../../../scripts/split-core-css.mjs";

describe("split-core-css (name-mirror)", () => {
  it("exposes soft and hard line limits", () => {
    expect(MAX_SOFT).toBe(350);
    expect(MAX_HARD).toBe(500);
    expect(MAX_HARD).toBeGreaterThan(MAX_SOFT);
  });

  it("splits merged CSS by section markers and keeps preamble", () => {
    const lines = [
      "/* banner */",
      "/* --- spacing.css --- */",
      ".a { margin: 0; }",
      "/* --- colors.css --- */",
      ".b { color: red; }",
    ];
    const sections = splitByMarkers(lines);
    expect(sections.map((s) => s.name)).toEqual([
      "_preamble",
      "spacing.css",
      "colors.css",
    ]);
    expect(sections[1].lines.join("\n")).toContain(".a");
    expect(sections[2].lines.join("\n")).toContain(".b");
  });

  it("plans files under hard limit without sub-splitting", () => {
    const lines = Array.from({ length: 10 }, (_, i) => `.c${i} { display: block; }`);
    const pieces = planFile("utilities-spacing.css", lines);
    expect(pieces).toHaveLength(1);
    expect(pieces[0].name).toBe("spacing.css");
    expect(pieces[0].lineCount).toBe(10);
  });

  it("trims trailing blank lines", () => {
    expect(trimTrailingBlank(["a", "", "  ", ""])).toEqual(["a"]);
  });
});
