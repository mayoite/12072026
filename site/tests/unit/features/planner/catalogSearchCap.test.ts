import { describe, expect, it } from "vitest";

import {
  OPEN3D_CATALOG_RESULT_CAP,
  capCatalogResults,
} from "@/features/planner/project/catalog/catalogSearch";

/**
 * REC-02 catalogue search cap ≤24 (`00-REVISION.md` Decision 2,
 * `02-PHASE-1.md` §1A).
 */
describe("catalogue result cap (REC-02)", () => {
  it("caps at no more than 24", () => {
    expect(OPEN3D_CATALOG_RESULT_CAP).toBeLessThanOrEqual(24);
    expect(OPEN3D_CATALOG_RESULT_CAP).toBeGreaterThan(0);
  });

  it("truncates lists longer than the cap", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const capped = capCatalogResults(items);
    expect(capped).toHaveLength(OPEN3D_CATALOG_RESULT_CAP);
    expect(capped[0]).toBe(0);
    expect(capped.at(-1)).toBe(OPEN3D_CATALOG_RESULT_CAP - 1);
  });

  it("returns a copy unchanged when within the cap", () => {
    const items = [1, 2, 3];
    const capped = capCatalogResults(items);
    expect(capped).toEqual(items);
    expect(capped).not.toBe(items);
  });

  it("honours an explicit smaller cap", () => {
    expect(capCatalogResults([1, 2, 3, 4, 5], 2)).toEqual([1, 2]);
  });
});
