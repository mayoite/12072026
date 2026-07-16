// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { loadVitestTestExcludes } from "../../../../scripts/lib/vitest-excludes.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

describe("vitest-excludes (name-mirror)", () => {
  it("loads exact and glob excludes that start with tests/ from vitest.config.ts", () => {
    const { exact, globs } = loadVitestTestExcludes(siteRoot);

    expect(Array.isArray(exact)).toBe(true);
    expect(Array.isArray(globs)).toBe(true);

    for (const item of [...exact, ...globs]) {
      expect(item.startsWith("tests/")).toBe(true);
    }

    for (const g of globs) {
      expect(g.includes("*")).toBe(true);
    }
    for (const e of exact) {
      expect(e.includes("*")).toBe(false);
    }
  });

  it("returns empty lists when exclude block is missing", () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "vitest-excludes-"));
    fs.writeFileSync(path.join(tmpRoot, "vitest.config.ts"), "export default {}\n", "utf8");

    try {
      const result = loadVitestTestExcludes(tmpRoot);
      expect(result).toEqual({ exact: [], globs: [] });
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });
});
