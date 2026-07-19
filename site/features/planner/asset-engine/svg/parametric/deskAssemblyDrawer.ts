import { DeskAssemblyFieldsSchema } from "./deskAssemblyFields";
import { deskAssemblyPartsToSvg, drawDeskAssembly } from "./drawDeskAssembly";
import { defineParametricProductDrawer } from "./productDrawer";

export const deskAssemblyDrawer = defineParametricProductDrawer({
  type: "desk-assembly",
  label: "Desk assembly",
  schema: DeskAssemblyFieldsSchema,
  defaults: () =>
    DeskAssemblyFieldsSchema.parse({
      type: "desk-assembly",
      layout: "linear",
      workstationCount: 4,
      runLengthMm: 6400,
      returnLengthMm: 3200,
      deskDepthMm: 800,
      deskHeightMm: 750,
      aisleMm: 1200,
      powerRail: false,
      cableManagement: true,
      modesty: false,
      partitions: false,
    }),
  capabilities: {
    selectableParts: true,
    measurable: true,
    supportsGrid: true,
    supportsSnap: false,
  },
  render: (fields) => {
    const draw = drawDeskAssembly(fields);
    return {
      svg: deskAssemblyPartsToSvg(draw),
      viewBox: draw.viewBox,
      widthMm: draw.viewBox.width,
      depthMm: draw.viewBox.height,
      parts: draw.parts.map((part) => ({
        id: part.id,
        role: part.role,
        paths: [
          {
            id: part.id,
            d: part.dPath,
            fill: part.fill,
            stroke: part.stroke,
            strokeWidth: part.strokeWidth,
          },
        ],
      })),
    };
  },
});
