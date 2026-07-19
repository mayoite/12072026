import { drawLinearDesk, linearDeskPartsToSvg } from "./drawLinearDesk";
import { LinearDeskFieldsSchema } from "./linearDeskFields";
import { defineParametricProductDrawer } from "./productDrawer";

export const linearDeskDrawer = defineParametricProductDrawer({
  type: "linear-desk",
  label: "Linear desk",
  schema: LinearDeskFieldsSchema,
  defaults: () =>
    LinearDeskFieldsSchema.parse({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      heightMm: 750,
      topThicknessMm: 120,
      pedestalWidthMm: 200,
      pedestalInsetMm: 120,
      pedestalTopGapMm: 40,
      pedestalBackInsetMm: 80,
      pedestalCount: 2,
      modesty: false,
    }),
  capabilities: {
    selectableParts: true,
    measurable: true,
    supportsGrid: true,
    supportsSnap: false,
  },
  render: (fields) => {
    const draw = drawLinearDesk(fields);
    return {
      svg: linearDeskPartsToSvg(draw),
      viewBox: draw.viewBox,
      widthMm: fields.widthMm,
      depthMm: fields.depthMm,
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
