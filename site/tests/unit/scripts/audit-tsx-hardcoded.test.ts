// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-tsx-hardcoded.mjs");

function loadCsvEscape(): (s: unknown) => string {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/function csvEscape\(s\) \{[\s\S]*?\n\}/);
  if (!match) throw new Error("csvEscape not found");
  const sandbox: { String: typeof String; csvEscape?: (s: unknown) => string } = {
    String,
  };
  vm.runInNewContext(`${match[0]}; this.csvEscape = csvEscape;`, sandbox);
  if (!sandbox.csvEscape) throw new Error("csvEscape failed to load");
  return sandbox.csvEscape;
}

function loadPatterns(): Array<{ id: string; re: RegExp; label: string }> {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/const PATTERNS = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error("PATTERNS not found");
  return new Function(`return ${match[1]}`)() as Array<{
    id: string;
    re: RegExp;
    label: string;
  }>;
}

describe("audit-tsx-hardcoded", () => {
  it("scans TSX for hardcoded layout/color/typography and writes CSV", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("tsx-hardcoded-audit.csv");
    expect(source).toContain("PATTERNS");
    expect(source).toContain("inline_style");
    expect(source).toContain("hex_color");
    expect(source).toContain("slate_gray_tailwind");
  });

  it("csv-escapes CSV cell values", () => {
    const csvEscape = loadCsvEscape();
    expect(csvEscape("ok")).toBe("ok");
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape('x"y')).toBe('"x""y"');
  });

  it("detects representative hardcoded classes and style props", () => {
    const patterns = loadPatterns();
    const byId = Object.fromEntries(patterns.map((p) => [p.id, p]));

    expect(byId.inline_style.re.test('style={{ margin: 0 }}')).toBe(true);
    expect(byId.hex_color.re.test("color: #fff")).toBe(true);
    expect(byId.px_literal.re.test("12px")).toBe(true);
    expect(byId.font_size_tw.re.test("text-lg")).toBe(true);
    expect(byId.spacing_tw.re.test("px-4")).toBe(true);
    expect(byId.slate_gray_tailwind.re.test("bg-slate-500")).toBe(true);
    expect(byId.framer_motion.re.test("initial={{ opacity: 0 }}")).toBe(true);
    expect(byId.gsap_duration.re.test("duration: 0.3")).toBe(true);

    expect(patterns.length).toBeGreaterThan(15);
    expect(patterns.every((p) => p.id && p.label && p.re instanceof RegExp)).toBe(true);
  });

  it("skips non-tsx directories listed in SKIP_DIRS", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("node_modules");
    expect(source).toContain(".next");
    expect(source).toContain("SKIP_DIRS");
    expect(source).toMatch(/endsWith\("\.tsx"\)/);
  });
});
