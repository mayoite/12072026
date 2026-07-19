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

export {
  defineParametricProductDrawer,
  eraseParametricProductDrawer,
  type ParametricPreview,
  type ParametricPreviewPart,
  type ParametricPreviewPath,
  type ParametricProductCapabilities,
  type ParametricProductDrawer,
  type ParametricProductDrawerRuntime,
} from "./productDrawer";
export {
  createParametricProductRegistry,
  type ParametricProductRegistry,
} from "./productDrawerRegistry";
export {
  assertParametricProductManifestParity,
  PARAMETRIC_PRODUCT_TYPE_IDS,
} from "./parametricProductManifest";
export { linearDeskDrawer } from "./linearDeskDrawer";
export {
  DeskAssemblyFieldsSchema,
  linearDeskFieldsToDeskAssembly,
  type DeskAssemblyFields,
} from "./deskAssemblyFields";
export {
  deskAssemblyPartsToSvg,
  drawDeskAssembly,
  fieldsToDeskAssemblyMakerRecipe,
  type DeskAssemblyDrawResult,
  type DeskAssemblyPart,
  type DeskAssemblyPartRole,
} from "./drawDeskAssembly";
export { deskAssemblyDrawer } from "./deskAssemblyDrawer";
