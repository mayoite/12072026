// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { resolveCatalogItemBlock2D } from "@/features/planner/catalog-api/catalogBlockBridge";
import { PLANNER_CATALOG_ITEMS } from "@/features/planner/catalog-api/workspaceCatalog";
import { blockToSvg } from "@/lib/catalog/blocks2d";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/render-three-blocks.ts");

const PICK_IDS = [
  "linear-workstation-partition-system-4-seater-sh-1200mm-6",
  "room-meeting-8",
  "infra-display",
] as const;

describe("render-three-blocks (name-mirror)", () => {
  it("pins three catalog pick ids and writes results/block-previews", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    for (const id of PICK_IDS) {
      expect(src).toContain(id);
    }
    expect(src).toContain("results/block-previews");
    expect(src).toContain("rasterizeSvg");
  });

  it("resolves each pick to a block with positive footprint and SVG", () => {
    for (const id of PICK_IDS) {
      const item = PLANNER_CATALOG_ITEMS.find((i) => i.id === id);
      expect(item, `catalog missing ${id}`).toBeDefined();
      const block = resolveCatalogItemBlock2D(item!);
      expect(block, `no block for ${id}`).not.toBeNull();
      expect(block!.footprint.L).toBeGreaterThan(0);
      expect(block!.footprint.D).toBeGreaterThan(0);
      expect(block!.prims.length).toBeGreaterThan(0);
      const svg = blockToSvg(block!);
      expect(svg).toContain("<svg");
      expect(svg).toMatch(/viewBox="/);
    }
  });
});
