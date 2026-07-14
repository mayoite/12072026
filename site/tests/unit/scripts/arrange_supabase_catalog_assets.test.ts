// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/arrange_supabase_catalog_assets.ts");

function loadPathHelpers() {
  const source = fs.readFileSync(scriptPath, "utf8");
  const buildExpected = source.match(
    /function buildExpectedPath\(sourceDir: string, imagePath: string\): string \{[\s\S]*?\n\}/,
  )?.[0];
  const buildPadded = source.match(
    /function buildPaddedCandidates\(sourceDir: string, imagePath: string\): string\[\] \{[\s\S]*?\n\}/,
  )?.[0];
  if (!buildExpected || !buildPadded) {
    throw new Error("path helpers not found in arrange_supabase_catalog_assets.ts");
  }

  // Strip TypeScript types for vm execution of pure path helpers.
  const stripped = `${buildExpected}\n${buildPadded}`
    .replace(/: string\[\]/g, "")
    .replace(/: string/g, "")
    .replace(/: number/g, "");

  const sandbox: {
    path: typeof path;
    Array: typeof Array;
    Number: typeof Number;
    Set: typeof Set;
    exports?: {
      buildExpectedPath: (sourceDir: string, imagePath: string) => string;
      buildPaddedCandidates: (sourceDir: string, imagePath: string) => string[];
    };
  } = { path, Array, Number, Set };
  vm.runInNewContext(
    `${stripped}; this.exports = { buildExpectedPath, buildPaddedCandidates };`,
    sandbox,
  );
  if (!sandbox.exports) throw new Error("failed to load path helpers");
  return sandbox.exports;
}

describe("arrange_supabase_catalog_assets", () => {
  it("defines alias sources and exact asset fills for catalog path repairs", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("ALIAS_SOURCES");
    expect(source).toContain("EXACT_ASSET_FILLS");
    expect(source).toContain("localCatalogIndex.json");
    expect(source).toContain("fillCatalogGaps");
    expect(source).toContain("oando-soft-seating--brim");
    expect(source).toContain("buildExpectedPath");
    expect(source).toContain("buildPaddedCandidates");
  });

  it("builds expected alias target paths preserving image basenames", () => {
    const { buildExpectedPath } = loadPathHelpers();
    expect(
      buildExpectedPath(
        "/images/catalog/oando-seating--brim",
        "/images/catalog/oando-soft-seating--brim/image-1.webp",
      ),
    ).toBe("/images/catalog/oando-seating--brim/image-1.webp");

    expect(
      buildExpectedPath("/images/catalog/src", "/images/catalog/dst/photo.jpg"),
    ).toBe("/images/catalog/src/photo.jpg");
  });

  it("builds zero-padded image candidate paths across common extensions", () => {
    const { buildPaddedCandidates } = loadPathHelpers();
    const candidates = buildPaddedCandidates(
      "/images/catalog/src",
      "/images/catalog/dst/image-3.jpg",
    );

    expect(candidates).toEqual(
      expect.arrayContaining([
        "/images/catalog/src/image-3.jpg",
        "/images/catalog/src/image-03.jpg",
        "/images/catalog/src/image-3.webp",
        "/images/catalog/src/image-03.webp",
        "/images/catalog/src/image-3.png",
      ]),
    );
    expect(buildPaddedCandidates("/images/x", "/images/y/hero.jpg")).toEqual([]);
  });

  it("maps known soft-seating aliases used by arrangement", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toMatch(/oando-soft-seating--moon[\s\S]*oando-seating--moonlight/);
    expect(source).toMatch(/oando-seating--crox[\s\S]*oando-seating--crotch/);
    expect(source).toMatch(/oando-soft-seating--orb[\s\S]*oando-seating--orbit/);
  });
});
