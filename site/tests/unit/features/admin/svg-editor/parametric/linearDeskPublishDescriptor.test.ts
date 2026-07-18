/**
 * Pure identity builder — no disk, no server action.
 */

import { describe, expect, it } from "vitest";

import { buildLinearDeskPublishDescriptor } from "@/features/admin/svg-editor/parametric/linearDeskPublishDescriptor";

describe("buildLinearDeskPublishDescriptor", () => {
  it("mints id on first publish and omits generatedAt", () => {
    const a = buildLinearDeskPublishDescriptor({
      widthMm: 1600,
      depthMm: 800,
      heightMm: 750,
    });
    const b = buildLinearDeskPublishDescriptor({
      widthMm: 1600,
      depthMm: 800,
      heightMm: 750,
    });
    expect(a.slug).toBe("oando-linear-desk-1600");
    expect(a.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    // Without existing identity, each call may mint a new id (first-publish path).
    expect(a.id).not.toBe(b.id);
    expect(a.generatedAt).toBeUndefined();
  });

  it("reuses product id + generatedAt for same slug (republish)", () => {
    const stableId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    const generatedAt = 1_700_000_000;
    const first = buildLinearDeskPublishDescriptor(
      { widthMm: 1600, depthMm: 800, heightMm: 750 },
      { id: stableId, generatedAt },
    );
    const second = buildLinearDeskPublishDescriptor(
      {
        widthMm: 1600,
        depthMm: 780,
        heightMm: 750,
        slug: "oando-linear-desk-1600",
      },
      { id: stableId, generatedAt },
    );
    expect(first.id).toBe(stableId);
    expect(second.id).toBe(stableId);
    expect(first.generatedAt).toBe(generatedAt);
    expect(second.generatedAt).toBe(generatedAt);
  });
});
