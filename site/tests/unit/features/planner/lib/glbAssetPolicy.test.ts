import { describe, expect, it } from "vitest";
import {
  GENERATED_GLB_PATH_MARKER,
  assertNoDesignerStaticGlb,
  isSystemGeneratedGlbUrl,
  rejectDesignerStaticGlbUrl,
  resolveFurnitureGlbUrl,
  shouldLoadGlb,
} from "@/features/planner/lib/glbAssetPolicy";

const GENERATED_REL = `${GENERATED_GLB_PATH_MARKER}modular/cab-v0.glb`;
const GENERATED_ABS = `https://cdn.example/storage/v1/object/public/${GENERATED_GLB_PATH_MARKER}cab.glb`;
const DESIGNER = "https://cdn.example.com/models/sofa-hero.glb";

describe("glbAssetPolicy — isSystemGeneratedGlbUrl matrix", () => {
  it("returns false for empty / whitespace", () => {
    expect(isSystemGeneratedGlbUrl("")).toBe(false);
    expect(isSystemGeneratedGlbUrl("   ")).toBe(false);
  });

  it("allows blob: previews (any host)", () => {
    expect(isSystemGeneratedGlbUrl("blob:http://localhost/abc")).toBe(true);
    expect(isSystemGeneratedGlbUrl("blob:https://cdn.example/x")).toBe(true);
    expect(isSystemGeneratedGlbUrl("  blob:null  ")).toBe(true);
  });

  it("allows relative and absolute paths under catalog-assets/generated/", () => {
    expect(isSystemGeneratedGlbUrl(GENERATED_REL)).toBe(true);
    expect(isSystemGeneratedGlbUrl(`/${GENERATED_REL}`)).toBe(true);
    expect(isSystemGeneratedGlbUrl(GENERATED_ABS)).toBe(true);
    expect(
      isSystemGeneratedGlbUrl(
        "https://x/storage/v1/object/public/catalog-assets/generated/x.glb",
      ),
    ).toBe(true);
  });

  it("rejects non-generated catalog and designer static paths", () => {
    expect(
      isSystemGeneratedGlbUrl("catalog-assets/static/sofa.glb"),
    ).toBe(false);
    expect(isSystemGeneratedGlbUrl("/models/kenney/chair.glb")).toBe(false);
    expect(isSystemGeneratedGlbUrl(DESIGNER)).toBe(false);
    expect(
      isSystemGeneratedGlbUrl("https://cdn.example/catalog-assets/hand/x.glb"),
    ).toBe(false);
  });

  it("rejects marker spoofed only in query string", () => {
    expect(
      isSystemGeneratedGlbUrl(
        `https://evil.example/models/x.glb?p=${GENERATED_GLB_PATH_MARKER}`,
      ),
    ).toBe(false);
    expect(
      isSystemGeneratedGlbUrl(
        "https://evil.example/models/x.glb?catalog-assets/generated/=1",
      ),
    ).toBe(false);
    expect(
      isSystemGeneratedGlbUrl(
        `${DESIGNER}?redirect=${encodeURIComponent(GENERATED_REL)}`,
      ),
    ).toBe(false);
  });

  it("rejects marker spoofed only in hash fragment", () => {
    expect(
      isSystemGeneratedGlbUrl(
        `https://evil.example/models/x.glb#${GENERATED_GLB_PATH_MARKER}`,
      ),
    ).toBe(false);
    expect(
      isSystemGeneratedGlbUrl(
        "https://evil.example/models/x.glb#/catalog-assets/generated/x.glb",
      ),
    ).toBe(false);
  });

  it("rejects query+hash combined spoof while path is designer", () => {
    expect(
      isSystemGeneratedGlbUrl(
        `https://evil.example/static/sofa.glb?v=1&path=${GENERATED_GLB_PATH_MARKER}#${GENERATED_GLB_PATH_MARKER}x.glb`,
      ),
    ).toBe(false);
  });

  it("still allows real generated path even when query/hash also present", () => {
    expect(
      isSystemGeneratedGlbUrl(`${GENERATED_ABS}?token=abc#frag`),
    ).toBe(true);
    expect(
      isSystemGeneratedGlbUrl(`/${GENERATED_REL}?download=1`),
    ).toBe(true);
  });
});

