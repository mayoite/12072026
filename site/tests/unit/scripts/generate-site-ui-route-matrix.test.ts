// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate-site-ui-route-matrix.mjs");
const outPath = path.join(repoRoot, "results/site-ui/route-matrix.csv");

describe("generate-site-ui-route-matrix (name-mirror)", () => {
  it("writes route-matrix.csv with golden homepage and solutions rows", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
    });

    expect(output).toMatch(/Wrote .*route-matrix\.csv \(\d+ routes\)/);
    expect(output).toContain("Golden rows:");
    expect(fs.existsSync(outPath)).toBe(true);

    const csv = fs.readFileSync(outPath, "utf8");
    const header = csv.split(/\r?\n/, 1)[0];
    expect(header).toBe(
      "path,homepage_gap,homepage_fidelity,dialect,wrapper,hero,sections,container,copy_source,layout_root",
    );
    expect(csv).toMatch(/(^|\n)\/,/);
    expect(csv).toContain("/solutions");
    expect(csv).toContain("golden homepage reference");
    expect(csv).toContain("layout_root");
    expect(csv.split(/\r?\n/).filter(Boolean).length).toBeGreaterThan(10);
  });
});
