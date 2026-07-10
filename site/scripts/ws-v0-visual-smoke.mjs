/**
 * Workstation-v0 headless visual smoke — render multi-part desk mesh from the
 * pure plan (same formulas as generateWorkstationV0MeshPlan). No browser, no GLB.
 *
 * Usage (from site/):
 *   node scripts/ws-v0-visual-smoke.mjs
 *   node scripts/ws-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/full-workflow-demo-2026-07-10
 *
 * LOCKED CONSTANTS — must match site/features/planner/open3d/catalog/workstationMeshV0.ts
 * (and pedestal/plan layout from workstationSystemV0). Unit suites re-prove plan geometry.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, "..");

const outArgIdx = process.argv.indexOf("--out");
const outDir =
  outArgIdx >= 0 && process.argv[outArgIdx + 1]
    ? resolve(process.argv[outArgIdx + 1])
    : resolve(
        siteRoot,
        "../results/planner/full-workflow-demo-2026-07-10",
      );

/** @typedef {{ name: string; sizeM: {x:number;y:number;z:number}; positionM: {x:number;y:number;z:number}; color?: string }} Part */

// --- Locked constants (must match workstationMeshV0.ts exports) ---
const WORKTOP_THICKNESS_MM = 30;
const LEG_SECTION_MM = 50;
const LEG_INSET_MM = 40;
const STRETCHER_SECTION_MM = 40;
const STRETCHER_HEIGHT_FRAC = 0.28;
const MM = 0.001;

const LEG_COLOR = "#57534e";
const STRETCHER_COLOR = "#78716c";
const ROLE_COLOR = {
  desk: "#c4a574",
  pedestal: "#6b7280",
};

/** Default linear desk + pedestal (matches unit suites). */
const options = {
  shape: "linear",
  lengthMm: 1500,
  depthMm: 600,
  heightMm: 750,
  modules: ["desk", "pedestal"],
};

/**
 * Plan prims for linear desk±pedestal (must match workstationPlanPrims linear path).
 * @returns {{ footprint: {widthMm:number; depthMm:number}; prims: Array<{x:number;y:number;w:number;h:number;role:string}> }}
 */
function planPrimsLinear(lengthMm, depthMm, modules) {
  const prims = [{ x: 0, y: 0, w: lengthMm, h: depthMm, role: "desk" }];
  if (modules.includes("pedestal")) {
    const pw = Math.min(400, lengthMm * 0.35);
    const pd = Math.min(500, depthMm * 0.85);
    prims.push({
      x: 40,
      y: (depthMm - pd) / 2,
      w: pw,
      h: pd,
      role: "pedestal",
    });
  }
  return {
    footprint: { widthMm: lengthMm, depthMm },
    prims,
  };
}

/**
 * Four corner posts under a worktop prim (must match legsForWorktopPrim).
 * @param {{x:number;y:number;w:number;h:number}} prim
 * @param {{widthMm:number; depthMm:number}} footprint
 * @param {number} heightMm
 * @param {"desk"|"return"} runKey
 */
function legsForWorktopPrim(prim, footprint, heightMm, runKey) {
  const section = LEG_SECTION_MM;
  const legH = Math.max(1, heightMm - WORKTOP_THICKNESS_MM);
  const inset = Math.min(
    LEG_INSET_MM,
    Math.max(0, prim.w / 4 - section / 2),
    Math.max(0, prim.h / 4 - section / 2),
  );
  const half = section / 2;
  const corners = [
    { x: prim.x + inset + half, y: prim.y + inset + half },
    { x: prim.x + prim.w - inset - half, y: prim.y + inset + half },
    { x: prim.x + inset + half, y: prim.y + prim.h - inset - half },
    { x: prim.x + prim.w - inset - half, y: prim.y + prim.h - inset - half },
  ];
  return corners.map((c, i) => ({
    name: `leg-${runKey}-${i}`,
    sizeMm: { x: section, y: legH, z: section },
    positionMm: {
      x: c.x - footprint.widthMm / 2,
      y: legH / 2,
      z: c.y - footprint.depthMm / 2,
    },
    color: LEG_COLOR,
  }));
}

/**
 * Front + back rails (must match stretchersForWorktopPrim).
 * @param {{x:number;y:number;w:number;h:number}} prim
 * @param {{widthMm:number; depthMm:number}} footprint
 * @param {number} heightMm
 * @param {"desk"|"return"} runKey
 */
