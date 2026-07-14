// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-hardcoded-detail.mjs");

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

function loadPatterns(): {
  TSX_PATTERNS: Array<{ id: string; re: RegExp; label: string }>;
  CSS_PATTERNS: Array<{ id: string; re: RegExp; label: string }>;
} {
  const source = fs.readFileSync(scriptPath, "utf8");
  const tsxMatch = source.match(/const TSX_PATTERNS = (\[[\s\S]*?\n\]);/);
  const cssMatch = source.match(/const CSS_PATTERNS = (\[[\s\S]*?\n\]);/);
  if (!tsxMatch || !cssMatch) throw new Error("pattern arrays not found");
  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- rehydrate script pattern tables under test
  const TSX_PATTERNS = new Function(`return ${tsxMatch[1]}`)() as Array<{
    id: string;
    re: RegExp;
    label: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- rehydrate script pattern tables under test
  const CSS_PATTERNS = new Function(`return ${cssMatch[1]}`)() as Array<{
    id: string;
    re: RegExp;
    label: string;
  }>;
  return { TSX_PATTERNS, CSS_PATTERNS };
}

describe("audit-hardcoded-detail", () => {
  it("emits detail and summary CSV audits for tsx and css hardcoding", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("hardcoded-audit-detail.csv");
    expect(source).toContain("hardcoded-audit-summary.csv");
    expect(source).toContain("TSX_PATTERNS");
    expect(source).toContain("CSS_PATTERNS");
    expect(source).toContain("BASE_CSS_PREFIXES");
  });

  it("csv-escapes commas, quotes, and newlines", () => {
    const csvEscape = loadCsvEscape();
    expect(csvEscape("plain")).toBe("plain");
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
    expect(csvEscape(null)).toBe("");
  });

  it("detects representative hardcoded TSX and CSS values", () => {
    const { TSX_PATTERNS, CSS_PATTERNS } = loadPatterns();

    const hex = TSX_PATTERNS.find((p) => p.id === "hex_color");
    const px = TSX_PATTERNS.find((p) => p.id === "px_literal");
    const inline = TSX_PATTERNS.find((p) => p.id === "inline_style");
    expect(hex).toBeDefined();
    expect(px).toBeDefined();
    expect(inline).toBeDefined();

    expect("#ff00aa".match(hex!.re)?.[0]).toBe("#ff00aa");
    expect("width: 12px".match(px!.re)?.[0]).toBe("12px");
    expect('style={{ color: "red" }}'.match(inline!.re)?.[0]).toContain("style={{");

    const cssHex = CSS_PATTERNS.find((p) => p.id === "hex_color");
    const cssPx = CSS_PATTERNS.find((p) => p.id === "px_literal");
    expect(cssHex).toBeDefined();
    expect(cssPx).toBeDefined();
    expect("color: #abc".match(cssHex!.re)?.[0]).toBe("#abc");
    expect("padding: 8px".match(cssPx!.re)?.[0]).toBe("8px");

    expect(TSX_PATTERNS.length).toBeGreaterThan(10);
    expect(CSS_PATTERNS.length).toBeGreaterThan(10);
  });
});
