import { mmToDisplayValue } from "@/features/planner/model/units";
import {
  DeskAssemblyFieldsSchema,
  type DeskAssemblyFields,
} from "@/features/planner/asset-engine/svg/parametric/deskAssemblyFields";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { DeskAssemblyDisplay } from "./deskAssemblyAuthoringDefinition";
import type { ParametricDisplayUnit } from "./authoringTypes";

function defaultName(workstationCount: number): string {
  return `Desk assembly — ${workstationCount} workstations`;
}

/** Rebuild authoring fields from a published descriptor that stores maker.desk-assembly. */
export function deskAssemblyFieldsFromDescriptor(
  descriptor: BlockDescriptor,
): DeskAssemblyFields | null {
  const maker = descriptor.maker;
  if (!maker || maker.recipe !== "desk-assembly") return null;
  const parsed = DeskAssemblyFieldsSchema.safeParse({
    type: "desk-assembly",
    layout: maker.layout,
    workstationCount: maker.workstationCount,
    runLengthMm: maker.runLengthMm,
    returnLengthMm: maker.returnLengthMm,
    deskDepthMm: maker.deskDepthMm,
    deskHeightMm: descriptor.geometry.heightMm,
    aisleMm: maker.aisleMm,
    powerRail: maker.powerRail,
    cableManagement: maker.cableManagement,
    modesty: maker.modesty,
    partitions: maker.partitions,
    name: defaultName(maker.workstationCount),
    sku: descriptor.sku,
    slug: descriptor.slug,
  });
  return parsed.success ? parsed.data : null;
}

export function deskAssemblyFieldsToDisplay(
  fields: DeskAssemblyFields,
  unit: ParametricDisplayUnit = "cm",
): DeskAssemblyDisplay {
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
    name: fields.name ?? defaultName(fields.workstationCount),
    sku: fields.sku ?? `OANDO-DSK-ASM-${String(fields.workstationCount).padStart(2, "0")}`,
    slug:
      fields.slug ??
      `oando-desk-assembly-${String(fields.workstationCount).padStart(2, "0")}`,
  };
}