function stretchersForWorktopPrim(prim, footprint, heightMm, runKey) {
  const section = STRETCHER_SECTION_MM;
  const legH = Math.max(1, heightMm - WORKTOP_THICKNESS_MM);
  const inset = Math.min(
    LEG_INSET_MM,
    Math.max(0, prim.w / 4 - LEG_SECTION_MM / 2),
    Math.max(0, prim.h / 4 - LEG_SECTION_MM / 2),
  );
  const railLen = Math.max(1, prim.w - 2 * inset - LEG_SECTION_MM);
  const railY = Math.max(section / 2, legH * STRETCHER_HEIGHT_FRAC);
  const halfSec = section / 2;
  const rails = [
    { suffix: "front", y: prim.y + inset + halfSec },
    { suffix: "back", y: prim.y + prim.h - inset - halfSec },
  ];
  return rails.map((r) => ({
    name: `stretcher-${runKey}-${r.suffix}`,
    sizeMm: { x: railLen, y: section, z: section },
    positionMm: {
      x: prim.x + prim.w / 2 - footprint.widthMm / 2,
      y: railY,
      z: r.y - footprint.depthMm / 2,
    },
    color: STRETCHER_COLOR,
  }));
}

/**
 * Build plan parts in mm then convert to metres for SVG (cabinet smoke units).
 * @returns {Part[]}
 */
function buildParts() {
  const { lengthMm, depthMm, heightMm, modules } = options;
  const { footprint, prims } = planPrimsLinear(lengthMm, depthMm, modules);
  /** @type {Array<{name:string; sizeMm:{x:number;y:number;z:number}; positionMm:{x:number;y:number;z:number}; color:string}>} */
  const mmParts = [];

  for (const prim of prims) {
    if (prim.role === "desk") {
      const sizeY = WORKTOP_THICKNESS_MM;
      mmParts.push({
        name: "desk",
        sizeMm: { x: prim.w, y: sizeY, z: prim.h },
        positionMm: {
          x: prim.x + prim.w / 2 - footprint.widthMm / 2,
          y: heightMm - sizeY / 2,
          z: prim.y + prim.h / 2 - footprint.depthMm / 2,
        },
        color: ROLE_COLOR.desk,
      });
      mmParts.push(
        ...legsForWorktopPrim(prim, footprint, heightMm, "desk"),
      );
      mmParts.push(
        ...stretchersForWorktopPrim(prim, footprint, heightMm, "desk"),
      );
    } else if (prim.role === "pedestal") {
      const sizeY = Math.max(1, heightMm - WORKTOP_THICKNESS_MM - 20);
      mmParts.push({
        name: "pedestal",
        sizeMm: { x: prim.w, y: sizeY, z: prim.h },
        positionMm: {
          x: prim.x + prim.w / 2 - footprint.widthMm / 2,
          y: sizeY / 2,
          z: prim.y + prim.h / 2 - footprint.depthMm / 2,
        },
        color: ROLE_COLOR.pedestal,
      });
    }
  }

  return mmParts.map((p) => ({
    name: p.name,
    sizeM: {
      x: p.sizeMm.x * MM,
      y: p.sizeMm.y * MM,
      z: p.sizeMm.z * MM,
    },
    positionM: {
      x: p.positionMm.x * MM,
      y: p.positionMm.y * MM,
      z: p.positionMm.z * MM,
    },
    color: p.color,
  }));
}

function fillFor(name, color) {
  if (color) return color;
  if (name.startsWith("leg-")) return LEG_COLOR;
  if (name.startsWith("stretcher-")) return STRETCHER_COLOR;
  return "#ccc";
}

function strokeFor(name) {
  if (name.startsWith("leg-")) return "#292524";
  if (name.startsWith("stretcher-")) return "#44403c";
  if (name === "desk") return "#78716c";
  if (name === "pedestal") return "#374151";
  return "#333";
}

/**
 * @param {"three-quarter"|"side"} view
 */
function project(x, y, z, view, W, H, scale) {
  const ox = W / 2;
  const oy = H * 0.82;
  if (view === "side") {
    return { sx: ox + z * scale, sy: oy - y * scale };
  }
  const isoX = (x - z) * Math.cos(Math.PI / 6);
  const isoY = y + (x + z) * Math.sin(Math.PI / 6) * 0.55;
  return { sx: ox + isoX * scale, sy: oy - isoY * scale };
}

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

const FACE_INDICES = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [0, 1, 5, 4],
  [2, 3, 7, 6],
  [0, 2, 6, 4],
  [1, 3, 7, 5],
];

/**
 * @param {Part[]} parts
 * @param {"three-quarter"|"side"} view
 */
