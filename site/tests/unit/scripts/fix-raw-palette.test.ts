// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix-raw-palette.mjs");

describe("fix-raw-palette (name-mirror)", () => {
  it("defines SAFE_MAP semantic replacements and dry-run default", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("SAFE_MAP");
    expect(src).toContain("bg-gray-100");
    expect(src).toContain("bg-soft");
    expect(src).toContain("--write");
    expect(src).toContain("REVIEW");
    expect(src).toMatch(/Dry-run by default|doWrite/);
  });

  it("SAFE_MAP entries in source replace common gray/text utilities", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    const mapMatch = src.match(/const SAFE_MAP = \{([\s\S]*?)\n\};/);
    expect(mapMatch).not.toBeNull();
    const body = mapMatch![1]!;
    expect(body).toContain('"bg-gray-100": "bg-soft"');
    expect(body).toContain('"text-gray-900": "text-heading"');
    expect(body).toContain('"text-red-500": "text-danger"');
    const PALETTE_RE =
      /\b(bg|text|border|fill|stroke|ring|from|to|via|outline|divide|shadow|caret|placeholder|accent)-([a-z]+)-(\d{2,3})\b/g;
    const sample = 'className="bg-gray-100 text-red-500 text-center"';
    const hits = [...sample.matchAll(PALETTE_RE)].map((m) => m[0]);
    expect(hits).toEqual(["bg-gray-100", "text-red-500"]);
  });
});
