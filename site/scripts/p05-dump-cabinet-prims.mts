/**
 * One-shot P05 visual prim dump (not a product entrypoint).
 * Run: pnpm exec tsx scripts/p05-dump-cabinet-prims.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "../features/planner/open3d/catalog/furnitureBlock2D.ts";
import type { Open3dFurnitureItem } from "../features/planner/open3d/model/types.ts";

function item(doorStyle: "slab" | "pair" | "none"): Open3dFurnitureItem {
  return {
    id: "vis",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: 800,
    depth: 400,
    height: 900,
    geometryMode: "modular-cabinet-v0",
    modularOptions: {
      widthMm: 800,
      depthMm: 400,
      heightMm: 900,
      doorStyle,
      material: "white",
    },
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(
  here,
  "../../results/planner/world-standard-wave/05-symbols-svg/05-visual",
);
mkdirSync(outDir, { recursive: true });

const pair = furnitureBlock2DFromItem(item("pair"));
const slab = furnitureBlock2DFromItem(item("slab"));
const none = furnitureBlock2DFromItem(item("none"));
const centered = furnitureBlockUsesCenteredPath(item("slab"));

const payload = {
  generatedAt: new Date().toISOString(),
  furnitureBlockUsesCenteredPath: centered,
  pair: { primCount: pair.prims.length, footprint: pair.footprint, prims: pair.prims },
  slab: { primCount: slab.prims.length, footprint: slab.footprint, prims: slab.prims },
  none: { primCount: none.prims.length, footprint: none.footprint, prims: none.prims },
  criteria: {
    notEmptyBox: pair.prims.length >= 4 && slab.prims.length >= 4,
    doorStyleDiffers: pair.prims.length !== slab.prims.length,
    centeredPathFalse: centered === false,
  },
};

const outFile = join(outDir, "cabinet-v0-prims.json");
writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log("wrote", outFile);
console.log(JSON.stringify(payload.criteria));
console.log(
  "counts",
  "pair",
  pair.prims.length,
  "slab",
  slab.prims.length,
  "none",
  none.prims.length,
);
