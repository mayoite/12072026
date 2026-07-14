/**
 * Material + shared-geometry library for the planner 3D viewer.
 *
 * WebGL cannot read CSS custom properties, so the FOCSS design tokens used
 * here are mirrored as hex values with their source token names attached.
 * Source of truth: `app/css/core/theme.css`.
 *
 * All materials are cached and all geometries are unit-sized singletons that
 * meshes scale, so a 100+ item scene shares a handful of GPU resources and
 * the render loop performs zero allocations.
 */

import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import type { CatalogCategory } from "@/features/planner/catalog-api/catalogTypes";

// ---------------------------------------------------------------------------
// FOCSS token mirrors
// ---------------------------------------------------------------------------

export const FOCSS_3D_COLORS = {
  /** `--color-ecru-100` — light warm floor screed */
  ecru100: "#FBF9F4",
  /** `--color-ecru-200` — bench/worktop laminate */
  ecru200: "#ECE5D3",
  /** `--color-ecru-300` — desk laminate */
  ecru300: "#DED2B6",
  /** `--color-ecru-400` — meeting table veneer */
  ecru400: "#CBB78F",
  /** `--color-ecru-600` — door timber */
  ecru600: "#9C8560",
  /** `--color-white-150` — sky bounce light */
  white150: "#FAFBFC",
  /** `--color-white-300` — wall plaster */
  white300: "#DDE5ED",
  /** `--color-white-400` — privacy screen aluminium */
  white400: "#C6D3E0",
  /** `--color-support-fog` — meeting room carpet */
  supportFog: "#E2E8F0",
  /** `--color-ocean-boat-blue-300` — window glass */
  oceanBoatBlue300: "#9BBBDA",
  /** `--color-ocean-boat-blue-600` — room slab fallback */
  oceanBoatBlue600: "#406F99",
  /** `--color-dark-midnight-blue-350` — chair fabric */
  darkMidnightBlue350: "#3F628C",
  /** `--color-dark-midnight-blue-600` — equipment housing */
  darkMidnightBlue600: "#182A40",
  /** `--color-dark-midnight-blue-700` — ground bounce light */
  darkMidnightBlue700: "#111E2D",
  /** `--color-dark-midnight-blue-800` — side walls / ground hemispheres */
  darkMidnightBlue800: "#1C3D59",
  /** `--color-dark-midnight-blue-950` — canvas backdrop */
  darkMidnightBlue950: "#0A1A29",
  /** `--color-ocean-boat-blue-100` — sky hemisphere */
  oceanBoatBlue100: "#EDF4FA",
  /** `--color-white-350` — cool fill light */
  white350: "#D2DCE7",
  /** `--color-bronze-500` — grid section lines */
  bronze500: "#7F6A52",
  /** `--color-bronze-700` — storage carcass metal */
  bronze700: "#586167",
  /** `--color-bronze-800` — desk/leg frame metal, grid cells */
  bronze800: "#42494e",
  /** `--color-bronze-900` — chair base metal */
  bronze900: "#2c3134",
} as const;

const COLOR_TOKEN_HEX: Record<string, string> = {
  "--color-ecru-100": FOCSS_3D_COLORS.ecru100,
  "--color-ecru-200": FOCSS_3D_COLORS.ecru200,
  "--color-ecru-300": FOCSS_3D_COLORS.ecru300,
  "--color-ecru-400": FOCSS_3D_COLORS.ecru400,
  "--color-ecru-500": "#B7A079",
  "--color-ecru-600": FOCSS_3D_COLORS.ecru600,
  "--color-ecru-700": "#7E6B4E",
  "--color-ecru-800": "#5C4F3B",
  "--color-ecru-900": "#3D3528",
  "--color-white-50": "#FFFFFF",
  "--color-white-100": "#FAFBFC",
  "--color-white-150": FOCSS_3D_COLORS.white150,
  "--color-white-200": "#EEF2F6",
  "--color-white-300": FOCSS_3D_COLORS.white300,
  "--color-white-350": FOCSS_3D_COLORS.white350,
  "--color-white-400": FOCSS_3D_COLORS.white400,
  "--color-white-450": "#B9C8D8",
  "--color-white-500": "#ACBDD1",
  "--color-ocean-boat-blue-100": FOCSS_3D_COLORS.oceanBoatBlue100,
  "--color-ocean-boat-blue-300": FOCSS_3D_COLORS.oceanBoatBlue300,
  "--color-ocean-boat-blue-500": "#5488B6",
  "--color-ocean-boat-blue-600": FOCSS_3D_COLORS.oceanBoatBlue600,
  "--color-ocean-boat-blue-700": "#2D577B",
  "--color-ocean-boat-blue-800": FOCSS_3D_COLORS.darkMidnightBlue800,
  "--color-ocean-boat-blue-900": "#0F2538",
  "--color-ocean-boat-blue-950": FOCSS_3D_COLORS.darkMidnightBlue950,
  "--color-dark-midnight-blue-300": "#4B719F",
  "--color-dark-midnight-blue-350": FOCSS_3D_COLORS.darkMidnightBlue350,
  "--color-dark-midnight-blue-400": "#335479",
  "--color-dark-midnight-blue-450": "#294566",
  "--color-dark-midnight-blue-500": "#1F3653",
  "--color-dark-midnight-blue-550": "#1B3049",
  "--color-dark-midnight-blue-600": FOCSS_3D_COLORS.darkMidnightBlue600,
  "--color-dark-midnight-blue-650": "#142436",
  "--color-dark-midnight-blue-700": FOCSS_3D_COLORS.darkMidnightBlue700,
  "--color-dark-midnight-blue-750": "#0E1925",
  "--color-dark-midnight-blue-800": "#0B141D",
  "--color-dark-midnight-blue-850": "#091117",
  "--color-dark-midnight-blue-900": "#070D12",
  "--color-dark-midnight-blue-950": FOCSS_3D_COLORS.darkMidnightBlue950,
  "--color-bronze-300": "#BEAF9A",
  "--color-bronze-400": "#9D876C",
  "--color-bronze-500": FOCSS_3D_COLORS.bronze500,
  "--color-bronze-600": "#66533F",
  "--color-bronze-700": FOCSS_3D_COLORS.bronze700,
  "--color-bronze-800": FOCSS_3D_COLORS.bronze800,
  "--color-bronze-900": FOCSS_3D_COLORS.bronze900,
  "--text-strong": "#0B1324",
  "--text-heading": "#050B17",
  "--text-heading-soft": "#3B4756",
  "--text-body": "#1B2940",
  "--text-muted": "#3F5168",
  "--text-subtle": "#56697E",
  "--text-inverse": "#F8FAFC",
  "--text-inverse-body": "#E2E8F0",
  "--text-inverse-muted": "#CBD5E1",
  "--text-inverse-subtle": "#94A3B8",
  "--shadow-tint-pdp-22": "#111E2D38",
};

