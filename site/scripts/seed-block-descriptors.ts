/**
 * Seed site/inventory/descriptors/ with buyer-facing office plan symbols.
 * Run: pnpm --filter oando-site run seed:block-descriptors
 * Then: pnpm --filter oando-site run sync:descriptor-svgs
 *
 * Disk is live publish authority (Admin track). missing-geom is internal only.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { resolveBlockDescriptorsDir } from "../lib/paths/sitePackageRoot";
import {
  clearLoaderCache,
  loadAll,
} from "../features/planner/catalog/svg/svgBlockDescriptorLoader";
import { freezeFreshDescriptor } from "../features/planner/catalog/svg/svgTypes";

type SeedInput = {
  readonly id: string;
  readonly slug: string;
  readonly sku: string;
  readonly geometry: { widthMm: number; depthMm: number; heightMm: number };
  readonly viewBox: { x: number; y: number; width: number; height: number };
  readonly blocks?: ReadonlyArray<{
    id: string;
    x: number;
    y: number;
    width: number;
    depth: number;
  }>;
  readonly maker?: {
    recipe: "linear-desk" | "l-desk";
    widthMm: number;
    depthMm: number;
    topThicknessMm?: number;
    returnWidthMm?: number;
  };
  readonly rovingFocus?: ReadonlyArray<{
    key: string;
    focusSelector: string;
    label: string;
  }>;
  readonly generatedAt: number;
  /** When true, not buyer-facing (internal proof / geom fallback). */
  readonly internal?: boolean;
};

const T = 1_751_631_000;

