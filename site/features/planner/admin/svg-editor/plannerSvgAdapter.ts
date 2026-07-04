import type { SvgBlockDefinitionV1 } from "./svgBlockSchemas";

export interface PlannerSvgDefinitionV1 {
  readonly schemaVersion: 1;
  readonly typeId: string;
  readonly accessibility: SvgBlockDefinitionV1["accessibility"];
  readonly physicalDimensionsMm: SvgBlockDefinitionV1["physicalDimensionsMm"];
  readonly customerParameters: readonly SvgBlockDefinitionV1["parameters"][number][];
}

/** Browser-safe projection. Admin-only fields and authoring runtimes never cross this boundary. */
export function toPlannerSvgDefinition(definition: SvgBlockDefinitionV1): PlannerSvgDefinitionV1 {
  return {
    schemaVersion: 1,
    typeId: definition.typeId,
    accessibility: definition.accessibility,
    physicalDimensionsMm: definition.physicalDimensionsMm,
    customerParameters: definition.parameters.filter((parameter) => parameter.customerEditable),
  };
}
