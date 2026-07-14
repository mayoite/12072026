import { describe, expect, it } from "vitest";
import * as admin from "@/features/admin/catalog/productFamilyContract";
import * as shared from "@/features/shared/catalog/productFamilyContract";

describe("admin productFamilyContract re-export", () => {
  it("mirrors shared version and fixture", () => {
    expect(admin.PRODUCT_FAMILY_SCHEMA_VERSION).toBe(
      shared.PRODUCT_FAMILY_SCHEMA_VERSION,
    );
    expect(admin.PRODUCT_FAMILY_V1_FIXTURE).toEqual(shared.PRODUCT_FAMILY_V1_FIXTURE);
  });

  it("shares parseProductFamilyV1 identity and parses fixture", () => {
    expect(admin.parseProductFamilyV1).toBe(shared.parseProductFamilyV1);
    const parsed = admin.parseProductFamilyV1(admin.PRODUCT_FAMILY_V1_FIXTURE);
    expect(parsed.name).toBe(admin.PRODUCT_FAMILY_V1_FIXTURE.name);
    expect(parsed.versions.length).toBeGreaterThan(0);
  });
});