function resolveMaterialColor(color: string): string {
  const trimmed = color.trim();
  if (!trimmed.toLowerCase().startsWith("var(") || !trimmed.endsWith(")")) return trimmed;

  const inner = trimmed.slice(4, -1);
  const commaIndex = inner.indexOf(",");
  const token = (commaIndex === -1 ? inner : inner.slice(0, commaIndex)).trim();
  return COLOR_TOKEN_HEX[token] ?? trimmed;
}

// ---------------------------------------------------------------------------
// Finishes
// ---------------------------------------------------------------------------

export interface MaterialFinish {
  color: string;
  roughness: number;
  metalness: number;
  /** Values < 1 produce a transparent, non-depth-writing material. */
  opacity?: number;
}

export type FurnitureKind =
  | "desk"
  | "bench"
  | "chair"
  | "meeting"
  | "storage"
  | "screen"
  | "equipment"
  | "generic";

export interface FurnitureFinishPair {
  /** Dominant surface — desk top, chair fabric, cabinet carcass. */
  primary: MaterialFinish;
  /** Frame/legs/base accent. */
  secondary: MaterialFinish;
}

export const FURNITURE_FINISHES: Record<FurnitureKind, FurnitureFinishPair> = {
  desk: {
    primary: { color: FOCSS_3D_COLORS.ecru300, roughness: 0.45, metalness: 0.05 },
    secondary: { color: FOCSS_3D_COLORS.bronze800, roughness: 0.35, metalness: 0.65 },
  },
  bench: {
    primary: { color: FOCSS_3D_COLORS.ecru200, roughness: 0.48, metalness: 0.04 },
    secondary: { color: FOCSS_3D_COLORS.white400, roughness: 0.6, metalness: 0.2 },
  },
  chair: {
    primary: { color: FOCSS_3D_COLORS.darkMidnightBlue350, roughness: 0.9, metalness: 0 },
    secondary: { color: FOCSS_3D_COLORS.bronze900, roughness: 0.4, metalness: 0.6 },
  },
  meeting: {
    primary: { color: FOCSS_3D_COLORS.ecru400, roughness: 0.4, metalness: 0.05 },
    secondary: { color: FOCSS_3D_COLORS.darkMidnightBlue350, roughness: 0.88, metalness: 0 },
  },
  storage: {
    primary: { color: FOCSS_3D_COLORS.bronze700, roughness: 0.45, metalness: 0.35 },
    secondary: { color: FOCSS_3D_COLORS.bronze900, roughness: 0.4, metalness: 0.5 },
  },
  screen: {
    primary: { color: FOCSS_3D_COLORS.white400, roughness: 0.62, metalness: 0.15 },
    secondary: { color: FOCSS_3D_COLORS.bronze800, roughness: 0.35, metalness: 0.6 },
  },
  equipment: {
    primary: { color: FOCSS_3D_COLORS.darkMidnightBlue600, roughness: 0.5, metalness: 0.25 },
    secondary: { color: FOCSS_3D_COLORS.bronze800, roughness: 0.35, metalness: 0.6 },
  },
  generic: {
    primary: { color: FOCSS_3D_COLORS.ecru300, roughness: 0.5, metalness: 0.05 },
    secondary: { color: FOCSS_3D_COLORS.bronze800, roughness: 0.35, metalness: 0.6 },
  },
};

