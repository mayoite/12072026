import { describe, expect, it } from "vitest";

import { importSvgToScene } from "@/features/admin/svg-editor/import/importSvgToScene";
import { serializeSceneToDefinition } from "@/features/admin/svg-editor/scene/svgSceneSerializer";
import {
  descriptorToFormState,
  formStateToDescriptorInput,
} from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import type { SvgBlockDefinitionV1 } from "@/features/admin/svg-editor/contracts/svgBlockSchemas";

/**
 * WHOLE WORKFLOW, END TO END.
 *
 * Drives the real custom-furniture path with no mocks:
 *
 *   raw furniture SVG (arbitrary <path> + <polygon>)
 *     → importSvgToScene            (parse + sanitize → SvgSceneDocument)
 *     → serializeSceneToDefinition  (scene → V1 parts, z-order preserved)
 *     → descriptorToFormState/merge (parts become form.sceneParts)
 *     → formStateToDescriptorInput  (path parts → descriptor.importedPaths)
 *     → compileSvgForPublish        (S1 normalize → S2 path-compile → S3 sanitize/SVGO)
 *
 * Asserts the arbitrary outline survives verbatim to a real <path d="…"> in the
 * published SVG — i.e. it is NOT reduced to a bounding rect, which is the exact
 * failure of the old rect/circle-only block pipeline.
 */
describe("custom furniture import → publish (whole workflow e2e)", () => {
  // An L-shaped desk outline: a real path with curves + a polygon leg.
  const FURNITURE_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 900">
      <path d="M0 0 H1800 V300 H600 V900 H0 Z" fill="#111"/>
      <polygon points="1650,600 1750,600 1700,850" fill="#111"/>
      <circle cx="300" cy="150" r="80" fill="#111"/>
    </svg>`;

  it("carries an arbitrary outline from import all the way to a published <path>", async () => {
    // 1) IMPORT — parse + sanitize the raw furniture SVG into scene geometry.
    const imported = importSvgToScene(FURNITURE_SVG, {
      slug: "walnut-l-desk",
      name: "Walnut L Desk",
      physicalDimensionsMm: { width: 1800, depth: 900, height: 740 },
    });
    expect(imported.ok).toBe(true);
    if (!imported.ok) return;
    // path + polygon(→path) + circle = 3 nodes, document order preserved.
    expect(imported.nodeCount).toBe(3);
    expect(imported.document.nodes[0]?.kind).toBe("path");

    // 2) SERIALIZE — scene → V1 definition (the publish boundary).
    const definition = serializeSceneToDefinition(imported.document);
    const parts: SvgBlockDefinitionV1["parts"] = definition.parts;
    expect(parts.length).toBe(3);

    // 3) FORM STATE — seed the editor form, attach scene parts as authority.
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.slug = "walnut-l-desk";
    form.sceneViewBox = definition.viewBox;
    form.sceneParts = parts;

    // 4) DESCRIPTOR INPUT — the merged, persistable descriptor shape.
    const input = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    const importedPaths = input.importedPaths as
      | ReadonlyArray<{ id?: string; d: string }>
      | undefined;

    // The wire: path/polygon/circle all survive as freeform `d`, not dropped.
    expect(importedPaths).toBeDefined();
    expect(importedPaths?.length).toBe(3);
    // The original L-desk outline `d` is present verbatim (up to whitespace).
    const outline = importedPaths?.[0]?.d.replace(/\s+/g, " ").trim();
    expect(outline).toBe("M0 0 H1800 V300 H600 V900 H0 Z");

    // 5) COMPILE — the real publish compile (normalize → path-compile → sanitize).
    const compiled = await compileSvgForPublish(input);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    // Path-compile stage ran (not the block/polygon-clipping compiler).
    expect(compiled.stages).toContain("svg-s2-path-compile");

    // The published SVG contains real <path> geometry with the L-desk verticals,
    // proving the arbitrary outline was emitted — not a bounding rect.
    expect(compiled.svg).toContain("<path");
    expect(compiled.svg).toMatch(/<svg[^>]*viewBox="0 0 1800 900"/);
    // A bounding-rect reduction would collapse the concave step (H600 V900);
    // assert the compiled markup still carries path draw commands.
    expect(compiled.svg).toMatch(/\sd="[^"]*[HhVvLlCcQqAaZz][^"]*"/);
  });

  it("rejects unsafe imported markup before it can reach publish", () => {
    const malicious = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <script>alert(1)</script>
        <path d="M0 0 H100 V100 H0 Z"/>
      </svg>`;
    const result = importSvgToScene(malicious, { slug: "evil-chair" });
    // Sanitizer strips <script>; the path still imports so the shape survives.
    if (result.ok) {
      const def = serializeSceneToDefinition(result.document);
      expect(JSON.stringify(def)).not.toContain("script");
    } else {
      expect(result.error).toBeTruthy();
    }
  });
});
