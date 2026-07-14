/**
 * P08 / W7 headless visual smoke — render modular cabinet-v0 parts from the
 * pure plan (plan === mesh formulas). No designer GLB, no browser required.
 *
 * Usage (from site/):
 *   node scripts/p08-cabinet-v0-visual-smoke.mjs
 *   node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/world-standard-wave/08-mesh-quality
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, "..");

const outArgIdx = process.argv.indexOf("--out");
const outDir =
  outArgIdx >= 0 && process.argv[outArgIdx + 1]
    ? resolve(process.argv[outArgIdx + 1])
    : resolve(
        siteRoot,
        "../results/planner/world-standard-wave/08-mesh-quality",
      );

/** @typedef {{ name: string; sizeM: {x:number;y:number;z:number}; positionM: {x:number;y:number;z:number} }} Part */

// Load compiled-path free: reimplement locked formulas (must match modularCabinetV0).
// Cross-checked by unit tests (plan === mesh). Constants locked W7.
const TOE_HEIGHT_MM = 100;
const TOE_INSET_MM = 50;
const DOOR_THICKNESS_MM = 18;
const MM = 0.001;

const options = {
  widthMm: 600,
  depthMm: 580,
  heightMm: 720,
  doorStyle: "slab",
  material: "white",
};

/** @returns {Part[]} */
export function buildParts() {
  const w = options.widthMm * MM;
  const d = options.depthMm * MM;
  const h = options.heightMm * MM;
  const toeH = TOE_HEIGHT_MM * MM;
  const inset = TOE_INSET_MM * MM;
  const carcassH = h - toeH;
  const doorT = DOOR_THICKNESS_MM * MM;
  const carcassY = toeH + carcassH / 2;

  return [
    {
      name: "toe",
      sizeM: { x: w, y: toeH, z: d - inset },
      positionM: { x: 0, y: toeH / 2, z: -inset / 2 },
    },
    {
      name: "carcass",
      sizeM: { x: w, y: carcassH, z: d },
      positionM: { x: 0, y: carcassY, z: 0 },
    },
    {
      name: "door-slab",
      sizeM: { x: w * 0.96, y: carcassH * 0.92, z: doorT },
      positionM: { x: 0, y: carcassY, z: d / 2 + doorT / 2 },
    },
  ];
}

const PART_FILL = {
  toe: "#9ca3af",
  carcass: "#e5e7eb",
  "door-slab": "#f9fafb",
  "door-left": "#f9fafb",
  "door-right": "#f9fafb",
};

const PART_STROKE = {
  toe: "#4b5563",
  carcass: "#6b7280",
  "door-slab": "#374151",
  "door-left": "#374151",
  "door-right": "#374151",
};

/**
 * Project world (x,y,z) metres → SVG px for three-quarter or side view.
 * @param {"three-quarter"|"side"} view
 */
export function project(x, y, z, view, W, H, scale) {
  const ox = W / 2;
  const oy = H * 0.82;
  if (view === "side") {
    // X discarded; show depth Z horizontal, Y up
    return { sx: ox + z * scale, sy: oy - y * scale };
  }
  // three-quarter: isometric-ish
  const isoX = (x - z) * Math.cos(Math.PI / 6);
  const isoY = y + (x + z) * Math.sin(Math.PI / 6) * 0.55;
  return { sx: ox + isoX * scale, sy: oy - isoY * scale };
}

/** 8 corners of an axis-aligned box. */
function boxCorners(part) {
  const { x: cx, y: cy, z: cz } = part.positionM;
  const hx = part.sizeM.x / 2;
  const hy = part.sizeM.y / 2;
  const hz = part.sizeM.z / 2;
  const xs = [cx - hx, cx + hx];
  const ys = [cy - hy, cy + hy];
  const zs = [cz - hz, cz + hz];
  /** @type {{x:number;y:number;z:number}[]} */
  const out = [];
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) out.push({ x, y, z });
    }
  }
  return out;
}

/** Faces as 4-corner index lists into boxCorners order. */
const FACE_INDICES = [
  [0, 1, 3, 2], // -x
  [4, 5, 7, 6], // +x
  [0, 1, 5, 4], // -y
  [2, 3, 7, 6], // +y
  [0, 2, 6, 4], // -z
  [1, 3, 7, 5], // +z
];

