import { describe, expect, it } from "vitest";
import {
  OANDO_FINISHES,
  getFinishesForCategory,
} from "@/features/planner/lib/finishVariants";

describe("finishVariants", () => {
  it("lists curated finishes", () => {
    expect(OANDO_FINISHES.length).toBeGreaterThanOrEqual(5);
    expect(OANDO_FINISHES.every((f) => f.id && f.colorHex)).toBe(true);
  });

  it("filters finishes by furniture category", () => {
    const seating = getFinishesForCategory("seating");
    expect(seating.every((f) => ["fabric", "metal", "wood"].includes(f.category))).toBe(
      true,
    );
    const unknown = getFinishesForCategory("not-a-category");
    expect(unknown).toEqual(OANDO_FINISHES);
  });
});
