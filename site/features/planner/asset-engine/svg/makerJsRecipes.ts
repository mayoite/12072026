/**
 * Parametric 2D models via Maker.js — recipes feed pipelineCore (S2) as SVG path `d`.
 * Rectilinear booleans remain on polygon-clipping when no `maker` block is set.
 */

import makerjs from "makerjs";

export type LinearDeskMakerRecipe = {
  readonly recipe: "linear-desk";
  readonly widthMm: number;
  readonly depthMm: number;
  /** Visible top thickness (plan depth strip). Default 80mm. */
  readonly topThicknessMm?: number;
};

export type LDeskMakerRecipe = {
  readonly recipe: "l-desk";
  readonly widthMm: number;
  readonly depthMm: number;
  /** Return leg width along the main run (mm). */
  readonly returnWidthMm: number;
};

export type MakerRecipe = LinearDeskMakerRecipe | LDeskMakerRecipe;

export type MakerModelResult = {
  readonly model: makerjs.IModel;
  readonly viewBox: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
};

function assertPositiveMm(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`maker recipe ${label} must be a positive number`);
  }
  return value;
}

/** Simple linear workstation footprint: full top + modesty panel inset. */
export function buildLinearDeskMakerModel(recipe: LinearDeskMakerRecipe): MakerModelResult {
  const widthMm = assertPositiveMm(recipe.widthMm, "widthMm");
  const depthMm = assertPositiveMm(recipe.depthMm, "depthMm");
  const topThicknessMm = Math.min(
    depthMm,
    Math.max(40, recipe.topThicknessMm ?? 80),
  );

  const top = new makerjs.models.Rectangle(widthMm, topThicknessMm);
  top.origin = [0, 0];

  const body = new makerjs.models.Rectangle(widthMm, depthMm - topThicknessMm);
  body.origin = [0, topThicknessMm];

  const kneeSpace = new makerjs.models.Rectangle(Math.round(widthMm * 0.35), 48);
  kneeSpace.origin = [Math.round(widthMm * 0.325), topThicknessMm + 24];

  const model: makerjs.IModel = {
    models: {
      "desk-top": top,
      "desk-body": body,
      "desk-knee-space": kneeSpace,
    },
  };

  return {
    model,
    viewBox: { x: 0, y: 0, width: widthMm, height: depthMm },
  };
}

/** L-shape desk: main run + return leg (union of two rects). */
export function buildLDeskMakerModel(recipe: LDeskMakerRecipe): MakerModelResult {
  const widthMm = assertPositiveMm(recipe.widthMm, "widthMm");
  const depthMm = assertPositiveMm(recipe.depthMm, "depthMm");
  const returnWidthMm = Math.min(widthMm, assertPositiveMm(recipe.returnWidthMm, "returnWidthMm"));

  const main = new makerjs.models.Rectangle(widthMm, depthMm);
  main.origin = [0, 0];

  const returnLeg = new makerjs.models.Rectangle(returnWidthMm, depthMm);
  returnLeg.origin = [0, depthMm];

  const model: makerjs.IModel = {
    models: {
      main,
      return: returnLeg,
    },
  };

  return {
    model,
    viewBox: {
      x: 0,
      y: 0,
      width: widthMm,
      height: depthMm + depthMm,
    },
  };
}

export function buildMakerModel(recipe: MakerRecipe): MakerModelResult {
  switch (recipe.recipe) {
    case "linear-desk":
      return buildLinearDeskMakerModel(recipe);
    case "l-desk":
      return buildLDeskMakerModel(recipe);
    default: {
      const _exhaustive: never = recipe;
      throw new Error(`Unknown maker recipe: ${String(_exhaustive)}`);
    }
  }
}
