import { describe, expect, it } from "vitest";
import { sceneFromDescriptor } from "@/features/admin/svg-editor/sceneFromDescriptor";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

function fixed(partial: Partial<BlockDescriptor> = {}): BlockDescriptor {
  return {
    schemaVersion: "2026-07-04.v2",
    id: "11111111-1114-4111-8111-111111111111",
    slug: "desk-basic",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" },
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    generatedAt: 1,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
    ...partial,
  } as BlockDescriptor;
}

describe("sceneFromDescriptor", () => {
  it("seeds footprint when blocks are empty", () => {
    const scene = sceneFromDescriptor(fixed());
    expect(scene.nodes.length).toBeGreaterThan(0);
    expect(scene.nodes[0]?.kind).toBe("rect");
    expect(scene.metadata.typeId || scene.nodes[0]?.id).toBeTruthy();
  });

  it("maps blocks to rect nodes", () => {
    const scene = sceneFromDescriptor(
      fixed({
        blocks: [{ id: "top", x: 0, y: 0, width: 100, depth: 50 }],
      } as Partial<BlockDescriptor>),
    );
    expect(scene.nodes.some((n) => n.id === "top")).toBe(true);
  });
});