/**
 * @param {Part[]} parts
 * @param {"three-quarter"|"side"} view
 */
export function renderSvg(parts, view) {
  const W = 720;
  const H = 540;
  const scale = view === "side" ? 380 : 320;

  /** @type {string[]} */
  const polygons = [];

  // Sort parts back-to-front for crude painter's algorithm
  const sorted = [...parts].sort((a, b) => {
    if (view === "side") return a.positionM.x - b.positionM.x;
    return a.positionM.z - b.positionM.z || a.positionM.y - b.positionM.y;
  });

  for (const part of sorted) {
    const corners = boxCorners(part);
    const projected = corners.map((c) =>
      project(c.x, c.y, c.z, view, W, H, scale),
    );
    // Draw faces sorted by average depth (z for 3q, x for side)
    const faces = FACE_INDICES.map((idxs) => {
      const pts = idxs.map((i) => projected[i]);
      const world = idxs.map((i) => corners[i]);
      const depth =
        view === "side"
          ? world.reduce((s, p) => s + p.x, 0) / 4
          : world.reduce((s, p) => s + p.z + p.x * 0.3, 0) / 4;
      return { pts, depth };
    }).sort((a, b) => a.depth - b.depth);

    for (const face of faces) {
      const points = face.pts.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(" ");
      const fill = PART_FILL[part.name] ?? "#ccc";
      const stroke = PART_STROKE[part.name] ?? "#333";
      polygons.push(
        `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" opacity="0.95"/>`,
      );
    }

    // Label centroid
    const c = project(
      part.positionM.x,
      part.positionM.y,
      part.positionM.z,
      view,
      W,
      H,
      scale,
    );
    polygons.push(
      `<text x="${c.sx.toFixed(1)}" y="${c.sy.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#111827">${part.name}</text>`,
    );
  }

  const title =
    view === "three-quarter"
      ? "cabinet-v0 three-quarter (toe → carcass → door-slab)"
      : "cabinet-v0 side (toe inset / depth readable)";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="24" y="32" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#0f172a">${title}</text>
  <text x="24" y="54" font-family="Segoe UI, sans-serif" font-size="12" fill="#475569">600×580×720 mm · slab · white · headless plan render (no designer GLB)</text>
  <line x1="40" y1="${H * 0.82}" x2="${W - 40}" y2="${H * 0.82}" stroke="#cbd5e1" stroke-width="1"/>
  ${polygons.join("\n  ")}
  <text x="24" y="${H - 20}" font-family="Segoe UI, sans-serif" font-size="11" fill="#64748b">TOE_HEIGHT_MM=100 · TOE_INSET_MM=50 · DOOR_THICKNESS_MM=18 · height integrity: span = SKU H</text>
</svg>`;
}

export { TOE_HEIGHT_MM, TOE_INSET_MM, DOOR_THICKNESS_MM, options, outDir };

async function main() {
  mkdirSync(outDir, { recursive: true });
  const parts = buildParts();
  const names = parts.map((p) => p.name);
  if (JSON.stringify(names) !== JSON.stringify(["toe", "carcass", "door-slab"])) {
    throw new Error(`unexpected part order: ${names.join(",")}`);
  }

  const views = [
    ["01-cabinet-v0-three-quarter.png", "three-quarter"],
    ["02-cabinet-v0-side.png", "side"],
  ];

  for (const [file, view] of views) {
    const svg = renderSvg(parts, /** @type {"three-quarter"|"side"} */ (view));
    const pngPath = join(outDir, file);
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log("wrote", pngPath);
  }

  const meta = {
    options,
    partNames: names,
    constants: { TOE_HEIGHT_MM, TOE_INSET_MM, DOOR_THICKNESS_MM },
    outDir,
    source: "scripts/p08-cabinet-v0-visual-smoke.mjs (plan formulas; no designer GLB)",
  };
  writeFileSync(join(outDir, "visual-smoke-meta.json"), JSON.stringify(meta, null, 2));
  console.log("parts", names.join(" → "));
}

function isMainModule() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