const SEEDS: SeedInput[] = [
  // ── Existing core (kept stable) ──
  {
    id: "f81e3a1b-16f4-4000-8000-000000000001",
    slug: "chaise-lounge-001",
    sku: "OFL-CHS-001",
    geometry: { widthMm: 800, depthMm: 1600, heightMm: 420 },
    viewBox: { x: 0, y: 0, width: 800, height: 1600 },
    blocks: [
      { id: "seat-block", x: 0, y: 400, width: 800, depth: 1200 },
      { id: "backrest-block", x: 0, y: 0, width: 800, depth: 420 },
    ],
    rovingFocus: [
      { key: "focus-chaise-seat", focusSelector: "#seat-block", label: "Seat area" },
      { key: "focus-chaise-backrest", focusSelector: "#backrest-block", label: "Backrest" },
    ],
    generatedAt: T,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000002",
    slug: "sectional-sofa-001",
    sku: "OFL-SEC-001",
    geometry: { widthMm: 2800, depthMm: 1800, heightMm: 850 },
    viewBox: { x: 0, y: 0, width: 2800, height: 1800 },
    blocks: [
      { id: "section-a", x: 0, y: 0, width: 1600, depth: 900 },
      { id: "section-b", x: 400, y: 500, width: 2400, depth: 1300 },
    ],
    rovingFocus: [
      { key: "focus-sectional-a", focusSelector: "#section-a", label: "Section A" },
      { key: "focus-sectional-b", focusSelector: "#section-b", label: "Section B" },
    ],
    generatedAt: T + 1,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000003",
    slug: "side-table-001",
    sku: "OFL-TBL-001",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 550 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    blocks: [
      { id: "tabletop", x: 0, y: 0, width: 600, depth: 600 },
      { id: "leg-cutout-nw", x: 25, y: 25, width: 50, depth: 50 },
      { id: "leg-cutout-ne", x: 525, y: 25, width: 50, depth: 50 },
      { id: "leg-cutout-sw", x: 25, y: 525, width: 50, depth: 50 },
      { id: "leg-cutout-se", x: 525, y: 525, width: 50, depth: 50 },
    ],
    rovingFocus: [
      { key: "focus-table-top", focusSelector: "#tabletop", label: "Tabletop" },
    ],
    generatedAt: T + 2,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000005",
    slug: "desk-linear-1200-001",
    sku: "OFL-DSK-LIN-1200",
    geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 1200, height: 600 },
    maker: {
      recipe: "linear-desk",
      widthMm: 1200,
      depthMm: 600,
      topThicknessMm: 80,
    },
    rovingFocus: [
      { key: "focus-desk-top", focusSelector: "#desk-top", label: "Worksurface" },
    ],
    generatedAt: T + 4,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000004",
    slug: "missing-geom-fallback-001",
    sku: "OFL-FBK-001",
    geometry: { widthMm: 200, depthMm: 200, heightMm: 200 },
    viewBox: { x: 0, y: 0, width: 200, height: 200 },
    blocks: [{ id: "fallback-body", x: 20, y: 20, width: 160, depth: 160 }],
    generatedAt: T + 3,
    internal: true,
  },

  // ── Linear desks (maker) ──
  {
    id: "f81e3a1b-16f4-4000-8000-000000000010",
    slug: "desk-linear-1400-001",
    sku: "OFL-DSK-LIN-1400",
    geometry: { widthMm: 1400, depthMm: 700, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 1400, height: 700 },
    maker: { recipe: "linear-desk", widthMm: 1400, depthMm: 700, topThicknessMm: 80 },
    rovingFocus: [
      { key: "focus-desk-top", focusSelector: "#desk-top", label: "Worksurface" },
    ],
    generatedAt: T + 10,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000011",
    slug: "desk-linear-1600-001",
    sku: "OFL-DSK-LIN-1600",
    geometry: { widthMm: 1600, depthMm: 800, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 1600, height: 800 },
    maker: { recipe: "linear-desk", widthMm: 1600, depthMm: 800, topThicknessMm: 80 },
    rovingFocus: [
      { key: "focus-desk-top", focusSelector: "#desk-top", label: "Worksurface" },
    ],
    generatedAt: T + 11,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000012",
    slug: "desk-linear-1800-001",
    sku: "OFL-DSK-LIN-1800",
    geometry: { widthMm: 1800, depthMm: 800, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 1800, height: 800 },
    maker: { recipe: "linear-desk", widthMm: 1800, depthMm: 800, topThicknessMm: 80 },
    rovingFocus: [
      { key: "focus-desk-top", focusSelector: "#desk-top", label: "Worksurface" },
    ],
    generatedAt: T + 12,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000013",
    slug: "desk-l-1600-001",
    sku: "OFL-DSK-L-1600",
    geometry: { widthMm: 1600, depthMm: 1600, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 1600, height: 1600 },
    maker: {
      recipe: "l-desk",
      widthMm: 1600,
      depthMm: 800,
      returnWidthMm: 600,
    },
    rovingFocus: [
      { key: "focus-desk-main", focusSelector: "#main", label: "Main run" },
    ],
    generatedAt: T + 13,
  },

  // ── Meeting tables ──
  {
    id: "f81e3a1b-16f4-4000-8000-000000000020",
    slug: "meeting-table-1800-001",
    sku: "OFL-MTG-1800",
    geometry: { widthMm: 1800, depthMm: 900, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 1800, height: 900 },
    blocks: [
      { id: "tabletop", x: 0, y: 0, width: 1800, depth: 900 },
      { id: "leg-nw", x: 80, y: 80, width: 60, depth: 60 },
      { id: "leg-ne", x: 1660, y: 80, width: 60, depth: 60 },
      { id: "leg-sw", x: 80, y: 760, width: 60, depth: 60 },
      { id: "leg-se", x: 1660, y: 760, width: 60, depth: 60 },
    ],
    rovingFocus: [
      { key: "focus-tabletop", focusSelector: "#tabletop", label: "Tabletop" },
    ],
    generatedAt: T + 20,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000021",
    slug: "meeting-table-2400-001",
    sku: "OFL-MTG-2400",
    geometry: { widthMm: 2400, depthMm: 1200, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 2400, height: 1200 },
    blocks: [
      { id: "tabletop", x: 0, y: 0, width: 2400, depth: 1200 },
      { id: "leg-nw", x: 100, y: 100, width: 70, depth: 70 },
      { id: "leg-ne", x: 2230, y: 100, width: 70, depth: 70 },
      { id: "leg-sw", x: 100, y: 1030, width: 70, depth: 70 },
      { id: "leg-se", x: 2230, y: 1030, width: 70, depth: 70 },
    ],
    rovingFocus: [
      { key: "focus-tabletop", focusSelector: "#tabletop", label: "Tabletop" },
    ],
    generatedAt: T + 21,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000022",
    slug: "meeting-table-3000-001",
    sku: "OFL-MTG-3000",
    geometry: { widthMm: 3000, depthMm: 1200, heightMm: 750 },
    viewBox: { x: 0, y: 0, width: 3000, height: 1200 },
    blocks: [
      { id: "tabletop", x: 0, y: 0, width: 3000, depth: 1200 },
      { id: "leg-nw", x: 120, y: 120, width: 80, depth: 80 },
      { id: "leg-ne", x: 2800, y: 120, width: 80, depth: 80 },
      { id: "leg-sw", x: 120, y: 1000, width: 80, depth: 80 },
      { id: "leg-se", x: 2800, y: 1000, width: 80, depth: 80 },
    ],
    generatedAt: T + 22,
  },

  // ── Seating ──
  {
    id: "f81e3a1b-16f4-4000-8000-000000000030",
    slug: "task-chair-650-001",
    sku: "OFL-CHR-TSK-650",
    geometry: { widthMm: 650, depthMm: 650, heightMm: 1100 },
    viewBox: { x: 0, y: 0, width: 650, height: 650 },
    blocks: [
      { id: "seat", x: 100, y: 140, width: 450, depth: 380 },
      { id: "backrest", x: 120, y: 40, width: 410, depth: 120 },
      { id: "base", x: 200, y: 500, width: 250, depth: 100 },
    ],
    rovingFocus: [
      { key: "focus-seat", focusSelector: "#seat", label: "Seat" },
    ],
    generatedAt: T + 30,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000031",
    slug: "guest-chair-600-001",
    sku: "OFL-CHR-GST-600",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 900 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    blocks: [
      { id: "seat", x: 80, y: 160, width: 440, depth: 320 },
      { id: "backrest", x: 100, y: 40, width: 400, depth: 140 },
      { id: "legs", x: 120, y: 460, width: 360, depth: 80 },
    ],
    generatedAt: T + 31,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000032",
    slug: "lounge-sofa-2200-001",
    sku: "OFL-SOF-2200",
    geometry: { widthMm: 2200, depthMm: 900, heightMm: 850 },
    viewBox: { x: 0, y: 0, width: 2200, height: 900 },
    blocks: [
      { id: "seat", x: 80, y: 160, width: 2040, depth: 620 },
      { id: "backrest", x: 80, y: 40, width: 2040, depth: 140 },
      { id: "arm-left", x: 40, y: 160, width: 80, depth: 620 },
      { id: "arm-right", x: 2080, y: 160, width: 80, depth: 620 },
    ],
    generatedAt: T + 32,
  },

  // ── Storage ──
  {
    id: "f81e3a1b-16f4-4000-8000-000000000040",
    slug: "pedestal-storage-400-001",
    sku: "OFL-PED-400",
    geometry: { widthMm: 400, depthMm: 560, heightMm: 720 },
    viewBox: { x: 0, y: 0, width: 400, height: 560 },
    blocks: [
      { id: "body", x: 0, y: 0, width: 400, depth: 560 },
      { id: "drawer-1", x: 20, y: 40, width: 360, depth: 140 },
      { id: "drawer-2", x: 20, y: 200, width: 360, depth: 140 },
      { id: "drawer-3", x: 20, y: 360, width: 360, depth: 140 },
    ],
    generatedAt: T + 40,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000041",
    slug: "low-cabinet-800-001",
    sku: "OFL-CAB-800",
    geometry: { widthMm: 800, depthMm: 450, heightMm: 900 },
    viewBox: { x: 0, y: 0, width: 800, height: 450 },
    blocks: [
      { id: "body", x: 0, y: 0, width: 800, depth: 450 },
      { id: "door-left", x: 20, y: 20, width: 360, depth: 410 },
      { id: "door-right", x: 420, y: 20, width: 360, depth: 410 },
    ],
    generatedAt: T + 41,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000042",
    slug: "tall-cabinet-900-001",
    sku: "OFL-CAB-TALL-900",
    geometry: { widthMm: 900, depthMm: 450, heightMm: 2100 },
    viewBox: { x: 0, y: 0, width: 900, height: 450 },
    blocks: [
      { id: "body", x: 0, y: 0, width: 900, depth: 450 },
      { id: "door-left", x: 20, y: 20, width: 410, depth: 410 },
      { id: "door-right", x: 470, y: 20, width: 410, depth: 410 },
    ],
    generatedAt: T + 42,
  },

  // ── Soft seating / collab ──
  {
    id: "f81e3a1b-16f4-4000-8000-000000000050",
    slug: "collab-ottoman-600-001",
    sku: "OFL-OTT-600",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 450 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    blocks: [{ id: "seat", x: 40, y: 40, width: 520, depth: 520 }],
    generatedAt: T + 50,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000051",
    slug: "bench-seat-1500-001",
    sku: "OFL-BNCH-1500",
    geometry: { widthMm: 1500, depthMm: 500, heightMm: 450 },
    viewBox: { x: 0, y: 0, width: 1500, height: 500 },
    blocks: [
      { id: "seat", x: 40, y: 60, width: 1420, depth: 380 },
      { id: "leg-left", x: 60, y: 420, width: 80, depth: 60 },
      { id: "leg-right", x: 1360, y: 420, width: 80, depth: 60 },
    ],
    generatedAt: T + 51,
  },
];