export const FIXTURE_FINISHES = {
  wall: { color: FOCSS_3D_COLORS.white300, roughness: 0.9, metalness: 0 },
  door: { color: FOCSS_3D_COLORS.ecru600, roughness: 0.55, metalness: 0.05 },
  windowGlass: { color: FOCSS_3D_COLORS.oceanBoatBlue300, roughness: 0.12, metalness: 0.1, opacity: 0.45 },
  windowFrame: { color: FOCSS_3D_COLORS.bronze800, roughness: 0.4, metalness: 0.55 },
  floor: { color: FOCSS_3D_COLORS.ecru100, roughness: 0.92, metalness: 0 },
  meetingCarpet: { color: FOCSS_3D_COLORS.supportFog, roughness: 0.95, metalness: 0 },
} as const satisfies Record<string, MaterialFinish>;

// ---------------------------------------------------------------------------
// Kind resolution
// ---------------------------------------------------------------------------

export function normalizeColor(color: string | undefined | null, fallback: string): string {
  if (!color || color.startsWith("var(")) return fallback;
  return color;
}

/**
 * Maps a furniture item to a visual kind using its catalog category when
 * available, plus label heuristics (catalog item names such as
 * "… 4 seater - SH (1400mm)" or "Workstation — Main screen").
 * `widthM`/`depthM` (metres) act as a geometric fallback: wide + deep items
 * read as double-sided sharing benches.
 */
export function resolveFurnitureKind(
  label: string | undefined,
  category?: CatalogCategory,
  widthM?: number,
  depthM?: number,
): FurnitureKind {
  const text = (label ?? "").toLowerCase();

  if (/meeting|conference|boardroom/.test(text)) return "meeting";
  if (/chair|stool|sofa|bench seat/.test(text)) return "chair";
  if (/pedestal|storage|cabinet|locker|drawer|cupboard|filing|shelf/.test(text)) return "storage";
  if (/screen|divider|partition/.test(text)) return "screen";

  const sharing =
    /\bsh\b/.test(text) || (text.includes("sharing") && !text.includes("non-sharing"));
  if (sharing) return "bench";

  if (category === "storage") return "storage";
  if (category === "equipment") return "equipment";

  if (
    widthM !== undefined &&
    depthM !== undefined &&
    depthM >= 1 &&
    depthM >= widthM * 0.22 &&
    (category === "desks" || /desk|workstation|table|seater/.test(text))
  ) {
    return "bench";
  }

  if (category === "desks" || /desk|workstation|table/.test(text)) return "desk";
  return "generic";
}

export function getFurnitureFinishes(kind: FurnitureKind): FurnitureFinishPair {
  return FURNITURE_FINISHES[kind];
}

// ---------------------------------------------------------------------------
// Shared material cache
// ---------------------------------------------------------------------------

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function finishKey(finish: MaterialFinish): string {
  return `${finish.color}|${finish.roughness}|${finish.metalness}|${finish.opacity ?? 1}`;
}

/** Returns a cached MeshStandardMaterial for the finish (one GPU program/uniform set per finish). */
export function getSharedMaterial(finish: MaterialFinish): THREE.MeshStandardMaterial {
  const key = finishKey(finish);
  let material = materialCache.get(key);
  if (!material) {
    const transparent = finish.opacity !== undefined && finish.opacity < 1;
    material = new THREE.MeshStandardMaterial({
      color: resolveMaterialColor(finish.color),
      roughness: finish.roughness,
      metalness: finish.metalness,
      ...(transparent ? { transparent: true, opacity: finish.opacity, depthWrite: false } : {}),
    });
    materialCache.set(key, material);
  }
  return material;
}

/**
 * Shared material for a finish with an optional user color override
 * (e.g. shape.color from the 2D editor). CSS `var()` strings are rejected
 * in favor of the finish color.
 */
export function getTintedMaterial(
  finish: MaterialFinish,
  colorOverride?: string,
): THREE.MeshStandardMaterial {
  const color = normalizeColor(colorOverride, finish.color);
  if (color === finish.color) return getSharedMaterial(finish);
  return getSharedMaterial({ ...finish, color });
}

// ---------------------------------------------------------------------------
// Shared unit geometries (scaled per mesh — never instantiated per shape)
// ---------------------------------------------------------------------------

export const SHARED_GEOMETRIES = {
  unitBox: new THREE.BoxGeometry(1, 1, 1),
  /** Chamfered box for furniture edge bevels. */
  unitBevelBox: new RoundedBoxGeometry(1, 1, 1, 2, 0.05),
  /** Radius 0.5, height 1 — scale x/z by diameter. */
  unitCylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
  unitPlane: new THREE.PlaneGeometry(1, 1),
} as const;
