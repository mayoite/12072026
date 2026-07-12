import { describe, expect, it } from "vitest";

import { makeNewBlockDescriptorStub } from "@/features/planner/admin/svg-editor/newBlockDescriptorStub";
import {
  descriptorToFormState,
  formStateToDescriptorInput,
  scenePartsToBlocks,
} from "@/features/planner/admin/svg-editor/svgEditorFormAdapters";
import { serializeSceneToDefinition } from "@/features/planner/admin/svg-editor/scene/svgSceneSerializer";
import type { SvgSceneDocument } from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import { sceneFromDescriptor } from "@/features/planner/admin/svg-editor/sceneFromDescriptor";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { parseAdminPayload } from "@/features/planner/admin/svg-editor/persistBlockDescriptor";

function drawnRectScene(slug: string): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    metadata: {
      typeId: slug,
      name: slug,
      category: "furniture",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "admin",
      physicalDimensionsMm: { width: 600, depth: 600, height: 480 },
      accessibilityTitle: `${slug} symbol`,
    },
    nodes: [
      {
        kind: "rect",
        id: "drawn-rect",
        name: "Drawn rectangle",
        locked: false,
        hidden: false,
        style: {
          fillToken: "var(--color-surface-raised)",
          strokeToken: "currentColor",
          lineWeight: 2,
        },
        x: 225,
        y: 225,
        width: 150,
        height: 150,
      },
    ],
  };
}

describe("A4.0.1 scene publish authority", () => {
  it("seeds sceneParts on open so compile does not require a canvas edit", () => {
    const descriptor = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(descriptor);
    expect(form.sceneParts?.length).toBeGreaterThan(0);
    expect(form.sceneViewBox).toEqual(descriptor.viewBox);
  });

  it("loads descriptor blocks into the scene instead of inventing a footprint", () => {
    const base = makeNewBlockDescriptorStub();
    const descriptor = {
      ...base,
      blocks: [{ id: "top", x: 10, y: 20, width: 200, depth: 100 }],
    };
    const scene = sceneFromDescriptor(descriptor);
    expect(scene.nodes).toHaveLength(1);
    expect(scene.nodes[0]?.id).toBe("top");
    expect(scene.nodes[0]?.kind).toBe("rect");
    if (scene.nodes[0]?.kind === "rect") {
      expect(scene.nodes[0].x).toBe(10);
      expect(scene.nodes[0].width).toBe(200);
      expect(scene.nodes[0].height).toBe(100);
    }
  });

  it("maps scene parts to blocks that survive BlockDescriptor parse", () => {
    const descriptor = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(descriptor);
    const scene = drawnRectScene(descriptor.slug);
    const definition = serializeSceneToDefinition(scene);
    const input = formStateToDescriptorInput(descriptor, {
      ...form,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
      // Stale form geometry must not win.
      blocks: [{ id: "stale", x: 0, y: 0, width: 999, depth: 999 }],
    }) as {
      viewBox: { x: number; y: number; width: number; height: number };
      parts: Array<{ id: string; kind: string }>;
      blocks: Array<{ id?: string; x: number; y: number; width: number; depth: number }>;
    };

    expect(input.viewBox).toEqual(definition.viewBox);
    expect(input.parts[0]?.id).toContain("drawn-rect");
    expect(input.blocks).toHaveLength(1);
    expect(input.blocks[0]?.x).toBe(225);
    expect(input.blocks[0]?.width).toBe(150);
    expect(input.blocks[0]?.depth).toBe(150);
    expect(input.blocks[0]?.id).not.toBe("stale");

    const parsed = parseAdminPayload(input);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.blocks).toBeDefined();
    expect(parsed.value.blocks?.[0]?.x).toBe(225);
    expect(parsed.value.blocks?.[0]?.width).toBe(150);
  });

  it("scene rects drive real publish compile after parse (blocks path)", async () => {
    const descriptor = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(descriptor);
    const scene = drawnRectScene(descriptor.slug);
    const definition = serializeSceneToDefinition(scene);
    const input = formStateToDescriptorInput(descriptor, {
      ...form,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    });

    const parsed = parseAdminPayload(input);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const result = await compileSvgForPublish(parsed.value);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.svg).toContain("225");
    expect(result.svg).toContain("375");
  });

  it("scenePartsToBlocks maps circles to bounding rects", () => {
    const blocks = scenePartsToBlocks([
      {
        kind: "circle",
        id: "c1",
        visible: true,
        cx: 100,
        cy: 100,
        r: 25,
        style: { fill: "currentColor", stroke: "none", strokeWidth: 0 },
      },
    ] as never);
    expect(blocks).toEqual([
      { id: "c1", x: 75, y: 75, width: 50, depth: 50 },
    ]);
  });
});
