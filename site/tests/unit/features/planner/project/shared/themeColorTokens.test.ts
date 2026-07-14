import { describe, expect, it } from "vitest";
import {
  PLANNER_COLOR_TOKENS,
  ROOM_FILL_TOKENS,
  FALLBACK_CATEGORY_TOKENS,
  FALLBACK_DEFAULT_TOKENS,
} from "@/features/planner/project/shared/themeColorTokens";

describe("themeColorTokens", () => {
  it("exposes wall and room token maps", () => {
    expect(PLANNER_COLOR_TOKENS.wallDefault.length).toBeGreaterThan(0);
    expect(Object.keys(ROOM_FILL_TOKENS).length).toBeGreaterThan(0);
    expect(Object.keys(FALLBACK_CATEGORY_TOKENS).length).toBeGreaterThan(0);
    expect(Object.keys(FALLBACK_DEFAULT_TOKENS).length).toBeGreaterThan(0);
  });
});
