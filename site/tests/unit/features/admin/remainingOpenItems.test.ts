/**
 * Residual open Admin items — unit proof (no browser, no released-row mutation).
 */

import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  declareSvgEditSources,
  formatDataSourceBanner,
} from "@/features/admin/svg-editor/adminDataSourceEditability";
import {
  loadProductFamilyFromSerialized,
  planFamilyVersionReplacement,
  roundTripProductFamily,
  serializeProductFamily,
} from "@/features/shared/catalog/productFamilyPersistence";
import {
  PRODUCT_FAMILY_V1_FIXTURE,
  getFamilyVersion,
} from "@/features/shared/catalog/productFamilyContract";
import {
  nextLifecycleAfterAction,
  placementPolicyForLifecycle,
  preservesRetiredIdentityInExistingDesigns,
  retirementConfirmMessage,
} from "@/features/admin/svg-editor/catalogRetirement";
import {
  applyBulkLifecycle,
  previewBulkLifecycle,
} from "@/features/admin/svg-editor/bulkLifecycleBatch";
import {
  adminPhoneCapabilities,
  phoneAuthoringBlockedMessage,
  phoneListLayoutMode,
} from "@/features/admin/adminMobileReview";
import { assertDraftNotStale } from "@/features/admin/svg-editor/staleDraftPublishGate";
import { placementPolicyForReleasedSlug } from "@/features/planner/catalog-api/releasedCatalogBoundary";
import { setCatalogLifecycle, readLifecycleManifest } from "@/features/admin/svg-editor/catalogLifecycle";
import { bulkImportBlockDescriptors } from "@/features/admin/svg-editor/bulkImportBlockDescriptors";

describe("ADM-STATE-02 data-source editability", () => {
  it("declares editable vs read-only sources before write", () => {
    const live = declareSvgEditSources({
      catalogLifecycle: "live",
      hasOnPublishAction: true,
    });
    expect(live.every((s) => s.mode === "editable")).toBe(true);
    const retired = declareSvgEditSources({
      catalogLifecycle: "retired",
      hasOnPublishAction: true,
    });
    expect(retired.every((s) => s.mode === "read-only")).toBe(true);
    expect(formatDataSourceBanner(retired)).toMatch(/Read-only/);
  });
});

describe("Phase 3 family save/reload + migration", () => {
  it("round-trips family version and options", () => {
    const again = roundTripProductFamily(PRODUCT_FAMILY_V1_FIXTURE);
    expect(again).toEqual(PRODUCT_FAMILY_V1_FIXTURE);
    expect(again.versions[0]?.optionGroups.length).toBeGreaterThan(0);
  });

  it("requires explicit migration decision for released version replace", () => {
    const version = getFamilyVersion(PRODUCT_FAMILY_V1_FIXTURE, "v1")!;
    const blocked = planFamilyVersionReplacement({
      family: PRODUCT_FAMILY_V1_FIXTURE,
      nextVersion: { ...version, status: "released" },
      decision: "block",
    });
    expect(blocked.allowed).toBe(false);
    expect(blocked.message).toMatch(/explicit migration/i);

    const keep = planFamilyVersionReplacement({
      family: PRODUCT_FAMILY_V1_FIXTURE,
      nextVersion: {
        ...version,
        versionId: "v2",
        status: "released",
      },
      decision: "keep-both",
    });
    expect(keep.allowed).toBe(true);
    expect(keep.nextFamily?.versions.map((v) => v.versionId)).toEqual(
      expect.arrayContaining(["v1", "v2"]),
    );
    expect(keep.nextFamily?.activeVersionId).toBe("v1");
  });

  it("serialize/load preserves selection of options", () => {
    const raw = serializeProductFamily(PRODUCT_FAMILY_V1_FIXTURE);
    const loaded = loadProductFamilyFromSerialized(raw);
    expect(loaded.versions[0]?.optionGroups[0]?.options[0]?.optionId).toBe(
      "size-1200",
    );
  });
});

describe("product retire / restore / placement", () => {
  it("blocks new placement when retired; keeps identity policy for existing designs", () => {
    expect(placementPolicyForLifecycle("retired").allowed).toBe(false);
    expect(placementPolicyForLifecycle("live").allowed).toBe(true);
    expect(placementPolicyForReleasedSlug("draft").allowed).toBe(false);
    expect(preservesRetiredIdentityInExistingDesigns()).toBe(true);
  });

  it("retire and restore transitions", () => {
    expect(nextLifecycleAfterAction("live", "retire")).toEqual({
      ok: true,
      next: "retired",
    });
    expect(nextLifecycleAfterAction("retired", "restore")).toEqual({
      ok: true,
      next: "live",
    });
    expect(retirementConfirmMessage("side-table-001", "retire")).toMatch(
      /Impact/,
    );
  });

  it("retire on isolated dir without deleting descriptor history", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "retire-"));
    try {
      const imported = bulkImportBlockDescriptors(
        `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
retire-me-001,OFL-R,fixed,600,600,750,live`,
        dir,
      );
      expect(imported.ok).toBe(true);
      setCatalogLifecycle("retire-me-001", "retired", dir);
      const manifest = readLifecycleManifest(dir);
      expect(manifest["retire-me-001"]?.state).toBe("retired");
      setCatalogLifecycle("retire-me-001", "live", dir);
      expect(readLifecycleManifest(dir)["retire-me-001"]?.state).toBe("live");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("ADM-BULK-01 lifecycle batch preview + apply", () => {
  it("previews retire batch and applies when all valid", () => {
    const preview = previewBulkLifecycle(
      [
        { slug: "a", lifecycle: "live" },
        { slug: "b", lifecycle: "draft" },
      ],
      "retire",
    );
    expect(preview.canApply).toBe(true);
    const applied: string[] = [];
    const result = applyBulkLifecycle(preview, (slug, next) => {
      applied.push(`${slug}:${next}`);
    });
    expect(result.ok).toBe(true);
    expect(applied).toEqual(["a:retired", "b:retired"]);
  });

  it("blocks batch when any row cannot transition", () => {
    const preview = previewBulkLifecycle(
      [{ slug: "a", lifecycle: "live" }],
      "restore",
    );
    expect(preview.canApply).toBe(false);
  });
});

describe("ADM-MOB-01..03 phone review declarations", () => {
  it("declares supported list review and unsupported authoring", () => {
    const caps = adminPhoneCapabilities();
    expect(caps.find((c) => c.capability === "list-review")?.supported).toBe(
      true,
    );
    expect(caps.find((c) => c.capability === "svg-authoring")?.supported).toBe(
      false,
    );
    expect(phoneAuthoringBlockedMessage()).toMatch(/unsupported on phone/i);
    expect(phoneListLayoutMode()).toBe("cards-priority");
  });
});

describe("DB-SVG-09 stale draft publish gate", () => {
  it("rejects when baseline stamps diverge without writing", () => {
    const ok = assertDraftNotStale({
      slug: "x",
      clientBaselineGeneratedAt: 100,
      serverBaselineGeneratedAt: 100,
    });
    expect(ok.ok).toBe(true);
    const stale = assertDraftNotStale({
      slug: "x",
      clientBaselineGeneratedAt: 100,
      serverBaselineGeneratedAt: 200,
    });
    expect(stale.ok).toBe(false);
    if (stale.ok) return;
    expect(stale.error).toMatch(/baseline changed/i);
  });
});
