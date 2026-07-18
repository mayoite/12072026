/**
 * C4 load rule under live authority.
 * - disk: /svg-catalog/{slug}.svg may pass published filter
 * - db: only revision API preview URLs count (no disk oracle)
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { filterGuestInventoryCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { formatBoqLineDisplayName } from "@/features/planner/catalog/catalogLabelUtils";
import { placeCatalogItemInProject } from "@/features/planner/catalog/placementAction";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import {
  buildPublishedSvgApiUrl,
  isPublishedSvgApiUrl,
} from "@/features/planner/catalog/svg/svgPreviewAssets";
import { clearLoaderCache } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { createPlannerProject } from "@/features/planner/model/project";
import { buildPlannerFurnitureBoq } from "@/features/planner/shared/export/projectFurnitureBoq";
import { isDbSvgReleaseAuthority } from "@/features/admin/svg-editor/publish/svgReleaseAuthority";

const TARGET_SLUG = "oando-linear-desk-1600";
const TARGET_SKU = "OANDO-LINEAR-DSK-1600";
const FIXTURE_REVISION = "oando-linear-desk-1600-r-testfixture01";

afterEach(() => {
  vi.unstubAllEnvs();
  clearLoaderCache();
});

describe("C4 guest place load rule (parametric desk)", () => {
  it("under db authority: revision API preview URL, not disk", () => {
    vi.stubEnv("SVG_RELEASE_AUTHORITY", "db");
    expect(isDbSvgReleaseAuthority()).toBe(true);

    const descriptors = [
      {
        id: "desk-id-1",
        slug: TARGET_SLUG,
        sku: TARGET_SKU,
        publishedSvgRevisionId: FIXTURE_REVISION,
        geometry: { widthMm: 1600, depthMm: 800, heightMm: 750 },
      },
    ];
    const guestItems = filterGuestInventoryCatalogItems(
      mapDescriptorsToCatalogItems(descriptors),
    );
    const item = guestItems.find((i) => i.slug === TARGET_SLUG);
    expect(item, "guest filter must keep brand parametric desk").toBeDefined();
    expect(item!.sku).toBe(TARGET_SKU);
    const preview = item!.assets.previewImageUrl ?? "";
    expect(isPublishedSvgApiUrl(preview)).toBe(true);
    expect(preview).toBe(buildPublishedSvgApiUrl(FIXTURE_REVISION));
    expect(preview).not.toMatch(/\/svg-catalog\//);
    expect(guestItems.every((i) => i.slug.startsWith("oando-"))).toBe(true);
  });

  it("under db authority: place stamps revision URL + BOQ name · SKU", () => {
    vi.stubEnv("SVG_RELEASE_AUTHORITY", "db");
    const descriptors = [
      {
        id: "desk-id-1",
        slug: TARGET_SLUG,
        sku: TARGET_SKU,
        publishedSvgRevisionId: FIXTURE_REVISION,
        geometry: { widthMm: 1600, depthMm: 800, heightMm: 750 },
      },
    ];
    const guestItems = filterGuestInventoryCatalogItems(
      mapDescriptorsToCatalogItems(descriptors),
    );
    const item = guestItems.find((i) => i.slug === TARGET_SLUG);
    expect(item).toBeDefined();
    if (!item) return;

    let idN = 0;
    const project = createPlannerProject({
      idFactory: () => `c4-id-${idN++}`,
      name: "C4 place BOQ",
      now: "2026-07-18T12:00:00.000Z",
    });
    const { result } = placeCatalogItemInProject(project, item, null, {
      placedFrom: "click",
      position: { x: 2000, y: 2000 },
    });
    const furniture = result.project.floors[0]?.furniture ?? [];
    expect(furniture).toHaveLength(1);
    const placed = furniture[0]!;
    expect(placed.sourceSlug).toBe(TARGET_SLUG);
    expect(placed.sourceSku).toBe(TARGET_SKU);
    expect(isPublishedSvgApiUrl(placed.previewImageUrl ?? "")).toBe(true);
    expect(placed.previewImageUrl).toBe(buildPublishedSvgApiUrl(FIXTURE_REVISION));
    // AF-15 / DB-SVG-13: place pins revision identity for consumer bytes path
    expect(placed.sourceSvgRevisionId).toBe(FIXTURE_REVISION);

    const boq = buildPlannerFurnitureBoq(result.project, {
      now: "2026-07-18T12:00:00.000Z",
    });
    expect(boq.totalItems).toBe(1);
    const line = boq.lines[0];
    expect(line).toBeDefined();
    expect(line!.sku).toBe(TARGET_SKU);
    expect(line!.name).toMatch(/Linear Desk 1600/i);
    expect(formatBoqLineDisplayName(line!.name, line!.sku)).toBe(
      "Linear Desk 1600 · OANDO-LINEAR-DSK-1600",
    );
  });

  it("under disk authority: live disk catalog still loadable when present", async () => {
    vi.stubEnv("SVG_RELEASE_AUTHORITY", "disk");
    expect(isDbSvgReleaseAuthority()).toBe(false);
    clearLoaderCache();
    const descriptors = await loadBuyerVisibleDescriptorsWithDb();
    const desk = descriptors.find((d) => d.slug === TARGET_SLUG);
    // Disk inventory optional in CI; only assert shape if present.
    if (!desk) {
      expect(Array.isArray(descriptors)).toBe(true);
      return;
    }
    expect(desk.sku).toBe(TARGET_SKU);
    const guestItems = filterGuestInventoryCatalogItems(
      mapDescriptorsToCatalogItems(descriptors),
    );
    const item = guestItems.find((i) => i.slug === TARGET_SLUG);
    if (!item) return;
    // Disk mode may use /svg-catalog or revision if dual-written overlay.
    expect(item.sku).toBe(TARGET_SKU);
  });
});
