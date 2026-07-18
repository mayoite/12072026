import { describe, it, expect } from "vitest";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { filterGuestInventoryCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { clearLoaderCache } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

describe("guest filter for parametric proof slugs", () => {
  it("includes oando-param-proof after disk publish", async () => {
    clearLoaderCache();
    const descriptors = await loadBuyerVisibleDescriptorsWithDb();
    const proofs = descriptors.filter(
      (d) => typeof d.slug === "string" && d.slug.startsWith("oando-param-proof"),
    );
    const mapped = mapDescriptorsToCatalogItems(descriptors);
    const mappedProofs = mapped.filter((i) =>
      i.slug.startsWith("oando-param-proof"),
    );
    const items = filterGuestInventoryCatalogItems(mapped);
    const guestProofs = items.filter((i) =>
      i.slug.startsWith("oando-param-proof"),
    );
    const sample = proofs[0];
    const status = sample ? readSvgArtifactStatus(sample.slug) : null;
    const mappedSample = mappedProofs[0];
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          descriptorTotal: descriptors.length,
          proofDescriptors: proofs.map((d) => d.slug),
          mappedTotal: mapped.length,
          mappedProofs: mappedProofs.map((i) => ({
            slug: i.slug,
            id: i.id,
            sku: i.sku,
            name: i.name,
          })),
          guestTotal: items.length,
          guestProofs: guestProofs.map((i) => i.slug),
          sampleStatus: status?.state,
          sampleMapped: mappedSample,
        },
        null,
        2,
      ),
    );
    expect(proofs.length).toBeGreaterThan(0);
    expect(guestProofs.length).toBeGreaterThan(0);
  });
});
