/**
 * Minimal valid fixed stub for `/admin/svg-editor/new`.
 * Shared by the RSC detail page (display) and publishSvgEditorAction (publish base).
 * Pure helper — not a server action. Checksum / id overwritten on persist.
 */

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

export function makeNewBlockDescriptorStub(): BlockDescriptor {
  // Catalog descriptors store Unix seconds (not Date.now() ms).
  const now = Math.floor(Date.now() / 1000);
  return {
    schemaVersion: "2026-07-04.v2",
    id: "00000000-0000-4000-8000-000000000000",
    slug: "new-block",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" },
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    generatedAt: now,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64),
  } as BlockDescriptor;
}
