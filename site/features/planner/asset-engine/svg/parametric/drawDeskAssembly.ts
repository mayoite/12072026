import { compileMakerRecipeToPaths } from "../makerJsToPath";
import type { DeskAssemblyMakerRecipe } from "../makerJsRecipes";
import type { DeskAssemblyFields } from "./deskAssemblyFields";

export type DeskAssemblyPartRole =
  | "workstation"
  | "structure"
  | "clearance"
  | "option";

export type DeskAssemblyPart = {
  readonly id: string;
  readonly role: DeskAssemblyPartRole;
  readonly dPath: string;
  readonly fill: string | "none";
  readonly stroke: string;
  readonly strokeWidth: number;
};

export type DeskAssemblyDrawResult = {
  readonly viewBox: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly parts: readonly DeskAssemblyPart[];
  readonly fields: DeskAssemblyFields;
};

const PAINT = {
  workstation: { fill: "#d8d3cc", stroke: "#2c2a28", strokeWidth: 12 },
  structure: { fill: "none", stroke: "#6b6660", strokeWidth: 8 },
  clearance: { fill: "none", stroke: "#4b7c8b", strokeWidth: 6 },
  option: { fill: "#8f8982", stroke: "#2c2a28", strokeWidth: 6 },
} as const;

function roleForPart(id: string): DeskAssemblyPartRole {
  if (id.startsWith("workstation-")) return "workstation";
  if (id === "aisle-clearance") return "clearance";
  if (id === "shared-run" || id.startsWith("return-")) return "structure";
  return "option";
}

export function fieldsToDeskAssemblyMakerRecipe(
  fields: DeskAssemblyFields,
): DeskAssemblyMakerRecipe {
  return {
    recipe: "desk-assembly",
    layout: fields.layout,
    workstationCount: fields.workstationCount,
    runLengthMm: fields.runLengthMm,
    returnLengthMm: fields.returnLengthMm,
    deskDepthMm: fields.deskDepthMm,
    aisleMm: fields.aisleMm,
    powerRail: fields.powerRail,
    cableManagement: fields.cableManagement,
    modesty: fields.modesty,
    partitions: fields.partitions,
  };
}

export function drawDeskAssembly(
  fields: DeskAssemblyFields,
): DeskAssemblyDrawResult {
  const compiled = compileMakerRecipeToPaths(
    fieldsToDeskAssemblyMakerRecipe(fields),
  );
  return {
    viewBox: compiled.viewBox,
    fields,
    parts: compiled.parts.map((part) => {
      const role = roleForPart(part.id);
      return {
        id: part.id,
        role,
        dPath: part.dPath,
        ...PAINT[role],
      };
    }),
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function deskAssemblyPartsToSvg(draw: DeskAssemblyDrawResult): string {
  const { fields, parts, viewBox } = draw;
  const title = fields.name ?? fields.slug ?? "Desk assembly";
  const paths = parts
    .map(
      (part) =>
        `<path id="${escapeXml(part.id)}" d="${escapeXml(part.dPath)}"` +
        ` fill="${escapeXml(part.fill)}" stroke="${escapeXml(part.stroke)}"` +
        ` stroke-width="${part.strokeWidth}" data-role="${part.role}"/>`,
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision"` +
    ` viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}"` +
    ` width="${viewBox.width}" height="${viewBox.height}"` +
    ` data-product-type="desk-assembly">` +
    `<title>${escapeXml(title)}</title><g>${paths}</g></svg>`
  );
}
