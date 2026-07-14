// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const scriptPath = path.join(siteRoot, "scripts/codemods/homepage-dialect.mjs");
const repoRoot = path.resolve(siteRoot, "..");
const logFile = path.join(repoRoot, "results", "site-ui", "codemod-dry-run.log");

describe("homepage-dialect codemod (name-mirror)", () => {
  it("dry-runs by default and writes a codemod log under results/site-ui", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
      timeout: 60_000,
    });

    expect(output).toMatch(/homepage-dialect codemod:/);
    expect(output).toMatch(/dry-run only/);
    expect(fs.existsSync(logFile)).toBe(true);

    const log = fs.readFileSync(logFile, "utf8");
    expect(log.startsWith("DRY-RUN homepage-dialect codemod")).toBe(true);
  }, 60_000);
});
