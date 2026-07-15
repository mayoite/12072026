import { describe, expect, it } from "vitest";
import {
  CATALOG_LIFECYCLE_MANIFEST,
  inferLifecycleFromArtifact,
  isBuyerVisibleLifecycle,
  isBuyerVisibleSlug,
  resolveCatalogLifecycle,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.shared";

describe("catalogLifecycle.shared", () => {
  it("resolves lifecycle and buyer visibility", () => {
    expect(CATALOG_LIFECYCLE_MANIFEST).toBe("_catalog-lifecycle.json");
    expect(inferLifecycleFromArtifact("published")).toBe("live");
    expect(inferLifecycleFromArtifact("missing")).toBe("draft");
    const manifest = { x: { state: "retired" as const, updatedAt: "t" } };
    expect(resolveCatalogLifecycle("x", "published", manifest)).toBe("retired");
    expect(isBuyerVisibleLifecycle("live")).toBe(true);
    expect(isBuyerVisibleSlug("y", {})).toBe(true);
    expect(isBuyerVisibleSlug("x", manifest)).toBe(false);
  });
});
