// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate-scripts-inventory.mjs");
const outPath = path.join(repoRoot, "results/scripts-inventory.csv");

describe("generate-scripts-inventory (name-mirror)", () => {
  it("writes a CSV inventory of scripts with wiring and categories", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
    });

    expect(output).toMatch(/Wrote .*scripts-inventory\.csv \(\d+ scripts/);
    expect(fs.existsSync(outPath)).toBe(true);

    const csv = fs.readFileSync(outPath, "utf8");
    const lines = csv.trim().split(/\r?\n/);
    expect(lines[0]).toBe("script,extension,wired_in_package_json,category");
    expect(lines.length).toBeGreaterThan(20);
    expect(csv).toContain("scripts/generate-scripts-inventory.mjs");
    expect(csv).toMatch(/,"(yes|no)",/);
    expect(csv).toMatch(/,"(utility|debug|audit|database|assets|report|test-tooling)"/);
  });
});
