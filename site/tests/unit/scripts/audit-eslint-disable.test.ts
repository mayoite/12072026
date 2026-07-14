// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-eslint-disable.mjs");

describe("audit-eslint-disable", () => {
  it("scans app/components/features/lib/tests/scripts for eslint-disable comments", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("eslint-disable");
    expect(source).toContain('SCAN_DIRS = ["app", "components", "features", "lib", "tests", "scripts"]');
    expect(source).toContain("audit-eslint-disable.mjs");
  });

  it("exits 0 when the tree has no eslint-disable comments", () => {
    try {
      const output = execFileSync(process.execPath, [scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      expect(output).toContain("audit-eslint-disable: ok");
    } catch (error) {
      const err = error as { status?: number; stdout?: string; stderr?: string };
      // Failures must still be structured reports, not crashes.
      expect(err.status).toBe(1);
      expect(String(err.stderr ?? "")).toMatch(/audit-eslint-disable: \d+ file\(s\)/);
      expect(String(err.stderr ?? "").length).toBeGreaterThan(20);
    }
  });

  it("matches eslint-disable, eslint-disable-line, and eslint-disable-next-line", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    const reMatch = source.match(/const DISABLE_RE = (\/.*?\/);/);
    expect(reMatch).not.toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- rehydrate script regex under test
    const DISABLE_RE = new Function(`return ${reMatch![1]}`)() as RegExp;
    expect(DISABLE_RE.test("// eslint-disable")).toBe(true);
    expect(DISABLE_RE.test("// eslint-disable-line no-console")).toBe(true);
    expect(DISABLE_RE.test("// eslint-disable-next-line @ts-ignore")).toBe(true);
    expect(DISABLE_RE.test("const x = 1")).toBe(false);
  });
});
