import { describe, expect, it } from "vitest";

import { makeNewBlockDescriptorStub } from "@/features/planner/admin/svg-editor/newBlockDescriptorStub";
import {
  descriptorToFormState,
  formStateToDescriptorInput,
} from "@/features/planner/admin/svg-editor/svgEditorFormAdapters";
import { serializeSceneToDefinition } from "@/features/planner/admin/svg-editor/scene/svgSceneSerializer";
import type { SvgSceneDocument } from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";

describe("A4.0.1 scene publish authority", () => {
  it("scene parts override stale form geometry during publish", () => {
    const descriptor = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(descriptor);

    const scene: SvgSceneDocument = {
      modelVersion: 1,
      viewBox: { x: 0, y: 0, width: 600, height: 600 },
      metadata: {
        typeId: descriptor.slug,
        name: descriptor.slug,
        category: "furniture",
        tags: [],
        lifecycleStatus: "draft",
        ownerId: "admin",
        physicalDimensionsMm: { width: 600, depth: 600, height: 480 },
        accessibilityTitle: `${descriptor.slug} symbol`,
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
          x: 40,
          y: 60,
          width: 120,
          height: 80,
        },
      ],
    };

    const definition = serializeSceneToDefinition(scene);
    const input = formStateToDescriptorInput(descriptor, {
      ...form,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    }) as {
      viewBox: { x: number; y: number; width: number; height: number };
      parts: Array<{ id: string; kind: string }>;
    };

    expect(input.viewBox).toEqual(definition.viewBox);
    expect(input.parts).toEqual(definition.parts);
    expect(input.parts[0]?.id).toContain("drawn-rect");
  });

  it("scene rects drive the real publish compiler ahead of stale blocks", async () => {
    const descriptor = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(descriptor);

    const scene: SvgSceneDocument = {
      modelVersion: 1,
      viewBox: { x: 0, y: 0, width: 600, height: 600 },
      metadata: {
        typeId: descriptor.slug,
        name: descriptor.slug,
        category: "furniture",
        tags: [],
        lifecycleStatus: "draft",
        ownerId: "admin",
        physicalDimensionsMm: { width: 600, depth: 600, height: 480 },
        accessibilityTitle: `${descriptor.slug} symbol`,
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

    const definition = serializeSceneToDefinition(scene);
    const input = formStateToDescriptorInput(descriptor, {
      ...form,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    });

    const result = await compileSvgForPublish(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.svg).toContain("225");
    expect(result.svg).toContain("375");
  });
});
