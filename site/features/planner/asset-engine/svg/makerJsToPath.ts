/**
 * Maker.js → SVG path `d` for pipelineCore publish (sanitize + SVGO stay in S3).
 */

import makerjs from "makerjs";

import {
  buildMakerModel,
  type MakerRecipe,
} from "./makerJsRecipes";

export type MakerPathResult = {
  readonly dPath: string;
  readonly viewBox: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
};

/** Compile a descriptor `maker` recipe to a single SVG path string (mm plan space). */
export function compileMakerRecipeToPath(recipe: MakerRecipe): MakerPathResult {
  const { model, viewBox } = buildMakerModel(recipe);
  const dPath = makerjs.exporter.toSVGPathData(model, { origin: [0, 0] });
  if (!dPath || dPath.trim().length === 0) {
    throw new Error(`maker recipe "${recipe.recipe}" produced empty path data`);
  }
  return { dPath, viewBox };
}
