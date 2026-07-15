import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  descriptorToFormState,
  formStateToDescriptorInput,
} from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { addNode } from "@/features/admin/svg-editor/scene/svgSceneDocument";
import { serializeSceneToDefinition } from "@/features/admin/svg-editor/scene/svgSceneSerializer";
import { sceneFromDescriptor } from "@/features/admin/svg-editor/scene/sceneFromDescriptor";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { parseAdminPayload } from "@/features/admin/svg-editor/storage/persistBlockDescriptor";

const RECT_SIGNATURE = "225 225 L 225 375 L 375 375 L 375 225";

describe("publish from studio scene authority", () => {
  it("side-table + drawn rect compiles with rect signature", async () => {
    const descriptor = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "inventory/descriptors/side-table-001.json"),
        "utf8",
      ),
    );
    const form = descriptorToFormState(descriptor);
    const scene = sceneFromDescriptor(descriptor);
    const withRect = addNode(scene, {
      kind: "rect",
      id: "rect-6",
      name: "Rectangle",
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
    });
    const definition = serializeSceneToDefinition(withRect);
    expect(definition.parts.length).toBeGreaterThan(5);

    const input = formStateToDescriptorInput(descriptor, {
      ...form,
      sceneViewBox: definition.viewBox,
      sceneParts: definition.parts,
    });
    const parsed = parseAdminPayload(input);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error("expected parsed.ok");
    expect(parsed.value.blocks?.length).toBeGreaterThan(5);

    const compiled = await compileSvgForPublish(parsed.value);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) throw new Error("expected compiled.ok");
    expect(compiled.svg).toContain(RECT_SIGNATURE);
  });
});