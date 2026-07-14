import { describe, expect, it } from "vitest";
import { extractCanvasPlacements } from "@/features/planner/ai/extractCanvasPlacements";

describe("extractCanvasPlacements", () => {
  it("returns empty array (archive fabric runtime removed)", () => {
    expect(extractCanvasPlacements()).toEqual([]);
    expect(extractCanvasPlacements(null)).toEqual([]);
  });
});
