import { describe, expect, it } from "vitest";
import {
  assertNoDesignerStaticGlb,
  isSystemGeneratedGlbUrl,
  rejectDesignerStaticGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";

describe("glbAssetPolicy — no designer static GLB", () => {
  it("allows empty and generated paths", () => {
    expect(rejectDesignerStaticGlbUrl(undefined)).toBeNull();
    expect(rejectDesignerStaticGlbUrl("")).toBeNull();
    expect(
      rejectDesignerStaticGlbUrl(
        "https://cdn.example/catalog-assets/generated/foo.glb",
      ),
    ).toBeNull();
    expect(rejectDesignerStaticGlbUrl("blob:http://localhost/abc")).toBeNull();
    expect(
      isSystemGeneratedGlbUrl(
        "https://x/storage/v1/object/public/catalog-assets/generated/x.glb",
      ),
    ).toBe(true);
  });

  it("rejects designer / arbitrary static GLB URLs", () => {
    const reason = rejectDesignerStaticGlbUrl(
      "https://cdn.example.com/models/sofa-hero.glb",
    );
    expect(reason).toMatch(/not allowed/i);
    expect(() =>
      assertNoDesignerStaticGlb("https://cdn.example.com/models/sofa-hero.glb"),
    ).toThrow(/not allowed/i);
  });
});
