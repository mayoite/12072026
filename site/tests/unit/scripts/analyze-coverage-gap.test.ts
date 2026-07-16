// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/analyze-coverage-gap.mjs");
const repoRoot = path.resolve(siteRoot, "..");

function makeCoverageEntry(filePath: string, hits: number[]): Record<string, unknown> {
  const s: Record<string, number> = {};
  const statementMap: Record<string, { start: { line: number } }> = {};
  hits.forEach((hit, i) => {
    const id = String(i);
    s[id] = hit;
    statementMap[id] = { start: { line: i + 1 } };
  });
  return {
    [filePath]: {
      path: filePath,
      s,
      statementMap,
      f: {},
      b: {},
      fnMap: {},
      branchMap: {},
    },
  };
}

describe("analyze-coverage-gap", () => {
  it("exists as a runnable diagnostic script", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("dualRollupFromFinal");
    expect(source).toContain("scopeBucket");
    expect(source).toContain("DUAL ROLLUP");
  });

  it("exits 1 when coverage-final.json is missing", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cov-gap-missing-"));
    try {
      expect(() =>
        execFileSync(process.execPath, [scriptPath], {
          cwd: tmp,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        }),
      ).toThrow();
      try {
        execFileSync(process.execPath, [scriptPath], {
          cwd: tmp,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        });
      } catch (error) {
        const err = error as { status?: number; stderr?: string };
        expect(err.status).toBe(1);
        expect(String(err.stderr ?? "")).toContain("Missing results/coverage/coverage-final.json");
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("prints dual rollup and scope buckets from a fixture coverage-final.json", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cov-gap-ok-"));
    try {
      const covDir = path.join(tmp, "results", "coverage");
      fs.mkdirSync(covDir, { recursive: true });
      const plannerFile = path.join(tmp, "site", "features", "planner", "demo.ts").replace(/\\/g, "/");
      const libFile = path.join(tmp, "site", "lib", "util.ts").replace(/\\/g, "/");
      const payload = {
        ...makeCoverageEntry(plannerFile, [1, 0, 1]),
        ...makeCoverageEntry(libFile, [0, 0]),
      };
      fs.writeFileSync(path.join(covDir, "coverage-final.json"), JSON.stringify(payload));
      fs.mkdirSync(path.join(tmp, "tests"), { recursive: true });

      const output = execFileSync(process.execPath, [scriptPath], {
        cwd: tmp,
        encoding: "utf8",
      });

      expect(output).toContain("DUAL ROLLUP");
      expect(output).toContain("FULL include statements");
      expect(output).toContain("TOUCHED files only");
      expect(output).toContain("COVERAGE DENOMINATOR");
      expect(output).toMatch(/features\/planner|lib/);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("resolves workspace root when cwd is site package (parent of site/)", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain('path.basename(repoRoot) === "site"');
    expect(source).toContain('path.resolve(repoRoot, "..")');
    // Script path lives under site/scripts; workspace root is repo root.
    expect(path.basename(siteRoot)).toBe("site");
    expect(fs.existsSync(path.join(repoRoot, "site", "scripts", "analyze-coverage-gap.mjs"))).toBe(
      true,
    );
  });
});
