/**
 * Phase 04 — puckBlockRegistry unit tests.
 *
 * §04-TEST-05: each block exposes a Zod schema, a component, and a fields
 * object — reflection check enforces completeness.
 *
 * Notes:
 *   - "render" is exercised as a function callable on the block's
 *     `defaultProps`; the test asserts it returns React-ish output (a
 *     non-null node) but does not deep-mount JSX (no `@testing-library`).
 *   - "fields" is asserted to be a non-empty object whose keys are a
 *     subset of the BlockDescriptor cartography for that variant.
 *   - The compile-time exhaustiveness check on `PUCK_BLOCK_REGISTRY.length`
 *     ensures any future variant tag added to Phase 02 forces a registry
 *     update before tests pass.
 */

import { describe, expect, it } from "vitest";

import {
  BLOCK_DESCRIPTOR_VARIANTS,
  type BlockDescriptorVariant,
} from "@/features/planner/project/catalog/svg/svgTypes";

import {
  PUCK_BLOCK_REGISTRY,
  PUCK_BLOCK_BY_VARIANT,
  puckConfig,
  blockDescriptorToRenderProps,
  puckComponentName,
  SUPPORTED_PUCK_BLOCK_VARIANTS,
  getPuckData,
} from "@/features/admin/svg-editor/puckBlockRegistry";

describe("04-PUCK-REGISTRY: registry completeness", () => {
  it("PUCK_BLOCK_REGISTRY exposes one entry per BLOCK_DESCRIPTOR_VARIANTS tag", () => {
    expect(PUCK_BLOCK_REGISTRY).toHaveLength(BLOCK_DESCRIPTOR_VARIANTS.length);
  });

  it("PUCK_BLOCK_REGISTRY covers exactly { fixed, configurable, parametric }", () => {
    const tags = PUCK_BLOCK_REGISTRY.map((block) => block.variant).sort();
    expect(tags).toEqual(["configurable", "fixed", "parametric"]);
  });

  it("PUCK_BLOCK_BY_VARIANT lookup returns the same record for every variant tag", () => {
    for (const variant of BLOCK_DESCRIPTOR_VARIANTS) {
      const fromArray = PUCK_BLOCK_REGISTRY.find(
        (block) => block.variant === variant,
      );
      const fromIndex = PUCK_BLOCK_BY_VARIANT[variant];
      expect(fromIndex).toBe(fromArray);
    }
  });

  it("SUPPORTED_PUCK_BLOCK_VARIANTS mirrors BLOCK_DESCRIPTOR_VARIANTS tuple", () => {
    expect(Array.from(SUPPORTED_PUCK_BLOCK_VARIANTS)).toEqual(
      Array.from(BLOCK_DESCRIPTOR_VARIANTS),
    );
  });

  it("puckConfig.components exposes the canonical block names", () => {
    expect(Object.keys(puckConfig.components).sort()).toEqual([
      "BlockConfigurable",
      "BlockFixed",
      "BlockParametric",
    ]);
  });

  it("puckConfig.categorises the three variant blocks under 'Catalog Blocks'", () => {
    const category = puckConfig.categories["Catalog Blocks"];
    expect(category).toBeDefined();
    expect(Array.from(category.components)).toEqual([
      "BlockFixed",
      "BlockConfigurable",
      "BlockParametric",
    ]);
  });
});

describe("04-PUCK-REGISTRY: per-block schema/fields/render defaults", () => {
  for (const variant of BLOCK_DESCRIPTOR_VARIANTS) {
    it(`${variant} block exposes schema + fields + defaultProps + render`, () => {
      const block = PUCK_BLOCK_BY_VARIANT[variant];
      expect(block.variant).toBe(variant);
      expect(typeof block.schema.safeParse).toBe("function");
      expect(typeof block.render).toBe("function");
      const fieldsKeys = Object.keys(block.fields);
      expect(fieldsKeys.length).toBeGreaterThan(0);
      const defaultPropsRecord = block.defaultProps;
      expect(typeof defaultPropsRecord).toBe("object");
      expect(defaultPropsRecord).not.toBeNull();
    });

    it(`${variant} block fields include the identity layer (slug/sku/sourceProvenance)`, () => {
      const block = PUCK_BLOCK_BY_VARIANT[variant];
      const fieldsKeys = Object.keys(block.fields);
      expect(fieldsKeys).toContain("slug");
      expect(fieldsKeys).toContain("sku");
      expect(fieldsKeys).toContain("sourceProvenance");
      expect(fieldsKeys).toContain("themeTokens");
      expect(fieldsKeys.some((k) => k.startsWith("geometry."))).toBe(true);
      expect(fieldsKeys.some((k) => k.startsWith("viewBox."))).toBe(true);
    });

    it(`${variant} block render is callable and returns a non-null node for its defaultProps`, () => {
      const block = PUCK_BLOCK_BY_VARIANT[variant];
      const node = block.render(block.defaultProps);
      expect(node).not.toBeNull();
      expect(node).not.toBeUndefined();
    });

    it(`${variant} component name matches puckComponentName(variant)`, () => {
      const block = PUCK_BLOCK_BY_VARIANT[variant];
      expect(puckComponentName(variant)).toBe(block.name);
    });
  }
});