function buildDescriptor(seed: SeedInput) {
  const base = {
    schemaVersion: "2026-07-04.v2" as const,
    id: seed.id,
    slug: seed.slug,
    sku: seed.sku,
    sourceProvenance: "native" as const,
    createdBy: "seed-block-descriptors",
    geometry: seed.geometry,
    viewBox: seed.viewBox,
    mounting: ["floor"] as const,
    themeTokens: {
      currentColor: "currentColor",
      "--fill-primary": "var(--color-surface-raised)",
    },
    rovingFocus: seed.rovingFocus ?? [],
    liveAnnouncementCategories: ["status"] as const,
    variant: "fixed" as const,
    fixed: { sizingType: "fixed" as const },
    checksum: "0".repeat(64),
    generatedAt: seed.generatedAt,
    ...(seed.blocks && seed.blocks.length > 0 ? { blocks: seed.blocks } : {}),
    ...(seed.maker ? { maker: seed.maker } : {}),
  };

  const frozen = freezeFreshDescriptor(base, () => seed.generatedAt);
  if (frozen.ok === false) {
    throw new Error(
      `Failed to freeze ${seed.slug}: ${frozen.error.message}`,
    );
  }
  return frozen.value;
}

function main(): void {
  const dir = resolveBlockDescriptorsDir();
  mkdirSync(dir, { recursive: true });

  for (const seed of SEEDS) {
    const descriptor = buildDescriptor(seed);
    const outPath = path.join(dir, `${descriptor.slug}.json`);
    writeFileSync(outPath, `${JSON.stringify(descriptor, null, 2)}\n`, "utf8");
    console.log(`wrote ${outPath}${seed.internal ? " (internal)" : ""}`);
  }

  clearLoaderCache();
  const loaded = loadAll({ forceReload: true });
  const loadedSlugs = new Set(loaded.map((d) => d.slug));
  const missing = SEEDS.filter((s) => !loadedSlugs.has(s.slug));
  console.log(`verified loadAll: ${loaded.length} descriptor(s); seeds=${SEEDS.length}`);
  if (missing.length > 0) {
    console.error("missing from loadAll:", missing.map((s) => s.slug).join(", "));
    process.exitCode = 1;
  }
}

main();
