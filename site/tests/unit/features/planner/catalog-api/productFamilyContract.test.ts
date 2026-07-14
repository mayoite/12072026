import { describe, expect, it } from "vitest";
import {
  PRODUCT_FAMILY_SCHEMA_VERSION,
  PRODUCT_FAMILY_V1_FIXTURE,
  getFamilyVersion,
  parseProductFamilyV1,
  validateFamilyConfiguration,
} from "@/features/planner/catalog-api/productFamilyContract";

describe("productFamilyContract", () => {
  it("pins schema version and exposes fixture", () => {
    expect(PRODUCT_FAMILY_SCHEMA_VERSION).toBe(1);
    expect(PRODUCT_FAMILY_V1_FIXTURE.familySlug).toBe("linear-desk-family");
    expect(PRODUCT_FAMILY_V1_FIXTURE.activeVersionId).toBe("v1");
  });

  it("resolves active version from fixture", () => {
    const version = getFamilyVersion(PRODUCT_FAMILY_V1_FIXTURE, "v1");
    expect(version).not.toBeNull();
    expect(version?.status).toBe("released");
    expect(version?.optionGroups.length).toBeGreaterThanOrEqual(2);
  });

  it("validates a complete configuration as ok", () => {
    const version = getFamilyVersion(PRODUCT_FAMILY_V1_FIXTURE, "v1");
    expect(version).not.toBeNull();
    const result = validateFamilyConfiguration(version!, [
      "size-1200",
      "finish-oak",
    ]);
    expect(result.ok).toBe(true);
  });

  it("rejects missing required choices", () => {
    const version = getFamilyVersion(PRODUCT_FAMILY_V1_FIXTURE, "v1");
    expect(version).not.toBeNull();
    const result = validateFamilyConfiguration(version!, ["size-1200"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === "group_under_min")).toBe(true);
    }
  });

  it("re-parse fixture through planner boundary", () => {
    const again = parseProductFamilyV1(PRODUCT_FAMILY_V1_FIXTURE);
    expect(again.familyId).toBe(PRODUCT_FAMILY_V1_FIXTURE.familyId);
  });
});
