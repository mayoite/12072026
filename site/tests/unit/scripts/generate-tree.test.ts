// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate-tree.js");
const outPath = path.join(repoRoot, "results/project-tree.csv");

describe("generate-tree (name-mirror)", () => {
  it(
    "writes project-tree.csv with domain narrations from the monorepo root",
    () => {
      const output = execFileSync(process.execPath, [scriptPath], {
        cwd: repoRoot,
        encoding: "utf8",
      });

      expect(output).toMatch(/Generated ultra-deep code-intelligent CSV tree with \d+ nodes/);
      expect(fs.existsSync(outPath)).toBe(true);

      const csv = fs.readFileSync(outPath, "utf8");
      expect(csv.startsWith("Level 1,Level 2,Level 3,Level 4,Level 5,Level 6,Level 7,Level 8,Narration,Remark")).toBe(
        true,
      );
      expect(csv).toContain('"site/"');
      expect(csv).toContain('"scripts/"');
      expect(csv).toContain("package.json");
      expect(csv).toMatch(/TypeScript\/JavaScript Source|JSON config|Markdown Document|directory/);
      expect(csv.split(/\r?\n/).length).toBeGreaterThan(50);
    },
    60_000,
  );
});
