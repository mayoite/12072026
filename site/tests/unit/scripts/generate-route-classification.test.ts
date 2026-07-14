// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/generate-route-classification.mjs");
const outPath = path.join(siteRoot, "docs/ops/context/route-classification.md");

describe("generate-route-classification (name-mirror)", () => {
  it("writes live route classification markdown with planner and API sections", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
    });

    expect(output).toContain("Wrote");
    expect(fs.existsSync(outPath)).toBe(true);

    const md = fs.readFileSync(outPath, "utf8");
    expect(md).toContain("# Live route classification");
    expect(md).toContain("## Canonical planner");
    expect(md).toContain("## API routes");
    expect(md).toContain("## Legacy redirects (301)");
    expect(md).toContain("`/planner");
    expect(md).toMatch(/`\/api\//);
    expect(md).toContain("`/oando-planner` → `/planner/`");
  });
});
