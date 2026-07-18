export {
  LinearDeskFieldsSchema,
  LinearDeskDisplayUnitSchema,
  parseLinearDeskFields,
  type LinearDeskFields,
  type LinearDeskDisplayUnit,
} from "./linearDeskFields";

/** K1 Maker pen — form / CLI / publish use only these. */
export {
  drawLinearDesk,
  fieldsToLinearDeskMakerRecipe,
  linearDeskPartsToSvg,
  renderLinearDeskSvg,
  type LinearDeskDrawResult,
  type LinearDeskPart,
  type LinearDeskPartRole,
} from "./drawLinearDesk";

/**
 * @deprecated Template multipath — not the parametric pen after K1.
 * Prefer `drawLinearDesk` / `renderLinearDeskSvg` from this barrel.
 */
export { drawLinearDeskFromTemplate } from "./drawLinearDeskFromTemplate";
