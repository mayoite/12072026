// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { freezeFreshDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { resolveBlockDescriptorsDir } from "@/lib/paths/sitePackageRoot";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed-block-descriptors.ts");

const SAMPLE_SLUGS = [
  "oando-fluid-desk-1600",
  "oando-classy-meeting-1800",
  "oando-mellow-sofa-2200",
  "oando-phoenix-l-desk-1600",
  "missing-geom-fallback-001",
] as const;

describe("seed-block-descriptors (name-mirror)", () => {
  it("seeds known brand hero slugs into block descriptors dir", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    for (const slug of SAMPLE_SLUGS) {
      expect(src).toContain(slug);
    }
    expect(src).toContain("resolveBlockDescriptorsDir");
    expect(src).toContain("freezeFreshDescriptor");
    expect(src).toContain("loadAll");
    expect(src).toContain("clearLoaderCache");
    expect(src).toContain("linear-desk");
    expect(src).toContain("pedestal");
  });

  it("freezes a seed-shaped brand descriptor with schema-legal themeTokens", () => {
    const generatedAt = 1_752_000_002;
    const frozen = freezeFreshDescriptor(
      {
        schemaVersion: "2026-07-04.v2",
        id: "a81e3a1b-16f4-4000-8000-000000000002",
        slug: "oando-fluid-desk-1600",
        sku: "OANDO-FLUID-DSK-1600",
        sourceProvenance: "native",
        createdBy: "seed-block-descriptors-brand-heroes",
        geometry: { widthMm: 1600, depthMm: 800, heightMm: 750 },
        viewBox: { x: 0, y: 0, width: 1600, height: 800 },
        mounting: ["floor"],
        themeTokens: {
          currentColor: "currentColor",
          "--fill-primary": "var(--color-surface-raised)",
          "--stroke-accent": "var(--color-border)",
        },
        rovingFocus: [
          { key: "top", focusSelector: "#desk-top", label: "Worksurface" },
        ],
        liveAnnouncementCategories: ["status"],
        variant: "fixed",
        fixed: { sizingType: "fixed" },
        checksum: "0".repeat(64),
        generatedAt,
        maker: {
          recipe: "linear-desk",
          widthMm: 1600,
          depthMm: 800,
          topThicknessMm: 80,
        },
      },
      () => generatedAt,
    );
    expect(frozen.ok).toBe(true);
    if (frozen.ok) {
      expect(frozen.value.slug).toBe("oando-fluid-desk-1600");
      expect(frozen.value.geometry.widthMm).toBe(1600);
      expect(frozen.value.checksum).not.toBe("0".repeat(64));
      expect(frozen.value.themeTokens).toMatchObject({
        currentColor: "currentColor",
        "--fill-primary": "var(--color-surface-raised)",
      });
    }

    const dir = resolveBlockDescriptorsDir();
    expect(path.normalize(dir)).toContain(path.normalize(siteRoot));
  });
});
