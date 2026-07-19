import makerjs from "makerjs";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  defineParametricProductDrawer,
  eraseParametricProductDrawer,
  type ParametricPreview,
} from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import { createParametricProductRegistry } from "@/features/planner/asset-engine/svg/parametric/productDrawerRegistry";
import {
  assertParametricProductManifestParity,
  PARAMETRIC_PRODUCT_TYPE_IDS,
} from "@/features/planner/asset-engine/svg/parametric/parametricProductManifest";

const TestBedSchema = z.object({
  type: z.literal("test-bed"),
  widthMm: z.number().min(800),
  depthMm: z.number().min(1600),
  storage: z.boolean(),
});

function renderMakerTestRectangle(fields: z.infer<typeof TestBedSchema>): ParametricPreview {
  const model = new makerjs.models.Rectangle(fields.widthMm, fields.depthMm);
  const exported = makerjs.exporter.toSVGPathData(model, {
    origin: [0, fields.depthMm],
  });
  const d =
    typeof exported === "string"
      ? exported
      : Object.values(exported)
          .filter((entry): entry is string => typeof entry === "string")
          .join(" ");
  return {
    svg: makerjs.exporter.toSVG(model),
    viewBox: { x: 0, y: 0, width: fields.widthMm, height: fields.depthMm },
    widthMm: fields.widthMm,
    depthMm: fields.depthMm,
    parts: [
      {
        id: "frame",
        role: "frame",
        paths: [
          {
            id: "frame",
            d,
            fill: "none",
            stroke: "#222222",
            strokeWidth: 8,
          },
        ],
      },
    ],
  };
}

const testBedDrawer = defineParametricProductDrawer({
  type: "test-bed",
  label: "Test bed",
  schema: TestBedSchema,
  defaults: () => ({
    type: "test-bed" as const,
    widthMm: 1600,
    depthMm: 2000,
    storage: false,
  }),
  capabilities: {
    selectableParts: true,
    measurable: true,
    supportsGrid: true,
    supportsSnap: false,
  },
  render: renderMakerTestRectangle,
});

function runtimeDrawer(type: string) {
  return {
    ...eraseParametricProductDrawer(testBedDrawer),
    type,
  };
}

describe("createParametricProductRegistry", () => {
  it("resolves registered types and validates before rendering", () => {
    const registry = createParametricProductRegistry([
      eraseParametricProductDrawer(testBedDrawer),
    ]);

    expect(
      registry.get("test-bed")?.render({
        type: "test-bed",
        widthMm: 1800,
        depthMm: 2100,
        storage: true,
      }).parts,
    ).toMatchObject([
      {
        id: "frame",
        role: "frame",
        paths: [
          {
            id: "frame",
            d: expect.any(String),
            fill: "none",
            stroke: "#222222",
            strokeWidth: 8,
          },
        ],
      },
    ]);
    expect(() =>
      registry.require("test-bed").render({
        type: "test-bed",
        widthMm: 400,
        depthMm: 2100,
        storage: true,
      }),
    ).toThrow();
    expect(registry.get("unknown")).toBeUndefined();
    expect(() => registry.require("unknown")).toThrow(
      "Unknown parametric product type",
    );
  });

  it("rejects duplicate product types", () => {
    const drawer = eraseParametricProductDrawer(testBedDrawer);
    expect(() => createParametricProductRegistry([drawer, drawer])).toThrow(
      "Duplicate parametric product type",
    );
  });

  it("lists an immutable registry snapshot", () => {
    const registry = createParametricProductRegistry([
      eraseParametricProductDrawer(testBedDrawer),
    ]);
    expect(registry.list().map((drawer) => drawer.type)).toEqual(["test-bed"]);
  });
});

describe("parametric product manifest parity", () => {
  it("accepts exact production type parity", () => {
    const registry = createParametricProductRegistry(
      PARAMETRIC_PRODUCT_TYPE_IDS.map(runtimeDrawer),
    );
    expect(() => assertParametricProductManifestParity(registry)).not.toThrow();
  });

  it("rejects missing, extra, and duplicate manifest entries", () => {
    const exactRegistry = createParametricProductRegistry(
      PARAMETRIC_PRODUCT_TYPE_IDS.map(runtimeDrawer),
    );
    expect(() =>
      assertParametricProductManifestParity(exactRegistry, [
        ...PARAMETRIC_PRODUCT_TYPE_IDS,
        "u-desk",
      ]),
    ).toThrow(/missing/i);

    const extraRegistry = createParametricProductRegistry([
      ...PARAMETRIC_PRODUCT_TYPE_IDS.map(runtimeDrawer),
      runtimeDrawer("test-bed"),
    ]);
    expect(() => assertParametricProductManifestParity(extraRegistry)).toThrow(
      /extra/i,
    );

    expect(() =>
      assertParametricProductManifestParity(exactRegistry, [
        ...PARAMETRIC_PRODUCT_TYPE_IDS,
        PARAMETRIC_PRODUCT_TYPE_IDS[0],
      ]),
    ).toThrow(/duplicate/i);
  });
});
