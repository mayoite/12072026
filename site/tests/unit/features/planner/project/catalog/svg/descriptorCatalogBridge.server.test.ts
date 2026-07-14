import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/svg/descriptorCatalogBridge.server";

describe("project/catalog/svg/descriptorCatalogBridge.server.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["mapDescriptorToCatalogItem","mapDescriptorsToCatalogItems"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
