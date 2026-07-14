import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/assetValidation";

describe("project/catalog/assetValidation.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["validateAssetUrl","validateAssetUrls","isAssetUrlExpired","resolveAssetUrl","addAllowedOrigin","getAllowedOrigins"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
