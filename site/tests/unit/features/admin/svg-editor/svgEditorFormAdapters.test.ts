import { describe, expect, it } from "vitest";
import {
  descriptorToFormState,
  formStateToDescriptorInput,
  scenePartsToBlocks,
} from "@/features/admin/svg-editor/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/newBlockDescriptorStub";

describe("svgEditorFormAdapters", () => {
  it("descriptorToFormState prefills slug and geometry", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    expect(form.slug).toBe(stub.slug);
    expect(form.geometry.widthMm).toBe(stub.geometry.widthMm);
    expect(form.themeTokens.length).toBeGreaterThan(0);
  });

  it("scenePartsToBlocks maps rects", () => {
    const blocks = scenePartsToBlocks([
      {
        kind: "rect",
        id: "top",
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        visible: true,
        customerEditable: false,
      },
    ]);
    expect(blocks).toEqual([{ id: "top", x: 0, y: 0, width: 100, depth: 50 }]);
  });

  it("formStateToDescriptorInput keeps slug", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.sku = "NEW-SKU";
    const input = formStateToDescriptorInput(stub, form);
    expect(input.slug).toBe(stub.slug);
    expect(input.sku).toBe("NEW-SKU");
  });
});