describe("glbAssetPolicy — reject / assert gates", () => {
  it("allows empty and generated paths", () => {
    expect(rejectDesignerStaticGlbUrl(undefined)).toBeNull();
    expect(rejectDesignerStaticGlbUrl(null)).toBeNull();
    expect(rejectDesignerStaticGlbUrl("")).toBeNull();
    expect(rejectDesignerStaticGlbUrl("   ")).toBeNull();
    expect(rejectDesignerStaticGlbUrl(GENERATED_ABS)).toBeNull();
    expect(rejectDesignerStaticGlbUrl("blob:http://localhost/abc")).toBeNull();
  });

  it("rejects designer / arbitrary static GLB URLs with reason", () => {
    const reason = rejectDesignerStaticGlbUrl(DESIGNER);
    expect(reason).toMatch(/not allowed/i);
    expect(reason).toContain(GENERATED_GLB_PATH_MARKER);
    expect(() => assertNoDesignerStaticGlb(DESIGNER)).toThrow(/not allowed/i);
    expect(() =>
      assertNoDesignerStaticGlb(DESIGNER, "meshUrl"),
    ).toThrow(/^meshUrl:/);
  });

  it("reject/assert also close query and hash spoof vectors", () => {
    const querySpoof = `https://evil.example/models/x.glb?p=${GENERATED_GLB_PATH_MARKER}`;
    const hashSpoof = `https://evil.example/models/x.glb#${GENERATED_GLB_PATH_MARKER}`;
    expect(rejectDesignerStaticGlbUrl(querySpoof)).toMatch(/not allowed/i);
    expect(rejectDesignerStaticGlbUrl(hashSpoof)).toMatch(/not allowed/i);
    expect(() => assertNoDesignerStaticGlb(querySpoof)).toThrow(/not allowed/i);
    expect(() => assertNoDesignerStaticGlb(hashSpoof)).toThrow(/not allowed/i);
  });

  it("assertNoDesignerStaticGlb is no-op for allowed urls", () => {
    expect(() => assertNoDesignerStaticGlb(undefined)).not.toThrow();
    expect(() => assertNoDesignerStaticGlb(GENERATED_REL)).not.toThrow();
    expect(() =>
      assertNoDesignerStaticGlb("blob:http://localhost/preview"),
    ).not.toThrow();
  });
});

describe("glbAssetPolicy — shouldLoadGlb + resolveFurnitureGlbUrl", () => {
  it("shouldLoadGlb mirrors isSystemGeneratedGlbUrl for non-empty urls", () => {
    expect(shouldLoadGlb(null)).toBe(false);
    expect(shouldLoadGlb(undefined)).toBe(false);
    expect(shouldLoadGlb("")).toBe(false);
    expect(shouldLoadGlb(GENERATED_REL)).toBe(true);
    expect(shouldLoadGlb(DESIGNER)).toBe(false);
    expect(
      shouldLoadGlb(
        `https://evil.example/models/x.glb?p=${GENERATED_GLB_PATH_MARKER}`,
      ),
    ).toBe(false);
    expect(
      shouldLoadGlb(
        `https://evil.example/models/x.glb#${GENERATED_GLB_PATH_MARKER}`,
      ),
    ).toBe(false);
  });

  it("resolveFurnitureGlbUrl preference order and trim", () => {
    expect(
      resolveFurnitureGlbUrl({
        generatedGlbUrl: "  catalog-assets/generated/a.glb  ",
        glbUrl: "catalog-assets/generated/b.glb",
        meshUrl: "catalog-assets/generated/c.glb",
      }),
    ).toBe("catalog-assets/generated/a.glb");
    expect(
      resolveFurnitureGlbUrl({
        generatedGlbUrl: "  ",
        glbUrl: null,
        meshUrl: "catalog-assets/generated/c.glb",
      }),
    ).toBe("catalog-assets/generated/c.glb");
    expect(resolveFurnitureGlbUrl({})).toBeNull();
  });
});
