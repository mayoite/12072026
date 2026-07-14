// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/generate-route-index.mjs");
const outPath = path.join(repoRoot, "docs/api/ROUTE-INDEX.md");

describe("generate-route-index (name-mirror)", () => {
  it("writes API route index markdown from app/api route handlers", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
    });

    expect(output).toMatch(/Wrote .*ROUTE-INDEX\.md \(\d+ routes\)/);
    expect(fs.existsSync(outPath)).toBe(true);

    const md = fs.readFileSync(outPath, "utf8");
    expect(md).toContain("# API route index");
    expect(md).toContain("| Methods | Path |");
    expect(md).toContain("`/api/");
    expect(md).toMatch(/\|\s*GET/);
    expect(md).toContain("## Notes");
    expect(md).toContain("withAuth");
  });
});
