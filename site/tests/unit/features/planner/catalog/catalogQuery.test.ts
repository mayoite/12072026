import { describe, expect, it, vi, afterEach } from "vitest";
import * as mod from "@/features/planner/catalog/catalogQuery";
import { loadPlannerCatalog } from "@/features/planner/catalog/catalogQuery";
import { PlannerCatalogClient } from "@/features/planner/catalog/catalogClient";

describe("catalog/catalogQuery.ts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("exposes expected public API symbols", () => {
    const expected = ["PLANNER_CATALOG_QUERY_KEY", "loadPlannerCatalog"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });

  it("does not inject demo catalog when remote APIs are empty (P18/BQ4)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [] }) }),
    );
    const client = new PlannerCatalogClient();
    const result = await loadPlannerCatalog(client);
    expect(result.source).toBe("fallback");
    expect(result.items).toEqual([]);
    expect(result.items.some((i) => /sofa|sample-/i.test(i.id))).toBe(false);
  });
});
