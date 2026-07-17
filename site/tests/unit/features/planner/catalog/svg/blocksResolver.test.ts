import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/svg/blocksResolver";

describe("catalog/svg/blocksResolver.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["resolveBlocks","resolveBlockRows","assertResolvedNonEmpty","BlockResolverError"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
