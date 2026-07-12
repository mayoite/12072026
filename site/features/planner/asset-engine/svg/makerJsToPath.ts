/**
 * Maker.js → SVG path `d` for pipelineCore publish (sanitize + SVGO stay in S3).
 */

import makerjs from "makerjs";

import {
  buildMakerModel,
  type MakerRecipe,
} from "./makerJsRecipes";

export type MakerPathPart = {
  readonly id: string;
  readonly dPath: string;
};

export type MakerPathResult = {
  readonly dPath: string;
  readonly viewBox: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
};

export type MakerPathsResult = {
  readonly parts: readonly MakerPathPart[];
  readonly viewBox: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
};

function pathDataFromModel(model: makerjs.IModel): string {
  const output = makerjs.exporter.toSVGPathData(model, { origin: [0, 0] });
  const dPath =
    typeof output === "string"
      ? output
      : Object.values(output)
          .filter((entry): entry is string => typeof entry === "string")
          .join(" ");
  return dPath.trim();
}

/** One path per maker sub-model (inventory preview multipath). */
export function compileMakerRecipeToPaths(recipe: MakerRecipe): MakerPathsResult {
  const { model, viewBox } = buildMakerModel(recipe);
  const parts: MakerPathPart[] = [];

  if (model.models) {
    for (const [id, sub] of Object.entries(model.models)) {
      const dPath = pathDataFromModel(sub);
      if (dPath.length > 0) {
        parts.push({ id, dPath });
      }
    }
  }

  if (parts.length === 0) {
    const dPath = pathDataFromModel(model);
    if (!dPath) {
      throw new Error(`maker recipe "${recipe.recipe}" produced empty path data`);
    }
    parts.push({ id: recipe.recipe, dPath });
  }

  return { parts, viewBox };
}

/** Compile a descriptor `maker` recipe to a single SVG path string (mm plan space). */
export function compileMakerRecipeToPath(recipe: MakerRecipe): MakerPathResult {
  const { parts, viewBox } = compileMakerRecipeToPaths(recipe);
  const dPath = parts.map((part) => part.dPath).join(" ");
  if (!dPath || dPath.trim().length === 0) {
    throw new Error(`maker recipe "${recipe.recipe}" produced empty path data`);
  }
  return { dPath, viewBox };
}