describe("04-PUCK-REGISTRY: Puck config surfaces shape compatible with @puckeditor/core", () => {
  it("every component has fields, defaultProps, and render", () => {
    for (const [name, component] of Object.entries(puckConfig.components)) {
      expect(name).toMatch(/^Block(Fixed|Configurable|Parametric)$/);
      expect(typeof component.render).toBe("function");
      expect(Object.keys(component.fields).length).toBeGreaterThan(0);
      expect(component.defaultProps).toBeDefined();
    }
  });

  it("puckConfig exports a structurally frozen object (consumer cannot mutate)", () => {
    expect(Object.isFrozen(puckConfig)).toBe(true);
    expect(Object.isFrozen(puckConfig.components)).toBe(true);
  });

  it("blockDescriptorToRenderProps maps every variant into named render props", () => {
    const fixedRender = blockDescriptorToRenderProps({
      schemaVersion: "2026-07-04.v2",
      id: "11111111-1114-4111-8111-111111111111",
      slug: "chaise",
      sku: "OFL-CHS-001",
      sourceProvenance: "native",
      geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 1800, height: 600 },
      mounting: ["floor"],
      themeTokens: { currentColor: "currentColor" } as never,
      rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
      liveAnnouncementCategories: ["status"],
      variant: "fixed",
      fixed: { sizingType: "fixed" },
      checksum: "0".repeat(64),
      generatedAt: 1700000000,
    });
    expect(fixedRender.variant).toBe("fixed");
    expect(fixedRender.name).toBe("BlockFixed");

    const parametricRender = blockDescriptorToRenderProps({
      schemaVersion: "2026-07-04.v2",
      id: "11111111-1114-4111-8111-111111111112",
      slug: "side-table",
      sku: "OFL-ST-001",
      sourceProvenance: "native",
      geometry: { widthMm: 600, depthMm: 600, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 600, height: 600 },
      mounting: ["floor"],
      themeTokens: { currentColor: "currentColor" } as never,
      rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
      liveAnnouncementCategories: ["status"],
      variant: "parametric",
      parametric: {
        sizingType: "parametric",
        parameterSchema: [
          { key: "height", label: "Height", kind: "number", bounds: [400, 800] },
        ],
      },
      mountingPoints: [{ plane: "floor", offset: { x: 0, y: 0 } }],
      checksum: "0".repeat(64),
      generatedAt: 1700000000,
    });
    expect(parametricRender.variant).toBe("parametric");
    expect(parametricRender.name).toBe("BlockParametric");
  });

  it("blockDescriptorToRenderProps fills fixed sku and configurable option defaults", () => {
    const fixedRender = blockDescriptorToRenderProps({
      schemaVersion: "2026-07-04.v2",
      id: "11111111-1114-4111-8111-111111111113",
      slug: "bench",
      sourceProvenance: "native",
      geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 1800, height: 600 },
      mounting: ["floor"],
      themeTokens: { currentColor: "currentColor" } as never,
      rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
      liveAnnouncementCategories: ["status"],
      variant: "fixed",
      fixed: { sizingType: "fixed" },
      checksum: "0".repeat(64),
      generatedAt: 1700000000,
    });
    expect(fixedRender.props).toEqual({
      slug: "bench",
      sku: "",
    });

    const configurableRender = blockDescriptorToRenderProps({
      schemaVersion: "2026-07-04.v2",
      id: "11111111-1114-4111-8111-111111111114",
      slug: "modular-bench",
      sku: "OFL-MOD-001",
      sourceProvenance: "native",
      geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 1800, height: 600 },
      mounting: ["floor"],
      themeTokens: { currentColor: "currentColor" } as never,
      rovingFocus: [{ key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" }],
      liveAnnouncementCategories: ["status"],
      variant: "configurable",
      configurable: {
        sizingType: "parametric",
      },
      checksum: "0".repeat(64),
      generatedAt: 1700000000,
    });
    expect(configurableRender.props).toEqual({
      slug: "modular-bench",
      sizingType: "parametric",
      optionCount: 0,
    });
  });

  it("puckComponentName is a total function on the variant-tag union", () => {
    const variants: BlockDescriptorVariant[] = [
      "fixed",
      "configurable",
      "parametric",
    ];
    const distinctNames = new Set(variants.map((v) => puckComponentName(v)));
    expect(distinctNames.size).toBe(3);
  });
});

describe("04-TEST-05: getPuckData adapter for Puck/Render (registry + portal)", () => {
  it("getPuckData returns root + content shaped for puckConfig using blockDescriptorToRenderProps", () => {
    const desc: any = {
      slug: "test-get",
      variant: "fixed",
      schemaVersion: "2026-07-04.v2",
      id: "11111111-1111-4111-8111-111111111111",
      sourceProvenance: "native",
      geometry: { widthMm: 100, depthMm: 100, heightMm: 100 },
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      mounting: ["floor"],
      themeTokens: { currentColor: "currentColor" },
      rovingFocus: [],
      liveAnnouncementCategories: ["status"],
      fixed: { sizingType: "fixed" },
      checksum: "0".repeat(64),
      generatedAt: 1,
    };
    const data = getPuckData(desc);
    expect(data.root.props.title).toBe("test-get");
    expect(data.content).toHaveLength(1);
    expect(data.content[0].type).toBe("BlockFixed");
    expect(data.content[0].props.slug).toBe("test-get");
  });
});

