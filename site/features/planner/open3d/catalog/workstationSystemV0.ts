/**
 * Systems v0 — one premium workstation family as pure rules.
 *
 * Model (product context): not fixed retail SKUs — size grid × shape × modules,
 * client-specific matrices later. Non-coder path will feed these rules; this module
 * is the expandable combinatorics core without free-GLB dumps.
 *
 * Footprints in mm, plan space (top-left / axis-aligned for linear; L as union AABB).
 */

export type WorkstationShapeV0 = "linear" | "l-shape";

export type WorkstationSizeMm = {
  /** Main run length (mm) */
  lengthMm: number;
  /** Main run depth (mm) */
  depthMm: number;
};

/** Size grid from product language (900×600, 900×750, 1200×600, 1500×600). */
export const WORKSTATION_V0_SIZE_GRID: readonly WorkstationSizeMm[] = [
  { lengthMm: 900, depthMm: 600 },
  { lengthMm: 900, depthMm: 750 },
  { lengthMm: 1200, depthMm: 600 },
  { lengthMm: 1500, depthMm: 600 },
] as const;

export type WorkstationModuleKindV0 =
  | "desk"
  | "return"
  | "pedestal"
  | "panel"
  | "overhead";

export const WORKSTATION_V0_DEFAULT_HEIGHT_MM = 750;

export type WorkstationConfigV0 = {
  shape: WorkstationShapeV0;
  size: WorkstationSizeMm;
  modules: readonly WorkstationModuleKindV0[];
  heightMm: number;
};

export type WorkstationFootprintMm = {
  widthMm: number;
  depthMm: number;
};

const MIN_MM = 1;

function positive(n: number, fallback: number): number {
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Axis-aligned plan footprint for placement / inventory.
 * - linear: L × D
 * - l-shape: L × (D + return depth) where return depth defaults to D (symmetric wing)
 */
export function workstationFootprintMm(
  config: Pick<WorkstationConfigV0, "shape" | "size">,
): WorkstationFootprintMm {
  const lengthMm = positive(config.size.lengthMm, 1200);
  const depthMm = positive(config.size.depthMm, 600);
  if (config.shape === "linear") {
    return {
      widthMm: Math.max(MIN_MM, lengthMm),
      depthMm: Math.max(MIN_MM, depthMm),
    };
  }
  // L: main run + return wing of depth `depthMm` along the end
  return {
    widthMm: Math.max(MIN_MM, lengthMm),
    depthMm: Math.max(MIN_MM, depthMm + depthMm),
  };
}

/** Validate modules for shape (return only meaningful on L). */
export function normalizeModules(
  shape: WorkstationShapeV0,
  modules: readonly WorkstationModuleKindV0[],
): WorkstationModuleKindV0[] {
  const hasDesk = modules.includes("desk");
  const next = [...modules];
  if (!hasDesk) next.unshift("desk");
  if (shape === "linear") {
    return next.filter((m) => m !== "return");
  }
  if (!next.includes("return")) next.push("return");
  return next;
}

export function createWorkstationConfigV0(input: {
  shape: WorkstationShapeV0;
  size: WorkstationSizeMm;
  modules?: readonly WorkstationModuleKindV0[];
  heightMm?: number;
}): WorkstationConfigV0 {
  const shape = input.shape;
  const size = {
    lengthMm: positive(input.size.lengthMm, 1200),
    depthMm: positive(input.size.depthMm, 600),
  };
  return {
    shape,
    size,
    modules: normalizeModules(shape, input.modules ?? ["desk"]),
    heightMm: positive(input.heightMm ?? WORKSTATION_V0_DEFAULT_HEIGHT_MM, WORKSTATION_V0_DEFAULT_HEIGHT_MM),
  };
}

/**
 * Expand the v0 family matrix: every size × both shapes × default module sets.
 * Used for BOQ-scale instance generation tests (thousands of seats = many instances of rules).
 */
export function expandWorkstationV0Matrix(
  sizeGrid: readonly WorkstationSizeMm[] = WORKSTATION_V0_SIZE_GRID,
): WorkstationConfigV0[] {
  const out: WorkstationConfigV0[] = [];
  for (const size of sizeGrid) {
    out.push(
      createWorkstationConfigV0({
        shape: "linear",
        size,
        modules: ["desk", "pedestal", "panel"],
      }),
    );
    out.push(
      createWorkstationConfigV0({
        shape: "l-shape",
        size,
        modules: ["desk", "return", "pedestal", "panel"],
      }),
    );
  }
  return out;
}

/**
 * Stable configuration key for identity / BOQ (not a free-model SKU).
 * Example: `ws-v0-linear-1500x600-desk+pedestal+panel`
 */
export function workstationConfigKey(config: WorkstationConfigV0): string {
  const mods = [...config.modules].sort().join("+");
  return `ws-v0-${config.shape}-${config.size.lengthMm}x${config.size.depthMm}-${mods}`;
}

/**
 * Pure “place many” helper: N instances of a config with grid spacing (mm).
 * Does not touch the document — placementAction will consume this later.
 */
export function layoutWorkstationInstances(
  config: WorkstationConfigV0,
  count: number,
  options?: { pitchMm?: number; columns?: number },
): Array<{ index: number; xMm: number; yMm: number; key: string }> {
  const n = Math.max(0, Math.floor(count));
  const fp = workstationFootprintMm(config);
  const pitch = positive(options?.pitchMm ?? fp.widthMm + 200, fp.widthMm + 200);
  const columns = Math.max(1, Math.floor(options?.columns ?? 10));
  const key = workstationConfigKey(config);
  const rows: Array<{ index: number; xMm: number; yMm: number; key: string }> = [];
  for (let i = 0; i < n; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    rows.push({
      index: i,
      xMm: col * pitch,
      yMm: row * (fp.depthMm + 200),
      key: `${key}#${i}`,
    });
  }
  return rows;
}

/**
 * Plan Block2D-ish rect prims (mm, top-left origin of footprint AABB).
 * Linear = one desk rect; L = main + return wing.
 */
export type WorkstationPlanPrimV0 = {
  kind: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  role: "desk" | "return" | "pedestal" | "panel";
};

export function workstationPlanPrims(config: WorkstationConfigV0): WorkstationPlanPrimsResult {
  const { lengthMm: L, depthMm: D } = config.size;
  const modules = new Set(config.modules);
  const prims: WorkstationPlanPrimV0[] = [];

  prims.push({ kind: "rect", x: 0, y: 0, w: L, h: D, role: "desk" });

  if (config.shape === "l-shape" && modules.has("return")) {
    // Return wing along +Y from main depth, width = D
    prims.push({ kind: "rect", x: L - D, y: D, w: D, h: L - D, role: "return" });
  }

  if (modules.has("pedestal")) {
    const pw = Math.min(400, L * 0.35);
    const pd = Math.min(500, D * 0.85);
    prims.push({
      kind: "rect",
      x: 40,
      y: (D - pd) / 2,
      w: pw,
      h: pd,
      role: "pedestal",
    });
  }

  if (modules.has("panel")) {
    prims.push({
      kind: "rect",
      x: 0,
      y: -40,
      w: L,
      h: 40,
      role: "panel",
    });
  }

  const fp = workstationFootprintMm(config);
  return { footprint: fp, prims };
}

export type WorkstationPlanPrimsResult = {
  footprint: WorkstationFootprintMm;
  prims: WorkstationPlanPrimV0[];
};
