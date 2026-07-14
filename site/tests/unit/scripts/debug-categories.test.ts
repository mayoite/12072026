// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { debugCategories } from "@/scripts/debug-categories";

describe("debug-categories (name-mirror)", () => {
  it("logs categories from mocked catalog fetch (no network)", async () => {
    const cats = [
      { id: "seating", name: "Seating" },
      { id: "tables", name: "Tables" },
    ];
    const fetchCategories = vi.fn(async () => cats);
    const log = vi.fn();
    const result = await debugCategories({ fetchCategories, log });
    expect(fetchCategories).toHaveBeenCalledOnce();
    expect(result).toEqual(cats);
    expect(log).toHaveBeenCalledWith(cats);
    expect((result as typeof cats).map((c) => c.id)).toEqual(["seating", "tables"]);
  });
});
