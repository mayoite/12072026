import { describe, expect, it } from "vitest";
import {
  removeTagCaseInsensitive,
  sanitizeTags,
  validateTagAddition,
} from "@/features/planner/cloud-store/plannerTagUtils";

describe("plannerTagUtils", () => {
  it("sanitizeTags trims, drops empty/overlong, caps count, dedupes case-insensitively", () => {
    // slice(maxTags) runs before dedupe — overlong/empty removed first.
    const result = sanitizeTags(
      ["  Alpha ", "beta", "ALPHA", "", "toolongtaghere", "gamma"],
      3,
      10,
    );
    expect(result).toEqual(["Alpha", "beta"]);

    const uncapped = sanitizeTags(
      ["  Alpha ", "beta", "ALPHA", "gamma"],
      10,
      10,
    );
    expect(uncapped).toEqual(["Alpha", "beta", "gamma"]);
  });

  it("validateTagAddition rejects empty, overlong, maxed, and duplicate tags", () => {
    expect(validateTagAddition([], "  ", 5, 10)).toEqual({
      success: false,
      error: "Tag cannot be empty",
    });
    expect(validateTagAddition([], "abcdefghijk", 5, 10)).toEqual({
      success: false,
      error: "Tag must be 10 characters or less",
    });
    expect(validateTagAddition(["a", "b"], "c", 2, 10)).toEqual({
      success: false,
      error: "Maximum 2 tags allowed",
    });
    expect(validateTagAddition(["Alpha"], "alpha", 5, 10)).toEqual({
      success: false,
      error: "Tag already exists",
    });
  });

  it("validateTagAddition accepts new valid tag", () => {
    expect(validateTagAddition(["a"], "b", 5, 10)).toEqual({ success: true });
  });

  it("removeTagCaseInsensitive drops matching tag only", () => {
    expect(removeTagCaseInsensitive(["Alpha", "Beta", "Gamma"], "beta")).toEqual([
      "Alpha",
      "Gamma",
    ]);
  });
});
