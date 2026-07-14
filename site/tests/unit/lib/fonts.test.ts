/**
 * Name-mirror coverage for lib/fonts.
 * next/font/local is globally mocked in tests/setup.ts.
 */
import { describe, expect, it } from "vitest";
import { ciscoSans, helveticaNeue } from "@/lib/fonts";

describe("fonts", () => {
  it("exports ciscoSans and helveticaNeue font objects", () => {
    expect(ciscoSans).toBeDefined();
    expect(helveticaNeue).toBeDefined();
    expect(typeof ciscoSans.className).toBe("string");
    expect(typeof helveticaNeue.className).toBe("string");
  });

  it("provides style.fontFamily for layout consumers", () => {
    expect(ciscoSans.style?.fontFamily).toBeDefined();
    expect(helveticaNeue.style?.fontFamily).toBeDefined();
  });
});