function renderSvg(parts, view) {
  const W = 900;
  const H = 640;
  // Desk is larger than cabinet SKU — lower scale to fit.
  const scale = view === "side" ? 280 : 200;

  /** @type {string[]} */
  const polygons = [];

  const sorted = [...parts].sort((a, b) => {
    if (view === "side") return a.positionM.x - b.positionM.x;
    return a.positionM.z - b.positionM.z || a.positionM.y - b.positionM.y;
  });

  for (const part of sorted) {
    const corners = boxCorners(part);
    const projected = corners.map((c) =>
      project(c.x, c.y, c.z, view, W, H, scale),
    );
    const faces = FACE_INDICES.map((idxs) => {
      const pts = idxs.map((i) => projected[i]);
      const world = idxs.map((i) => corners[i]);
      const depth =
        view === "side"
          ? world.reduce((s, p) => s + p.x, 0) / 4
          : world.reduce((s, p) => s + p.z + p.x * 0.3, 0) / 4;
      return { pts, depth };
    }).sort((a, b) => a.depth - b.depth);

    const fill = fillFor(part.name, part.color);
    const stroke = strokeFor(part.name);

    for (const face of faces) {
      const points = face.pts
        .map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`)
        .join(" ");
      polygons.push(
        `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" opacity="0.95"/>`,
      );
    }

    // Label structure parts + modules (legs use shorter labels)
    const label =
      part.name.startsWith("leg-") || part.name.startsWith("stretcher-")
        ? part.name
        : part.name;
    const fontSize =
      part.name.startsWith("leg-") || part.name.startsWith("stretcher-")
        ? 10
        : 13;
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
      `<text x="${c.sx.toFixed(1)}" y="${c.sy.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, sans-serif" font-size="${fontSize}" font-weight="600" fill="#111827">${label}</text>`,
    );
  }

  const title =
    view === "three-quarter"
      ? "workstation-v0 three-quarter (desk + legs + stretchers + pedestal)"
      : "workstation-v0 side (depth / leg height readable)";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="24" y="32" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#0f172a">${title}</text>
  <text x="24" y="54" font-family="Segoe UI, sans-serif" font-size="12" fill="#475569">${options.lengthMm}×${options.depthMm}×${options.heightMm} mm · linear · ${options.modules.join("+")} · headless plan render (no GLB)</text>
  <line x1="40" y1="${H * 0.82}" x2="${W - 40}" y2="${H * 0.82}" stroke="#cbd5e1" stroke-width="1"/>
  ${polygons.join("\n  ")}
  <text x="24" y="${H - 20}" font-family="Segoe UI, sans-serif" font-size="11" fill="#64748b">WORKTOP=${WORKTOP_THICKNESS_MM} · LEG=${LEG_SECTION_MM}/${LEG_INSET_MM} · STRETCHER=${STRETCHER_SECTION_MM}@${STRETCHER_HEIGHT_FRAC} · must match workstationMeshV0.ts</text>
</svg>`;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const parts = buildParts();
  const names = parts.map((p) => p.name);

  const legs = names.filter((n) => n.startsWith("leg-"));
  const stretchers = names.filter((n) => n.startsWith("stretcher-"));
  if (legs.length < 4) {
    throw new Error(`expected ≥4 legs, got ${legs.join(",") || "none"}`);
  }
  if (stretchers.length < 2) {
    throw new Error(
      `expected ≥2 stretchers, got ${stretchers.join(",") || "none"}`,
    );
  }
  if (!names.includes("desk")) {
    throw new Error("expected desk worktop part");
  }

  const views = [
    ["01-workstation-v0-three-quarter.png", "three-quarter"],
    ["02-workstation-v0-side.png", "side"],
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
    legNames: legs,
    stretcherNames: stretchers,
    constants: {
      WORKTOP_THICKNESS_MM,
      LEG_SECTION_MM,
      LEG_INSET_MM,
      STRETCHER_SECTION_MM,
      STRETCHER_HEIGHT_FRAC,
    },
    constantsSource:
      "site/features/planner/open3d/catalog/workstationMeshV0.ts (must match)",
    outDir,
    source:
      "scripts/ws-v0-visual-smoke.mjs (plan formulas; no designer GLB / browser)",
  };
  writeFileSync(
    join(outDir, "visual-smoke-meta.json"),
    JSON.stringify(meta, null, 2),
  );
  console.log("parts", names.join(" → "));
  console.log("legs", legs.join(", "));
  console.log("stretchers", stretchers.join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
