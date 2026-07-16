// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-quality-gate.mjs");
const repoRoot = path.resolve(siteRoot, "..");

describe("audit-quality-gate", () => {
  it("implements release quality checks for size, env, routes, theme, deps", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("MAX_LINES = 700");
    expect(source).toContain("route-contract.json");
    expect(source).toContain("block-surface");
    expect(source).toContain("block-text");
    expect(source).toContain("block-accent");
    expect(source).toContain("block-border");
    expect(source).toContain("QUALITY GATE AUDIT REPORT");
    expect(source).toContain("criticalDeps");
  });

  it("requires the four theme tokens listed in the gate", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    const tokenBlock = source.match(
      /const requiredTokens = (\[[\s\S]*?\]);/,
    );
    expect(tokenBlock).not.toBeNull();
    const requiredTokens = new Function(`return ${tokenBlock![1]}`)() as string[];
    expect(requiredTokens).toEqual([
      "block-surface",
      "block-text",
      "block-accent",
      "block-border",
    ]);
  });

  it("runs and prints a pass/fail quality gate report", () => {
    try {
      const output = execFileSync(process.execPath, [scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 10 * 1024 * 1024,
      });
      expect(output).toContain("QUALITY GATE AUDIT REPORT");
      expect(output).toMatch(/Quality gate (PASSED|FAILED)/);
    } catch (error) {
      const err = error as { status?: number; stdout?: string; stderr?: string };
      const combined = `${err.stdout ?? ""}${err.stderr ?? ""}`;
      expect(combined).toContain("QUALITY GATE AUDIT REPORT");
      expect(err.status === 0 || err.status === 1).toBe(true);
    }
  });

  it("resolves ROOT to the monorepo root (parent of site/)", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain('resolve(import.meta.dirname, "../..")');
    // From site/scripts, ../.. is the repo root used for git ls-files and package.json.
    expect(fs.existsSync(path.join(repoRoot, "site", "package.json"))).toBe(true);
  });
});
