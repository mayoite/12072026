// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildBlock2D, blockToSvg } from "@/lib/catalog/blocks2d";
import { buildOandoSeedProducts } from "@/lib/catalog/seed/oandoCatalog";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed-catalog-preview.ts");

const PICKS: Array<[string, Parameters<typeof buildBlock2D>[1]]> = [
  ["oando-ws-linear", { selection: { seaters: 4, length: 1500, depth: 600 } }],
  ["oando-ws-lshape-panel", { selection: { seaters: 2, length: 1500, depth: 600, armLength: 1350 } }],
  ["oando-pedestal", {}],
  ["oando-storage-unit", { sizeSku: "STG-FULL-1800-900" }],
  ["oando-cabin-table", { sizeSku: "CAB-1800-900" }],
  ["oando-meeting-table", { sizeSku: "MEET-2400-1200" }],
  ["oando-discussion-table", { sizeSku: "DISC-1200" }],
];

describe("seed-catalog-preview (name-mirror)", () => {
  it("lists seed product picks and writes catalog-seed-preview sheet", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("buildOandoSeedProducts");
    expect(src).toContain("catalog-seed-preview");
    expect(src).toContain("seed-catalog.svg");
    for (const [id] of PICKS) {
      expect(src).toContain(id);
    }
  });

  it("builds SVG for every seed pick used by the script", () => {
    const all = buildOandoSeedProducts();
    expect(all.length).toBeGreaterThan(0);
    let rendered = 0;
    for (const [id, opts] of PICKS) {
      const product = all.find((p) => p.id === id);
      expect(product, `missing seed product ${id}`).toBeDefined();
      const block = buildBlock2D(product!, opts);
      expect(block, `no block for ${id}`).not.toBeNull();
      const svg = blockToSvg(block!);
      expect(svg).toContain("<svg");
      expect(block!.footprint.L).toBeGreaterThan(0);
      expect(block!.footprint.D).toBeGreaterThan(0);
      rendered += 1;
    }
    expect(rendered).toBe(PICKS.length);
  });
});
