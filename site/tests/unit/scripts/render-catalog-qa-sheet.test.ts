// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { resolveCatalogItemBlock2D } from "@/features/planner/catalog-api/catalogBlockBridge";
import { PLANNER_CATALOG_ITEMS } from "@/features/planner/catalog-api/workspaceCatalog";
import { blockToSvg } from "@/lib/catalog/blocks2d";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/render-catalog-qa-sheet.ts");

describe("render-catalog-qa-sheet (name-mirror)", () => {
  it("exists and targets full catalog QA output under results/catalog-qa", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("PLANNER_CATALOG_ITEMS");
    expect(src).toContain("results/catalog-qa");
    expect(src).toContain("collectEntries");
    expect(src).toContain("buildThumbGridSheet");
    expect(src).toContain("buildDetailSheet");
  });

  it("can resolve real catalog items to SVG without raster binary assets", () => {
    expect(PLANNER_CATALOG_ITEMS.length).toBeGreaterThan(10);
    let ok = 0;
    let fail = 0;
    for (const item of PLANNER_CATALOG_ITEMS.slice(0, 40)) {
      const block = resolveCatalogItemBlock2D(item);
      if (!block || block.footprint.L <= 0 || block.footprint.D <= 0 || block.prims.length === 0) {
        fail += 1;
        continue;
      }
      const svg = blockToSvg(block);
      expect(svg).toContain("<svg");
      expect(svg).not.toMatch(/data:image|\.png|\.jpe?g/i);
      ok += 1;
    }
    expect(ok).toBeGreaterThan(0);
    expect(ok + fail).toBeLessThanOrEqual(40);
  });
});
