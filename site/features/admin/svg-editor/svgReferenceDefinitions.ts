import type { SvgBlockDefinitionV1 } from "./svgBlockSchemas";

const base = {
  schemaVersion: 1 as const,
  category: "Reference",
  tags: ["phase-1"] as string[],
  lifecycle: { status: "draft" as const, ownerId: "svg-admin" },
  accessibility: { title: "Reference block" },
};

export const FIXED_REFERENCE_DEFINITION = {
  ...base,
  typeId: "fixed-table",
  name: "Fixed table",
  viewBox: { x: 0, y: 0, width: 1200, height: 600 },
  physicalDimensionsMm: { width: 1200, depth: 600, height: 750 },
  parts: [{ kind: "rect", id: "top", x: 0, y: 0, width: 1200, height: 600, visible: true, customerEditable: false }],
  parameters: [],
  actions: [],
  constraints: [],
  variants: [],
  mounting: [],
} satisfies SvgBlockDefinitionV1;

export const CONFIGURABLE_REFERENCE_DEFINITION = {
  ...base,
  typeId: "configurable-door",
  name: "Configurable door",
  viewBox: { x: 0, y: 0, width: 900, height: 120 },
  physicalDimensionsMm: { width: 900, depth: 120, height: 2100 },
  parts: [{ kind: "rect", id: "leaf", x: 0, y: 0, width: 900, height: 120, visible: true, customerEditable: true }],
  parameters: [{ id: "width", kind: "length", label: "Width", customerEditable: true, defaultValue: 900, minimum: 700, maximum: 1200, step: 50 }],
  actions: [{ id: "resize-width", kind: "resize", parameterIds: ["width"] }],
  constraints: [],
  variants: [
    { id: "door-900", label: "900 mm", parameterValues: { width: 900 } },
    { id: "door-1200", label: "1200 mm", parameterValues: { width: 1200 } },
  ],
  mounting: [{ plane: "wall", anchor: { x: 0, y: 60 }, rotationDegrees: 0 }],
} satisfies SvgBlockDefinitionV1;

export const PARAMETRIC_REFERENCE_DEFINITION = {
  ...base,
  typeId: "parametric-cabinet",
  name: "Parametric cabinet",
  viewBox: { x: 0, y: 0, width: 900, height: 600 },
  physicalDimensionsMm: { width: 900, depth: 600, height: 2100 },
  parts: [{ kind: "rect", id: "carcass", x: 0, y: 0, width: 900, height: 600, visible: true, customerEditable: true }],
  parameters: [
    { id: "width", kind: "length", label: "Width", customerEditable: true, defaultValue: 900, minimum: 450, maximum: 2400, step: 50 },
    { id: "shelves", kind: "number", label: "Shelves", customerEditable: true, defaultValue: 4, minimum: 1, maximum: 12, step: 1 },
  ],
  actions: [{ id: "stretch-width", kind: "stretch", parameterIds: ["width"] }],
  constraints: [{ id: "shelf-limit", kind: "maximum", parameterIds: ["shelves"], value: 12 }],
  variants: [],
  mounting: [{ plane: "floor", anchor: { x: 450, y: 600 }, rotationDegrees: 0 }],
} satisfies SvgBlockDefinitionV1;

export const SVG_REFERENCE_DEFINITIONS = Object.freeze([
  FIXED_REFERENCE_DEFINITION,
  CONFIGURABLE_REFERENCE_DEFINITION,
  PARAMETRIC_REFERENCE_DEFINITION,
]);
