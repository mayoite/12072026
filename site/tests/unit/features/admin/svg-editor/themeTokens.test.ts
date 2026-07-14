import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_TOKENS, safeThemeTokens } from "@/features/admin/svg-editor/themeTokens";

describe("themeTokens", () => {
  it("defaults and safe merge", () => {
    expect(DEFAULT_THEME_TOKENS.currentColor).toBe("currentColor");
    expect(safeThemeTokens(undefined).currentColor).toBe("currentColor");
    expect(safeThemeTokens({ currentColor: "inherit" }).currentColor).toBe("inherit");
    expect(safeThemeTokens({ currentColor: "inherit" })["--fill-primary"]).toBe(
      DEFAULT_THEME_TOKENS["--fill-primary"],
    );
  });
});
