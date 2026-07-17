import { describe, expect, it } from "vitest";

import {
  PLANNER_CATALOG_RESULT_CAP,
  capCatalogResults,
} from "@/features/planner/catalog/catalogSearch";

/**
 * Inventory catalogue default cap = 50 (owner multi-line multi-SKU floor).
 */
describe("catalogue result cap (50)", () => {
  it("default cap is 50", () => {
    expect(PLANNER_CATALOG_RESULT_CAP).toBe(50);
  });

  it("truncates lists longer than 50", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const capped = capCatalogResults(items);
    expect(capped).toHaveLength(50);
    expect(capped[0]).toBe(0);
    expect(capped.at(-1)).toBe(49);
  });

  it("returns a copy when within the cap", () => {
    const items = [1, 2, 3];
    const capped = capCatalogResults(items);
    expect(capped).toEqual(items);
    expect(capped).not.toBe(items);
  });

  it("honours an explicit smaller cap", () => {
    expect(capCatalogResults([1, 2, 3, 4, 5], 2)).toEqual([1, 2]);
  });
});
