/**
 * C4 load rule — published parametric desk is guest-placeable with BOQ name/SKU.
 * Uses existing disk catalog when present; does not mutate canonical descriptors.
 */

import { describe, expect, it } from "vitest";

import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { filterGuestInventoryCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { formatBoqLineDisplayName } from "@/features/planner/catalog/catalogLabelUtils";
import { placeCatalogItemInProject } from "@/features/planner/catalog/placementAction";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { clearLoaderCache } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { createPlannerProject } from "@/features/planner/model/project";
import {
  buildPlannerFurnitureBoq,
} from "@/features/planner/shared/export/projectFurnitureBoq";

const TARGET_SLUG = "oando-linear-desk-1600";
const TARGET_SKU = "OANDO-LINEAR-DSK-1600";

describe("C4 guest place load rule (parametric desk)", () => {
  it("includes live oando-linear-desk-1600 with /svg-catalog previewUrl", async () => {
    clearLoaderCache();
    const descriptors = await loadBuyerVisibleDescriptorsWithDb();
    const desk = descriptors.find((d) => d.slug === TARGET_SLUG);
    expect(desk, "descriptor must exist on disk for C4 consume").toBeDefined();
    expect(desk!.sku).toBe(TARGET_SKU);
    expect(readSvgArtifactStatus(TARGET_SLUG).state).toBe("published");

    const guestItems = filterGuestInventoryCatalogItems(
      mapDescriptorsToCatalogItems(descriptors),
    );
    const item = guestItems.find((i) => i.slug === TARGET_SLUG);
    expect(item, "guest filter must keep brand parametric desk").toBeDefined();
    expect(item!.sku).toBe(TARGET_SKU);
    expect(item!.assets.previewImageUrl).toBe(
      `/svg-catalog/${TARGET_SLUG}.svg`,
    );
    // No sample/demo pollution in guest list
    expect(guestItems.every((i) => i.slug.startsWith("oando-"))).toBe(true);
    expect(guestItems.some((i) => /^sample[-_]/i.test(i.slug))).toBe(false);
  });

  it("place stamps identity; BOQ shows name · SKU", async () => {
    clearLoaderCache();
    const descriptors = await loadBuyerVisibleDescriptorsWithDb();
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
    expect(placed.previewImageUrl).toBe(`/svg-catalog/${TARGET_SLUG}.svg`);

    const boq = buildPlannerFurnitureBoq(result.project, {
      now: "2026-07-18T12:00:00.000Z",
    });
    expect(boq.totalItems).toBe(1);
    const line = boq.lines[0];
    expect(line).toBeDefined();
    expect(line!.sku).toBe(TARGET_SKU);
    // Humanized product name from slug (BlockDescriptor has no name field).
    expect(line!.name).toMatch(/Linear Desk 1600/i);
    expect(formatBoqLineDisplayName(line!.name, line!.sku)).toBe(
      "Linear Desk 1600 · OANDO-LINEAR-DSK-1600",
    );
  });
});
