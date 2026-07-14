// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate_blocks.ts");
const outPath = path.join(repoRoot, "results/actual_engine_blocks.svg");
const tsxCli = path.join(repoRoot, "node_modules/tsx/dist/cli.mjs");

describe("generate_blocks (name-mirror)", () => {
  it(
    "renders workstation block SVG into results/actual_engine_blocks.svg",
    () => {
      const output = execFileSync(process.execPath, [tsxCli, scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
      });

      expect(output).toMatch(/Written successfully to .*actual_engine_blocks\.svg/);
      expect(fs.existsSync(outPath)).toBe(true);

      const svg = fs.readFileSync(outPath, "utf8");
      expect(svg).toContain("<svg");
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain("viewBox=");
      expect(svg).toContain('id="grad-surface"');
      expect(svg).toContain("--block-surface");
      // Script roots CSV under monorepo (not site/); empty workstation parse still emits a valid SVG shell.
      expect(svg).toMatch(/<\/svg>\s*$/);
    },
    60_000,
  );
});
