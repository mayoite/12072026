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
  /** Inset from left/right outer edge to pedestal (mm). Default 120. */
  readonly pedestalInsetMm?: number;
  /** Gap below top band before pedestals start (mm). Default 0. */
  readonly pedestalTopGapMm?: number;
  /** Inset from back edge under pedestals (mm). Default 80. */
  readonly pedestalBackInsetMm?: number;
  /**
   * When true (default), emit desk-top + pedestal-l + pedestal-r.
   * When false, emit desk-top band only (no knee slab, no pedestals).
   */
  readonly pedestals?: boolean;
  /** Optional modesty panel between dual pedestals. Default false. */
  readonly modesty?: boolean;
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
 * full-width top band + dual rect pedestals (no knee slab) + optional modesty.
 * Maker model Y grows +depth from the top edge; exporter maps to plan Y-down.
 * Schema insets (pedestalInsetMm / pedestalTopGapMm / pedestalBackInsetMm) override sample defaults.
 */
export function buildLinearDeskMakerModel(recipe: LinearDeskMakerRecipe): MakerModelResult {
  const widthMm = assertPositiveMm(recipe.widthMm, "widthMm");
  const depthMm = assertPositiveMm(recipe.depthMm, "depthMm");
  const topThicknessMm = Math.min(
    depthMm,
    Math.max(40, recipe.topThicknessMm ?? 80),
  );
  const usePedestals = recipe.pedestals !== false;
  const pedestalInsetMm = Math.max(
    0,
    recipe.pedestalInsetMm ?? SAMPLE_PEDESTAL_INSET_X_MM,
  );
  const pedestalTopGapMm = Math.max(0, recipe.pedestalTopGapMm ?? 0);
  const pedestalBackInsetMm = Math.max(
    0,
    recipe.pedestalBackInsetMm ?? SAMPLE_PEDESTAL_BOTTOM_INSET_MM,
  );

  const top = new makerjs.models.Rectangle(widthMm, topThicknessMm);
  top.origin = [0, 0];

  const models: Record<string, makerjs.IModel> = {
    "desk-top": top,
  };

  if (usePedestals) {
    const rawPedW = recipe.pedestalWidthMm ?? DEFAULT_PEDESTAL_WIDTH_MM;
    const maxPedW = Math.max(40, Math.floor((widthMm - 2 * pedestalInsetMm) / 2));
    const pedestalWidthMm = Math.min(
      Math.max(40, rawPedW),
      maxPedW,
      Math.max(40, widthMm - 2 * pedestalInsetMm),
    );

    const pedestalY = topThicknessMm + pedestalTopGapMm;
    const bottomInset = Math.min(
      pedestalBackInsetMm,
      Math.max(0, depthMm - pedestalY - 40),
    );
    const pedestalHeightMm = Math.max(40, depthMm - pedestalY - bottomInset);
    const leftX = Math.min(pedestalInsetMm, Math.max(0, widthMm - pedestalWidthMm - 40));
    const rightX = Math.max(
      leftX + pedestalWidthMm + 40,
      widthMm - pedestalInsetMm - pedestalWidthMm,
    );

    const pedestalL = new makerjs.models.Rectangle(pedestalWidthMm, pedestalHeightMm);
    pedestalL.origin = [leftX, pedestalY];

    const pedestalR = new makerjs.models.Rectangle(pedestalWidthMm, pedestalHeightMm);
    pedestalR.origin = [rightX, pedestalY];

    models["pedestal-l"] = pedestalL;
    models["pedestal-r"] = pedestalR;

    if (recipe.modesty === true) {
      const gap = rightX - (leftX + pedestalWidthMm);
      if (gap > 80) {
        const modestyW = gap * 0.7;
        const modestyH = pedestalHeightMm * 0.2;
        const modestyX = leftX + pedestalWidthMm + gap * 0.15;
        const modestyY = pedestalY + pedestalHeightMm * 0.15;
        const modesty = new makerjs.models.Rectangle(modestyW, modestyH);
        modesty.origin = [modestyX, modestyY];
        models.modesty = modesty;
      }
    }
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
