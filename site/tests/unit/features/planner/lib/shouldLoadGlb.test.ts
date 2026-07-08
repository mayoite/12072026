import { describe, expect, it } from "vitest";
import {
  rejectDesignerStaticGlbUrl,
  resolveFurnitureGlbUrl,
  shouldLoadGlb,
} from "@/features/planner/lib/glbAssetPolicy";

describe("shouldLoadGlb (viewer policy gate)", () => {
  it("returns false for empty / null / undefined", () => {
    expect(shouldLoadGlb(null)).toBe(false);
    expect(shouldLoadGlb(undefined)).toBe(false);
    expect(shouldLoadGlb("")).toBe(false);
    expect(shouldLoadGlb("   ")).toBe(false);
  });

  it("allows catalog-assets/generated and blob URLs", () => {
    expect(
      shouldLoadGlb(
        "https://cdn.example/storage/catalog-assets/generated/cab-v0.glb",
      ),
    ).toBe(true);
    expect(shouldLoadGlb("catalog-assets/generated/modular/x.glb")).toBe(true);
    expect(shouldLoadGlb("blob:http://localhost/uuid-here")).toBe(true);
  });

  it("rejects designer / arbitrary static GLB URLs", () => {
    expect(shouldLoadGlb("https://cdn.example.com/models/sofa-hero.glb")).toBe(
      false,
    );
    expect(shouldLoadGlb("/models/kenney/chair.glb")).toBe(false);
    expect(shouldLoadGlb("https://cdn.example/catalog-assets/static/x.glb")).toBe(
      false,
    );
    // Policy reject reason still applies for assert path
    expect(
      rejectDesignerStaticGlbUrl("https://cdn.example.com/models/sofa-hero.glb"),
    ).toMatch(/not allowed/i);
  });
});

describe("resolveFurnitureGlbUrl", () => {
  it("prefers generatedGlbUrl over glbUrl and meshUrl", () => {
    expect(
      resolveFurnitureGlbUrl({
        generatedGlbUrl: "catalog-assets/generated/a.glb",
        glbUrl: "catalog-assets/generated/b.glb",
        meshUrl: "catalog-assets/generated/c.glb",
      }),
    ).toBe("catalog-assets/generated/a.glb");
  });

  it("falls back glbUrl then meshUrl", () => {
    expect(
      resolveFurnitureGlbUrl({
        glbUrl: "catalog-assets/generated/b.glb",
        meshUrl: "catalog-assets/generated/c.glb",
      }),
    ).toBe("catalog-assets/generated/b.glb");
    expect(
      resolveFurnitureGlbUrl({
        meshUrl: "catalog-assets/generated/c.glb",
      }),
    ).toBe("catalog-assets/generated/c.glb");
  });

  it("returns null when all sources empty", () => {
    expect(resolveFurnitureGlbUrl({})).toBeNull();
    expect(
      resolveFurnitureGlbUrl({
        generatedGlbUrl: "  ",
        glbUrl: null,
        meshUrl: undefined,
      }),
    ).toBeNull();
  });
});
