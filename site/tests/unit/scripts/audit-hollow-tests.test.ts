// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-hollow-tests.mjs");

function loadHollowPatterns(): Array<{ id: string; re: RegExp }> {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/const HOLLOW_PATTERNS = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error("HOLLOW_PATTERNS not found");
  return new Function(`return ${match[1]}`)() as Array<{ id: string; re: RegExp }>;
}

function loadCountExpects(): (source: string) => number {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/function countExpects\(source\) \{[\s\S]*?\n\}/);
  if (!match) throw new Error("countExpects not found");
  const sandbox: { countExpects?: (source: string) => number } = {};
  vm.runInNewContext(`${match[0]}; this.countExpects = countExpects;`, sandbox);
  if (!sandbox.countExpects) throw new Error("countExpects failed to load");
  return sandbox.countExpects;
}

describe("audit-hollow-tests", () => {
  it("flags hollow Vitest cases under tests/", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("HOLLOW_PATTERNS");
    expect(source).toContain("expect-true");
    expect(source).toContain("sole-truthy");
    expect(source).toContain("zero-expect");
    expect(source).toContain("--exclude-marketing");
  });

  it("matches hollow expect-true and sole-truthy pattern ids", () => {
    const patterns = loadHollowPatterns();
    const byId = Object.fromEntries(patterns.map((p) => [p.id, p.re]));
    // Split markers so this file is not itself flagged as hollow.
    const hollowTrue = "expect(true)." + "toBe(true)";
    const hollowTruthy = "expect(x)." + "toBeTruthy()";
    const hollowCatch = "catch (err) " + "{}";
    expect(byId["expect-true"].test(hollowTrue)).toBe(true);
    expect(byId["expect-true"].test("expect(value).toBe(true)")).toBe(false);
    expect(byId["sole-truthy"].test(hollowTruthy)).toBe(true);
    expect(byId["empty-catch"].test(hollowCatch)).toBe(true);
    expect(byId["empty-catch"].test("catch (err) { log(err); }")).toBe(false);
  });

  it("counts expect( calls for zero-expect detection", () => {
    const countExpects = loadCountExpects();
    expect(countExpects("it('x', () => { expect(1).toBe(1); expect(2).toBe(2); })")).toBe(2);
    expect(countExpects("it('empty', () => { const x = 1; })")).toBe(0);
  });

  it("runs against the live tests tree without crashing", () => {
    try {
      const output = execFileSync(process.execPath, [scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 10 * 1024 * 1024,
      });
      expect(output).toContain("audit-hollow-tests: ok");
    } catch (error) {
      const err = error as { status?: number; stderr?: string };
      expect(err.status).toBe(1);
      expect(String(err.stderr ?? "")).toMatch(/audit-hollow-tests: \d+ issue\(s\)/);
    }
  });
});
