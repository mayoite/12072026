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
  /** Pedestal post width (plan X). Default 200mm (~sample-desk-1). */
  readonly pedestalWidthMm?: number;
  /**
   * When true (default), emit desk-top + pedestal-l + pedestal-r.
   * When false, emit desk-top band only (no knee slab, no pedestals).
   */
  readonly pedestals?: boolean;
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

/** sample-desk-1 language: ~120mm outer inset for pedestal posts. */
const SAMPLE_PEDESTAL_INSET_X_MM = 120;
/** sample-desk-1 language: ~80mm bottom margin under pedestals. */
const SAMPLE_PEDESTAL_BOTTOM_INSET_MM = 80;
const DEFAULT_PEDESTAL_WIDTH_MM = 200;

function assertPositiveMm(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`maker recipe ${label} must be a positive number`);
  }
  return value;
}

/**
 * Linear workstation footprint in sample-desk-1 language:
 * full-width top band + dual rect pedestals (no knee slab).
 * Maker model Y grows +depth from the top edge; exporter maps to plan Y-down.
 */
export function buildLinearDeskMakerModel(recipe: LinearDeskMakerRecipe): MakerModelResult {
  const widthMm = assertPositiveMm(recipe.widthMm, "widthMm");
  const depthMm = assertPositiveMm(recipe.depthMm, "depthMm");
  const topThicknessMm = Math.min(
    depthMm,
    Math.max(40, recipe.topThicknessMm ?? 80),
  );
  const usePedestals = recipe.pedestals !== false;

  const top = new makerjs.models.Rectangle(widthMm, topThicknessMm);
  top.origin = [0, 0];

  const models: Record<string, makerjs.IModel> = {
    "desk-top": top,
  };

  if (usePedestals) {
    const rawPedW = recipe.pedestalWidthMm ?? DEFAULT_PEDESTAL_WIDTH_MM;
    const maxPedW = Math.max(40, Math.floor((widthMm - 2 * SAMPLE_PEDESTAL_INSET_X_MM) / 2));
    const pedestalWidthMm = Math.min(
      Math.max(40, rawPedW),
      maxPedW,
      Math.max(40, widthMm - 2 * SAMPLE_PEDESTAL_INSET_X_MM),
    );

    const bottomInset = Math.min(
      SAMPLE_PEDESTAL_BOTTOM_INSET_MM,
      Math.max(0, depthMm - topThicknessMm - 40),
    );
    const pedestalHeightMm = Math.max(40, depthMm - topThicknessMm - bottomInset);
    const pedestalY = topThicknessMm;
    const leftX = Math.min(SAMPLE_PEDESTAL_INSET_X_MM, Math.max(0, widthMm - pedestalWidthMm));
    const rightX = Math.max(0, widthMm - SAMPLE_PEDESTAL_INSET_X_MM - pedestalWidthMm);

    const pedestalL = new makerjs.models.Rectangle(pedestalWidthMm, pedestalHeightMm);
    pedestalL.origin = [leftX, pedestalY];

    const pedestalR = new makerjs.models.Rectangle(pedestalWidthMm, pedestalHeightMm);
    pedestalR.origin = [rightX, pedestalY];

    models["pedestal-l"] = pedestalL;
    models["pedestal-r"] = pedestalR;
  }

  const model: makerjs.IModel = { models };

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
