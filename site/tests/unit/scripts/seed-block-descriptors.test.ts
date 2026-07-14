// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { freezeFreshDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import { resolveBlockDescriptorsDir } from "@/lib/paths/sitePackageRoot";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed-block-descriptors.ts");

const SAMPLE_SLUGS = [
  "chaise-lounge-001",
  "sectional-sofa-001",
  "side-table-001",
  "desk-linear-1200-001",
  "missing-geom-fallback-001",
] as const;

describe("seed-block-descriptors (name-mirror)", () => {
  it("seeds known fixture slugs into block descriptors dir", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    for (const slug of SAMPLE_SLUGS) {
      expect(src).toContain(slug);
    }
    expect(src).toContain("resolveBlockDescriptorsDir");
    expect(src).toContain("freezeFreshDescriptor");
    expect(src).toContain("loadAll");
    expect(src).toContain("clearLoaderCache");
  });

  it("freezes a seed-shaped descriptor with positive geometry", () => {
    const generatedAt = 1_751_631_000;
    const frozen = freezeFreshDescriptor(
      {
        schemaVersion: "2026-07-04.v2",
        id: "f81e3a1b-16f4-4000-8000-000000000001",
        slug: "chaise-lounge-001",
        sku: "OFL-CHS-001",
        sourceProvenance: "native",
        createdBy: "seed-block-descriptors",
        geometry: { widthMm: 800, depthMm: 1600, heightMm: 420 },
        viewBox: { x: 0, y: 0, width: 800, height: 1600 },
        mounting: ["floor"],
        themeTokens: {
          currentColor: "currentColor",
          "--fill-primary": "var(--color-surface-raised)",
        },
        rovingFocus: [
          { key: "focus-chaise-seat", focusSelector: "#seat-block", label: "Seat area" },
        ],
        liveAnnouncementCategories: ["status"],
        variant: "fixed",
        fixed: { sizingType: "fixed" },
        checksum: "0".repeat(64),
        generatedAt,
        blocks: [
          { id: "seat-block", x: 0, y: 400, width: 800, depth: 1200 },
          { id: "backrest-block", x: 0, y: 0, width: 800, depth: 420 },
        ],
      },
      () => generatedAt,
    );
    expect(frozen.ok).toBe(true);
    if (frozen.ok) {
      expect(frozen.value.slug).toBe("chaise-lounge-001");
      expect(frozen.value.geometry.widthMm).toBe(800);
      expect(frozen.value.checksum).not.toBe("0".repeat(64));
    }

    const dir = resolveBlockDescriptorsDir();
    expect(path.normalize(dir)).toContain(path.normalize(siteRoot));
  });
});
