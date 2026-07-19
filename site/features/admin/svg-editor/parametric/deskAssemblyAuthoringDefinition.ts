import {
  displayValueToMm,
  mmToDisplayValue,
} from "@/features/planner/model/units";
import { deskAssemblyDrawer } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer";
import { DeskAssemblyFieldsSchema } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyFields";
import {
  defineParametricAuthoringDefinition,
  type ParametricDisplayUnit,
} from "./authoringTypes";

export type DeskAssemblyDisplay = {
  readonly displayUnit: ParametricDisplayUnit;
  readonly layout: "linear" | "u";
  readonly workstationCount: number;
  readonly runLength: number;
  readonly returnLength: number;
  readonly deskDepth: number;
  readonly deskHeight: number;
  readonly aisle: number;
  readonly powerRail: boolean;
  readonly cableManagement: boolean;
  readonly modesty: boolean;
  readonly partitions: boolean;
  readonly name: string;
  readonly sku: string;
  readonly slug: string;
};

const LENGTH_KEYS = [
  "runLength",
  "returnLength",
  "deskDepth",
  "deskHeight",
  "aisle",
] as const;

function defaultIdentity(workstationCount: number) {
  const count = String(workstationCount).padStart(2, "0");
  return {
    name: `Desk assembly — ${workstationCount} workstations`,
    sku: `OANDO-DSK-ASM-${count}`,
    slug: `oando-desk-assembly-${count}`,
  };
}

function defaultDisplay(
  unit: ParametricDisplayUnit = "cm",
): DeskAssemblyDisplay {
  const fields = deskAssemblyDrawer.defaults();
  return {
    displayUnit: unit,
    layout: fields.layout,
    workstationCount: fields.workstationCount,
    runLength: mmToDisplayValue(fields.runLengthMm, unit),
    returnLength: mmToDisplayValue(fields.returnLengthMm, unit),
    deskDepth: mmToDisplayValue(fields.deskDepthMm, unit),
    deskHeight: mmToDisplayValue(fields.deskHeightMm, unit),
    aisle: mmToDisplayValue(fields.aisleMm, unit),
    powerRail: fields.powerRail,
    cableManagement: fields.cableManagement,
    modesty: fields.modesty,
    partitions: fields.partitions,
    ...defaultIdentity(fields.workstationCount),
  };
}

export const deskAssemblyAuthoringDefinition =
  defineParametricAuthoringDefinition({
    type: "desk-assembly",
    drawer: deskAssemblyDrawer,
    defaultDisplay,
    parseDisplay: (display: DeskAssemblyDisplay) => {
      const parsed = DeskAssemblyFieldsSchema.safeParse({
        type: "desk-assembly",
        layout: display.layout,
        workstationCount: display.workstationCount,
        runLengthMm: displayValueToMm(display.runLength, display.displayUnit),
        returnLengthMm: displayValueToMm(
          display.returnLength,
          display.displayUnit,
        ),
        deskDepthMm: displayValueToMm(display.deskDepth, display.displayUnit),
        deskHeightMm: displayValueToMm(display.deskHeight, display.displayUnit),
        aisleMm: displayValueToMm(display.aisle, display.displayUnit),
        powerRail: display.powerRail,
        cableManagement: display.cableManagement,
        modesty: display.modesty,
        partitions: display.partitions,
        name: display.name,
        sku: display.sku,
        slug: display.slug,
      });
      if (parsed.success) return { ok: true as const, fields: parsed.data };
      return {
        ok: false as const,
        errors: parsed.error.issues.map((issue) => ({
          path: String(issue.path[0] ?? "form").replace(/Mm$/, ""),
          message: issue.message,
        })),
      };
    },
    convertUnit: (display: DeskAssemblyDisplay, nextUnit) => {
      if (display.displayUnit === nextUnit) return display;
      const converted = { ...display, displayUnit: nextUnit };
      for (const key of LENGTH_KEYS) {
        converted[key] = mmToDisplayValue(
          displayValueToMm(display[key], display.displayUnit),
          nextUnit,
        );
      }
      return converted;
    },
    updateDisplay: (display: DeskAssemblyDisplay, key, value) => {
      if (key !== "workstationCount" || typeof value !== "number") {
        return { ...display, [key]: value };
      }
      const previousIdentity = defaultIdentity(display.workstationCount);
      const nextIdentity = defaultIdentity(value);
      return {
        ...display,
        workstationCount: value,
        name: display.name === previousIdentity.name ? nextIdentity.name : display.name,
        sku: display.sku === previousIdentity.sku ? nextIdentity.sku : display.sku,
        slug: display.slug === previousIdentity.slug ? nextIdentity.slug : display.slug,
      };
    },
    sections: [
      {
        id: "identity",
        label: "Identity",
        fields: [
          { key: "name", label: "Name", kind: "text", span: "full" },
          { key: "sku", label: "SKU", kind: "text" },
          { key: "slug", label: "Slug", kind: "text" },
        ],
      },
      {
        id: "layout",
        label: "Layout",
        fields: [
          {
            key: "layout",
            label: "Assembly layout",
            kind: "select",
            options: [
              { value: "linear", label: "Linear" },
              { value: "u", label: "U layout" },
            ],
          },
        ],
      },
      {
        id: "dimensions",
        label: "Dimensions",
        fields: [
          { key: "runLength", label: "Run length", kind: "number", unit: "length" },
          {
            key: "returnLength",
            label: "Return length",
            kind: "number",
            unit: "length",
          },
          { key: "deskDepth", label: "Desk depth", kind: "number", unit: "length" },
          { key: "deskHeight", label: "Desk height", kind: "number", unit: "length" },
        ],
      },
      {
        id: "workstations",
        label: "Workstations",
        fields: [
          { key: "workstationCount", label: "Count", kind: "number" },
        ],
      },
      {
        id: "aisle",
        label: "Aisle",
        fields: [
          { key: "aisle", label: "Clearance", kind: "number", unit: "length" },
        ],
      },
      {
        id: "options",
        label: "Options",
        fields: [
          { key: "powerRail", label: "Power rail", kind: "boolean" },
          {
            key: "cableManagement",
            label: "Cable management",
            kind: "boolean",
          },
          { key: "modesty", label: "Modesty", kind: "boolean" },
          { key: "partitions", label: "Partitions", kind: "boolean" },
        ],
      },
    ],
    tools: [
      { kind: "command", id: "fit", label: "Fit assembly", command: "fit" },
      { kind: "toggle", id: "grid", label: "Grid", field: "grid" },
      {
        kind: "part-focus",
        id: "workstations",
        label: "Workstations",
        partRole: "workstation",
      },
      {
        kind: "part-focus",
        id: "aisle",
        label: "Aisle",
        partRole: "clearance",
      },
    ],
    identity: {
      read: (display: DeskAssemblyDisplay) => ({
        name: display.name,
        sku: display.sku,
        slug: display.slug,
      }),
      write: (display: DeskAssemblyDisplay, identity) => ({
        ...display,
        ...identity,
      }),
    },
  });
