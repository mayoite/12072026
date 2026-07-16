// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate-eslint-taxonomy.mjs");
const outPath = path.join(repoRoot, "results/baseline-eslint-taxonomy.json");

describe("generate-eslint-taxonomy (name-mirror)", () => {
  it("parses a fixture lint log into taxonomy buckets and writes JSON", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "eslint-tax-"));
    try {
      const logPath = path.join(tmp, "lint.log");
      fs.writeFileSync(
        logPath,
        [
          "  1:1  error    Unexpected any  @typescript-eslint/no-explicit-any",
          "  2:3  warning  'x' is defined but never used  @typescript-eslint/no-unused-vars",
          "  3:1  error    Test must have at least one expect  vitest/expect-expect",
          "  4:1  error    Expected === and !==  eqeqeq",
          "",
        ].join("\n"),
        "utf8",
      );

      const output = execFileSync(process.execPath, [scriptPath, logPath], {
        cwd: siteRoot,
        encoding: "utf8",
      });

      expect(output).toMatch(/Wrote .*baseline-eslint-taxonomy\.json/);
      expect(output).toContain("3 errors");
      expect(output).toContain("1 warnings");

      const taxonomy = JSON.parse(fs.readFileSync(outPath, "utf8")) as {
        errors: number;
        warnings: number;
        totalProblems: number;
        byBucket: Record<string, number>;
        bucketSum: number;
        byRule: Record<string, number>;
      };

      expect(taxonomy.errors).toBe(3);
      expect(taxonomy.warnings).toBe(1);
      expect(taxonomy.totalProblems).toBe(4);
      expect(taxonomy.byBucket.P).toBe(1);
      expect(taxonomy.byBucket.A).toBe(1);
      expect(taxonomy.byBucket.M).toBe(1);
      expect(taxonomy.byBucket.S).toBe(1);
      expect(taxonomy.bucketSum).toBe(4);
      expect(taxonomy.byRule["@typescript-eslint/no-explicit-any"]).toBe(1);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
