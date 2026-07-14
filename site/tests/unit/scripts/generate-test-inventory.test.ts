// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate-test-inventory.mjs");
const jsonPath = path.join(repoRoot, "results/test-inventory.json");
const migrationPath = path.join(repoRoot, "results/test-migration-map.json");

describe("generate-test-inventory (name-mirror)", () => {
  it("refreshes test inventory JSON with counts and migration map pairs", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
    });

    expect(output.length).toBeGreaterThan(0);
    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(migrationPath)).toBe(true);

    const inventory = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as {
      source: string;
      counts: {
        total: number;
        vitest: number;
        vitestExcluded: number;
        playwright: number;
        helpers: number;
      };
      files: Array<{ name: string; path: string; kind: string; runner: string }>;
    };

    expect(inventory.source).toBe("tests/");
    expect(inventory.counts.total).toBeGreaterThanOrEqual(0);
    expect(
      inventory.counts.vitest +
        inventory.counts.vitestExcluded +
        inventory.counts.playwright +
        inventory.counts.helpers,
    ).toBeLessThanOrEqual(inventory.counts.total + inventory.counts.helpers);
    expect(Array.isArray(inventory.files)).toBe(true);

    const migration = JSON.parse(fs.readFileSync(migrationPath, "utf8")) as {
      pairs: Array<{ from: string; to: string }>;
    };
    expect(migration.pairs.length).toBeGreaterThan(0);
    expect(migration.pairs[0].from).toContain("tests/unit/");
    expect(migration.pairs[0].to).toContain("tests/unit/");
  });
});
