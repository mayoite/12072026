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

  it("re-exports the same pure helpers as shared", () => {
    expect(admin.getFamilyVersion).toBe(shared.getFamilyVersion);
    expect(admin.validateFamilyConfiguration).toBe(
      shared.validateFamilyConfiguration,
    );
    expect(admin.formatFamilyConfigError).toBe(shared.formatFamilyConfigError);
    expect(admin.previewFamilyConfiguration).toBe(
      shared.previewFamilyConfiguration,
    );
    expect(admin.buildDraftFamilyFromForm).toBe(shared.buildDraftFamilyFromForm);
    expect(admin.ProductFamilyV1Schema).toBe(shared.ProductFamilyV1Schema);
  });

  it("getFamilyVersion resolves released fixture version and misses unknowns", () => {
    const family = admin.PRODUCT_FAMILY_V1_FIXTURE;
    expect(admin.getFamilyVersion(family, "v1")?.status).toBe("released");
    expect(admin.getFamilyVersion(family, "missing")).toBeNull();
  });

  it("validateFamilyConfiguration fails closed on incomplete selection", () => {
    const version = admin.getFamilyVersion(admin.PRODUCT_FAMILY_V1_FIXTURE, "v1");
    expect(version).not.toBeNull();
    if (!version) throw new Error("expected version");
    const empty = admin.validateFamilyConfiguration(version, []);
    expect(empty.ok).toBe(false);
    if (empty.ok) return;
    expect(empty.errors.some((e) => e.code === "group_under_min")).toBe(true);

    const valid = admin.validateFamilyConfiguration(version, [
      "size-1200",
      "finish-oak",
    ]);
    expect(valid.ok).toBe(true);
  });

  it("previewFamilyConfiguration fails for unknown version and succeeds for valid pick", () => {
    const family = admin.PRODUCT_FAMILY_V1_FIXTURE;
    const missing = admin.previewFamilyConfiguration(family, "nope", [
      "size-1200",
      "finish-oak",
    ]);
    expect(missing.ok).toBe(false);
    if (missing.ok) return;
    expect(missing.formattedErrors[0]).toMatch(/not found/i);

    const ok = admin.previewFamilyConfiguration(family, "v1", [
      "size-1200",
      "finish-oak",
    ]);
    expect(ok.ok).toBe(true);
    if (!ok.ok) return;
    expect(ok.preview.matchingIdentities).toBe(true);
    expect(ok.preview.identity2d.widthMm).toBe(1200);
    expect(ok.preview.identityBoq.lineIdentities).toContain("DSK-1200");
  });

  it("buildDraftFamilyFromForm produces a draft-status family", () => {
    const family = admin.buildDraftFamilyFromForm({
      familyId: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
      familySlug: "linear-desk-family",
      name: "Draft desk family",
      versionId: "v-draft",
      optionGroups: admin.PRODUCT_FAMILY_V1_FIXTURE.versions[0]!.optionGroups,
      compatibilityRules: [],
    });
    expect(family.activeVersionId).toBeNull();
    expect(family.versions[0]?.status).toBe("draft");
    expect(family.versions[0]?.versionId).toBe("v-draft");
  });

  it("rejects invalid family payloads via parseProductFamilyV1", () => {
    expect(() => admin.parseProductFamilyV1({ schemaVersion: 99 })).toThrow();
  });
});
