import makerjs from "makerjs";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { defineParametricProductDrawer } from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import {
  defineParametricAuthoringDefinition,
  eraseParametricAuthoringDefinition,
} from "@/features/admin/svg-editor/parametric/authoringTypes";
import { deskAssemblyAuthoringDefinition } from "@/features/admin/svg-editor/parametric/deskAssemblyAuthoringDefinition";
import {
  assertParametricAuthoringManifestParity,
  createParametricAuthoringRegistry,
  parametricAuthoringRegistry,
} from "@/features/admin/svg-editor/parametric/parametricAuthoringRegistry";

const TestBedSchema = z.object({
  type: z.literal("test-bed"),
  widthMm: z.number().min(800),
  depthMm: z.number().min(1600),
  storage: z.boolean(),
});

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
  render: (fields) => {
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
  },
});

type TestBedDisplay = {
  readonly displayUnit: "mm" | "cm";
  readonly width: number;
  readonly depth: number;
  readonly storage: boolean;
  readonly name: string;
  readonly sku: string;
  readonly slug: string;
};

const testBedDefinition = defineParametricAuthoringDefinition({
  type: "test-bed",
  drawer: testBedDrawer,
  defaultDisplay: (): TestBedDisplay => ({
    displayUnit: "cm",
    width: 160,
    depth: 200,
    storage: false,
    name: "Test bed",
    sku: "TEST-BED-01",
    slug: "test-bed-01",
  }),
  parseDisplay: (display) => {
    const parsed = TestBedSchema.safeParse({
      type: "test-bed",
      widthMm: display.displayUnit === "cm" ? display.width * 10 : display.width,
      depthMm: display.displayUnit === "cm" ? display.depth * 10 : display.depth,
      storage: display.storage,
    });
    return parsed.success
      ? { ok: true as const, fields: parsed.data }
      : {
          ok: false as const,
          errors: parsed.error.issues.map((issue) => ({
            path: String(issue.path[0] ?? "form"),
            message: issue.message,
          })),
        };
  },
  convertUnit: (display, nextUnit) =>
    display.displayUnit === nextUnit
      ? display
      : {
          ...display,
          displayUnit: nextUnit,
          width: nextUnit === "cm" ? display.width / 10 : display.width * 10,
          depth: nextUnit === "cm" ? display.depth / 10 : display.depth * 10,
        },
  updateDisplay: (display, key, value) => ({ ...display, [key]: value }),
  sections: [
    {
      id: "mattress",
      label: "Mattress",
      fields: [
        { key: "width", label: "Width", kind: "number", unit: "length" },
      ],
    },
  ],
  tools: [
    { kind: "command", id: "headboard", label: "Headboard", command: "headboard" },
  ],
  identity: {
    read: (display) => ({
      name: display.name,
      sku: display.sku,
      slug: display.slug,
    }),
    write: (display, identity) => ({ ...display, ...identity }),
  },
});

describe("parametricAuthoringRegistry", () => {
  it("supports product-specific sections and tools through one API", () => {
    const registry = createParametricAuthoringRegistry([
      eraseParametricAuthoringDefinition(deskAssemblyAuthoringDefinition),
      eraseParametricAuthoringDefinition(testBedDefinition),
    ]);

    expect(
      registry.require("desk-assembly").sections.map((section) => section.id),
    ).toContain("layout");
    expect(registry.require("test-bed").sections.map((section) => section.id)).toContain(
      "mattress",
    );
    expect(registry.require("test-bed").tools.map((tool) => tool.id)).toContain(
      "headboard",
    );
    expect(() => registry.require("sofa")).toThrow(
      "Unknown parametric authoring type",
    );
  });

  it("keeps the production authoring registry aligned with the manifest", () => {
    expect(() =>
      assertParametricAuthoringManifestParity(parametricAuthoringRegistry),
    ).not.toThrow();
  });

  it("rejects duplicate authoring types", () => {
    const runtime = eraseParametricAuthoringDefinition(testBedDefinition);
    expect(() => createParametricAuthoringRegistry([runtime, runtime])).toThrow(
      "Duplicate parametric authoring type",
    );
  });

  it("syncs default assembly identity when workstation count changes", () => {
    const definition = parametricAuthoringRegistry.require("desk-assembly");
    const display = definition.defaultDisplay("cm");
    const updated = definition.updateDisplay(display, "workstationCount", 12);
    expect(definition.identity.read(updated)).toEqual({
      name: "Desk assembly — 12 workstations",
      sku: "OANDO-DSK-ASM-12",
      slug: "oando-desk-assembly-12",
    });
  });
});
