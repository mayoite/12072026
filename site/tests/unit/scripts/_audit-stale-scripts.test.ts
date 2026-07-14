// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/_audit-stale-scripts.mjs");
const repoRoot = path.resolve(siteRoot, "..");
const outDir = path.join(repoRoot, "results", "site", "scripts-audit");
const outJson = path.join(outDir, "stale-scripts-audit.json");
const outMd = path.join(outDir, "STALE-SCRIPTS.md");

describe("_audit-stale-scripts (name-mirror)", () => {
  it("scans site and root scripts and writes a structured audit report", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
      timeout: 120_000,
    });

    expect(output).toContain("# Stale scripts audit");
    expect(output).toMatch(/Scripts with issues/i);
    expect(output).toContain("Wrote");
    expect(fs.existsSync(outJson)).toBe(true);

    const report = JSON.parse(fs.readFileSync(outJson, "utf8")) as {
      summary: {
        siteScriptsScanned: number;
        rootScriptsScanned: number;
        scriptsWithIssues: number;
      };
      packages: Record<string, boolean>;
      hardRoutesMissing: string[];
    };

    expect(report.summary.siteScriptsScanned).toBeGreaterThan(0);
    expect(report.summary.rootScriptsScanned).toBeGreaterThanOrEqual(0);
    expect(typeof report.summary.scriptsWithIssues).toBe("number");
    expect(report.packages).toHaveProperty("three");
    expect(Array.isArray(report.hardRoutesMissing)).toBe(true);

    // Layout gate forbids Markdown under results/; script still emits it — drop after assert.
    if (fs.existsSync(outMd)) {
      expect(fs.readFileSync(outMd, "utf8")).toContain("# Stale scripts audit");
      fs.unlinkSync(outMd);
    }
  }, 120_000);
});
