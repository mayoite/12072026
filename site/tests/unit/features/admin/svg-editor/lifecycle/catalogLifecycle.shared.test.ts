import { describe, expect, it } from "vitest";
import {
  CATALOG_LIFECYCLE_MANIFEST,
  inferLifecycleFromArtifact,
  isBuyerVisibleLifecycle,
  isBuyerVisibleSlug,
  resolveCatalogLifecycle,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.shared";

describe("catalogLifecycle.shared", () => {
  it("exports the manifest filename constant", () => {
    expect(CATALOG_LIFECYCLE_MANIFEST).toBe("_catalog-lifecycle.json");
  });

  it("infers lifecycle from artifact state", () => {
    expect(inferLifecycleFromArtifact("published")).toBe("live");
    expect(inferLifecycleFromArtifact("missing")).toBe("draft");
    expect(inferLifecycleFromArtifact("invalid")).toBe("draft");
    expect(inferLifecycleFromArtifact(undefined)).toBe("draft");
  });

  it("prefers manifest entry over artifact inference", () => {
    const manifest = {
      desk: { state: "retired" as const, updatedAt: "2026-07-01T00:00:00.000Z" },
      drafty: { state: "draft" as const, updatedAt: "t" },
    };
    expect(resolveCatalogLifecycle("desk", "published", manifest)).toBe("retired");
    expect(resolveCatalogLifecycle("drafty", "published", manifest)).toBe("draft");
    expect(resolveCatalogLifecycle("unknown", "published", {})).toBe("live");
    expect(resolveCatalogLifecycle("unknown", "missing", {})).toBe("draft");
  });

  it("buyer visibility is live-only when listed; unlisted remains visible", () => {
    expect(isBuyerVisibleLifecycle("live")).toBe(true);
    expect(isBuyerVisibleLifecycle("draft")).toBe(false);
    expect(isBuyerVisibleLifecycle("retired")).toBe(false);

    const manifest = {
      live: { state: "live" as const, updatedAt: "t" },
      retired: { state: "retired" as const, updatedAt: "t" },
      draft: { state: "draft" as const, updatedAt: "t" },
    };
    expect(isBuyerVisibleSlug("unlisted", {})).toBe(true);
    expect(isBuyerVisibleSlug("live", manifest)).toBe(true);
    expect(isBuyerVisibleSlug("retired", manifest)).toBe(false);
    expect(isBuyerVisibleSlug("draft", manifest)).toBe(false);
  });
});
