import { describe, expect, it } from "vitest";
import {
  descriptorToFormState,
  formStateToDescriptorInput,
  scenePartsToBlocks,
} from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { SvgBlockDefinitionV1 } from "@/features/admin/svg-editor/contracts/svgBlockSchemas";

describe("svgEditorFormAdapters", () => {
  it("descriptorToFormState prefills slug, geometry, and scene seed", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    expect(form.slug).toBe(stub.slug);
    expect(form.geometry.widthMm).toBe(stub.geometry.widthMm);
    expect(form.themeTokens.length).toBeGreaterThan(0);
    expect(form.sceneParts?.length).toBeGreaterThan(0);
    expect(form.sceneViewBox).toBeDefined();
    expect(form.variant).toBe("fixed");
  });

  it("descriptorToFormState maps configurable and parametric variants", () => {
    const configurable = {
      ...makeNewBlockDescriptorStub(),
      variant: "configurable",
      configurable: { sizingType: "discrete", sizeOptions: ["600", "800"] },
    } as BlockDescriptor;
    delete (configurable as { fixed?: unknown }).fixed;
    const confForm = descriptorToFormState(configurable);
    expect(confForm.variant).toBe("configurable");
    expect(confForm.configurableSizingType).toBe("discrete");
    expect(confForm.configurableSizeOptions).toEqual(["600", "800"]);

    const parametric = {
      ...makeNewBlockDescriptorStub(),
      variant: "parametric",
      parametric: {
        sizingType: "parametric",
        parameterSchema: [{ key: "width", label: "Width", kind: "number" }],
      },
      mountingPoints: [{ plane: "floor", offset: { x: 0, y: 0 } }],
    } as BlockDescriptor;
    delete (parametric as { fixed?: unknown }).fixed;
    const paraForm = descriptorToFormState(parametric);
    expect(paraForm.parameterSchema).toEqual([
      { key: "width", label: "Width", kind: "number" },
    ]);
    expect(paraForm.mountingPoints).toHaveLength(1);
  });

  it("scenePartsToBlocks maps rects and circles, skips invisible and non-block kinds", () => {
    const parts: SvgBlockDefinitionV1["parts"] = [
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
      {
        kind: "rect",
        id: "hidden",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        visible: false,
        customerEditable: false,
      },
      {
        kind: "rect",
        id: "zero",
        x: 0,
        y: 0,
        width: 0,
        height: 10,
        visible: true,
        customerEditable: false,
      },
      {
        kind: "circle",
        id: "knob",
        cx: 10,
        cy: 10,
        r: 5,
        visible: true,
        customerEditable: false,
      },
      {
        kind: "circle",
        id: "hidden-circle",
        cx: 0,
        cy: 0,
        r: 3,
        visible: false,
        customerEditable: false,
      },
      {
        kind: "line",
        id: "edge",
        x1: 0,
        y1: 0,
        x2: 10,
        y2: 0,
        visible: true,
        customerEditable: false,
      },
      {
        kind: "text",
        id: "label",
        x: 1,
        y: 2,
        text: "W",
        visible: true,
        customerEditable: false,
      },
    ];
    expect(scenePartsToBlocks(parts)).toEqual([
      { id: "top", x: 0, y: 0, width: 100, depth: 50 },
      { id: "knob", x: 5, y: 5, width: 10, depth: 10 },
    ]);
  });

  it("formStateToDescriptorInput keeps identity and applies form edits", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.sku = "NEW-SKU";
    form.createdBy = "editor";
    const input = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    expect(input.slug).toBe(stub.slug);
    expect(input.sku).toBe("NEW-SKU");
    expect(input.id).toBe(stub.id);
    expect(input.createdBy).toBe("editor");
    expect(input.checksum).toBeUndefined();
    expect(input.variant).toBe("fixed");
    expect(input.fixed).toEqual({ sizingType: "fixed" });
  });

  it("formStateToDescriptorInput rebuilds configurable and parametric sub-objects", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.variant = "configurable";
    form.configurableSizingType = "discrete";
    form.configurableSizeOptions = [" 600 ", "", "800"];
    form.sceneParts = [];
    form.blocks = [];
    const conf = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    expect(conf.variant).toBe("configurable");
    expect(conf.configurable).toEqual({
      sizingType: "discrete",
      sizeOptions: ["600", "800"],
    });
    expect(conf.fixed).toBeUndefined();

    form.variant = "parametric";
    form.parameterSchema = [{ key: "w", label: "Width", kind: "number" }];
    form.mountingPoints = [{ plane: "wall", offset: { x: 1, y: 2 } }];
    const para = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    expect(para.variant).toBe("parametric");
    expect(para.parametric).toEqual({
      sizingType: "parametric",
      parameterSchema: [{ key: "w", label: "Width", kind: "number" }],
    });
    expect(para.mountingPoints).toEqual([{ plane: "wall", offset: { x: 1, y: 2 } }]);
  });

  it("formStateToDescriptorInput prefers scene parts over form blocks", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.blocks = [{ id: "stale", x: 0, y: 0, width: 1, depth: 1 }];
    form.sceneParts = [
      {
        kind: "rect",
        id: "studio",
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        visible: true,
        customerEditable: false,
      },
    ];
    form.sceneViewBox = { x: 0, y: 0, width: 300, height: 200 };
    const input = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    expect(input.viewBox).toEqual({ x: 0, y: 0, width: 300, height: 200 });
    expect(input.blocks).toEqual([
      { id: "studio", x: 10, y: 20, width: 300, depth: 200 },
    ]);
    expect(input.parts).toHaveLength(1);
  });

  it("formStateToDescriptorInput uses form blocks when scene is empty", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.sceneParts = [];
    form.blocks = [{ id: "legacy", x: 1, y: 2, width: 3, depth: 4 }];
    const input = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    expect(input.blocks).toEqual([{ id: "legacy", x: 1, y: 2, width: 3, depth: 4 }]);
  });

  it("formStateToDescriptorInput attaches fixed assets when urls present", () => {
    const stub = makeNewBlockDescriptorStub();
    const form = descriptorToFormState(stub);
    form.assetsGlbUrl = " /models/a.glb ";
    form.assetsSvgUrl = " /svg/a.svg ";
    const input = formStateToDescriptorInput(stub, form) as Record<string, unknown>;
    expect(input.assets).toEqual({ glbUrl: "/models/a.glb", svgUrl: "/svg/a.svg" });
  });
});
