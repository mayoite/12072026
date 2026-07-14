import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/inventory/inventoryIndex";

describe("project/catalog/inventory/inventoryIndex.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["InventorySearchIndex"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
