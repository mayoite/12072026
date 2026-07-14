import { describe, expect, it, beforeEach } from "vitest";
import {
  normalizeTokenName,
  themeColorRef,
  readFallbackPaintColors,
  readThemeColor,
} from "@/features/planner/project/shared/readThemeColor";
import {
  FALLBACK_DEFAULT_TOKENS,
  PLANNER_COLOR_TOKENS,
} from "@/features/planner/project/shared/themeColorTokens";

describe("readThemeColor", () => {
  beforeEach(() => {
    document.documentElement.style.setProperty("--mirror-test-token", "#112233");
    document.documentElement.style.setProperty(
      normalizeTokenName(FALLBACK_DEFAULT_TOKENS.fill),
      "#aaaaaa",
    );
    document.documentElement.style.setProperty(
      normalizeTokenName(FALLBACK_DEFAULT_TOKENS.stroke),
      "#bbbbbb",
    );
  });

  it("normalizes token names and builds refs", () => {
    expect(normalizeTokenName("color-wall")).toBe("--color-wall");
    expect(normalizeTokenName("--color-wall")).toBe("--color-wall");
    const ref = themeColorRef(PLANNER_COLOR_TOKENS.wallDefault);
    expect(ref).toMatch(/^var\(--/);
  });

  it("reads theme tokens and fallback paint colors", () => {
    expect(readThemeColor("--mirror-test-token")).toBe("#112233");
    const colors = readFallbackPaintColors("unknown-category");
    expect(colors.fill).toBe("#aaaaaa");
    expect(colors.stroke).toBe("#bbbbbb");
  });
});
