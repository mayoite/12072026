/**
 * Name-mirror: lib/catalog/puckBlockRegistry.tsx
 * Canonical Puck registry for portal render + legacy adapters.
 */
import { describe, expect, it } from "vitest";

import {
  BLOCK_DESCRIPTOR_VARIANTS,
  type BlockDescriptor,
} from "@/features/planner/catalog/svg/svgTypes";
import {
  blockDescriptorToRenderProps,
  getPuckData,
  getPuckEditorData,
  MOUNT_PLANE_VALUES,
  PUCK_BLOCK_BY_VARIANT,
  PUCK_BLOCK_REGISTRY,
  puckComponentName,
  puckConfig,
  SUPPORTED_PUCK_BLOCK_VARIANTS,
} from "@/lib/catalog/puckBlockRegistry";

const fixedDescriptor = {
  schemaVersion: "2026-07-04.v2",
  id: "11111111-1111-4111-8111-111111111111",
  slug: "test-fixed-block",
  sourceProvenance: "native",
  geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
  viewBox: { x: 0, y: 0, width: 120, height: 60 },
  mounting: ["floor"],
  themeTokens: { currentColor: "currentColor" },
  rovingFocus: [],
  liveAnnouncementCategories: ["status"],
  variant: "fixed",
  fixed: { sizingType: "fixed" },
  checksum: "a".repeat(64),
  generatedAt: 1700000000,
} satisfies BlockDescriptor;

const configurableDescriptor = {
  ...fixedDescriptor,
  id: "22222222-2222-4222-8222-222222222222",
  slug: "test-configurable-block",
  variant: "configurable",
  configurable: {
    sizingType: "discrete",
    sizeOptions: [
      { sku: "S", label: "Small", dim: { L: 1200, D: 600, H: 750 } },
      { sku: "L", label: "Large", dim: { L: 1500, D: 600, H: 750 } },
    ],
  },
} as BlockDescriptor;

const parametricDescriptor = {
  ...fixedDescriptor,
  id: "33333333-3333-4333-8333-333333333333",
  slug: "test-parametric-block",
  variant: "parametric",
  parametric: {
    parameterSchema: [
      { key: "widthMm", label: "Width", unit: "mm", min: 1000, max: 2000, step: 50 },
    ],
  },
  mountingPoints: [{ id: "mp-1", xMm: 0, yMm: 0, plane: "floor" }],
} as BlockDescriptor;

describe("lib/catalog/puckBlockRegistry", () => {
  it("freezes a registry closed under BLOCK_DESCRIPTOR_VARIANTS", () => {
    expect(Object.isFrozen(PUCK_BLOCK_REGISTRY)).toBe(true);
    expect(PUCK_BLOCK_REGISTRY.length).toBe(BLOCK_DESCRIPTOR_VARIANTS.length);
    expect(SUPPORTED_PUCK_BLOCK_VARIANTS).toEqual(BLOCK_DESCRIPTOR_VARIANTS);
    for (const variant of BLOCK_DESCRIPTOR_VARIANTS) {
      expect(PUCK_BLOCK_BY_VARIANT[variant].variant).toBe(variant);
    }
  });

  it("maps variants to Puck component names", () => {
    expect(puckComponentName("fixed")).toBe("BlockFixed");
    expect(puckComponentName("configurable")).toBe("BlockConfigurable");
    expect(puckComponentName("parametric")).toBe("BlockParametric");
  });

  it("builds typed render props from each descriptor variant", () => {
    expect(blockDescriptorToRenderProps(fixedDescriptor)).toEqual({
      variant: "fixed",
      name: "BlockFixed",
      props: { slug: "test-fixed-block", sku: "" },
    });
    expect(blockDescriptorToRenderProps(configurableDescriptor)).toMatchObject({
      variant: "configurable",
      name: "BlockConfigurable",
      props: {
        slug: "test-configurable-block",
        sizingType: "discrete",
        optionCount: 2,
      },
    });
    expect(blockDescriptorToRenderProps(parametricDescriptor)).toMatchObject({
      variant: "parametric",
      name: "BlockParametric",
      props: {
        slug: "test-parametric-block",
        parameterCount: 1,
      },
    });
  });

  it("getPuckData emits minimal single-block Puck Data for portal Render", () => {
    const data = getPuckData(fixedDescriptor);
    expect(data.root).toEqual({ props: { title: "test-fixed-block" } });
    expect(data.content).toHaveLength(1);
    expect(data.content[0]).toMatchObject({
      type: "BlockFixed",
      props: {
        id: fixedDescriptor.id,
        slug: "test-fixed-block",
        sku: "",
      },
    });
  });

  it("getPuckEditorData prefills identity + geometry for legacy editor path", () => {
    const data = getPuckEditorData(fixedDescriptor);
    const props = data.content[0]?.props as Record<string, unknown>;
    expect(props.slug).toBe("test-fixed-block");
    expect(props.geometry).toEqual(fixedDescriptor.geometry);
    expect(props.viewBox).toEqual(fixedDescriptor.viewBox);
    expect(props.themeTokens).toMatchObject({
      currentColor: "currentColor",
    });
  });

  it("exposes frozen puckConfig components for all three variants", () => {
    expect(puckConfig.components).toMatchObject({
      BlockFixed: expect.objectContaining({ render: expect.any(Function) }),
      BlockConfigurable: expect.objectContaining({ render: expect.any(Function) }),
      BlockParametric: expect.objectContaining({ render: expect.any(Function) }),
    });
  });

  it("re-exports mount plane values from MountPlaneSchema", () => {
    expect(MOUNT_PLANE_VALUES.length).toBeGreaterThan(0);
    expect(MOUNT_PLANE_VALUES).toContain("floor");
  });
});
