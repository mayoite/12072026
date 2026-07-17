import { describe, expect, it } from "vitest";
import {
  RUNTIME_TEXTURE_ASSETS,
  DEMO_MODEL_ASSETS,
} from "@/features/planner/cleanup/assetClassification";

describe("assetClassification", () => {
  it("marks runtime textures and demos as non-production", () => {
    expect(RUNTIME_TEXTURE_ASSETS.length).toBeGreaterThan(0);
    for (const a of RUNTIME_TEXTURE_ASSETS) {
      expect(a.productionAllowed).toBe(false);
      expect(a.ownership).toBe("runtime-editor-cdn");
      expect(a.path.length).toBeGreaterThan(0);
    }
    expect(DEMO_MODEL_ASSETS.length).toBeGreaterThan(0);
    for (const a of DEMO_MODEL_ASSETS) {
      expect(a.productionAllowed).toBe(false);
      expect(a.ownership).toBe("demo-donor-reference");
    }
  });
});
