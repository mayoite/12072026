/**
 * Seed site/block-descriptors/ from public/svg-catalog fixtures.
 * Run: pnpm --filter oando-site run seed:block-descriptors
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { resolveBlockDescriptorsDir } from "../lib/paths/sitePackageRoot";
import {
  clearLoaderCache,
  loadAll,
} from "../features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import { freezeFreshDescriptor } from "../features/planner/open3d/catalog/svg/svgTypes";

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
};

const SEEDS: SeedInput[] = [
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
    generatedAt: 1_751_631_000,
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
    generatedAt: 1_751_631_001,
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
    generatedAt: 1_751_631_002,
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
    generatedAt: 1_751_631_004,
  },
  {
    id: "f81e3a1b-16f4-4000-8000-000000000004",
    slug: "missing-geom-fallback-001",
    sku: "OFL-FBK-001",
    geometry: { widthMm: 200, depthMm: 200, heightMm: 200 },
    viewBox: { x: 0, y: 0, width: 200, height: 200 },
    blocks: [],
    generatedAt: 1_751_631_003,
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
  if (!frozen.ok) {
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
    console.log(`wrote ${outPath}`);
  }

  clearLoaderCache();
  const loaded = loadAll({ forceReload: true });
  console.log(`verified loadAll: ${loaded.length} descriptor(s)`);
  if (loaded.length !== SEEDS.length) {
    process.exitCode = 1;
  }
}

main();