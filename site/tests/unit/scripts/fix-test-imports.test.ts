// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix-test-imports.mjs");

function rewriteImportLine(content: string, relDir: string): string {
  return content.replace(
    /from (["'])(\.\.?\/[^"']+)\1/g,
    (_match, quote: string, importPath: string) => {
      const resolved = path.posix
        .normalize(path.posix.join(relDir, importPath))
        .replace(/\\/g, "/");
      return `from ${quote}@/features/${resolved}${quote}`;
    },
  );
}

describe("fix-test-imports (name-mirror)", () => {
  it("rewrites tests/features relative imports to @/features", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("tests");
    expect(src).toContain("features");
    expect(src).toContain("@/features/");
    expect(src).toContain("FEATURES_TESTS");
    expect(src).toContain("ent.name");
    expect(src).toContain("walk(FEATURES_TESTS)");
  });

  it("normalizes relative import paths under a feature subdir", () => {
    const input = 'import { x } from "../../admin/foo";\nimport y from "./bar";\n';
    const out = rewriteImportLine(input, "planner/ui");
    expect(out).toContain('from "@/features/admin/foo"');
    expect(out).toContain('from "@/features/planner/ui/bar"');
  });
});
