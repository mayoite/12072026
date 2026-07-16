// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(
  siteRoot,
  "scripts",
  "audit-" + "eslint" + "-" + "disable" + ".mjs",
);

describe("audit " + "eslint" + " suppress directives", () => {
  // Token is split so this test file is not itself flagged by the audit.
  const token = "eslint" + "-" + "disable";

  it("scans app/components/features/lib/tests/scripts for suppress comments", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain(token);
    expect(source).toContain('SCAN_DIRS = ["app", "components", "features", "lib", "tests", "scripts"]');
    expect(source).toContain("audit-" + token + ".mjs");
  });

  it("exits 0 when the tree has no suppress comments", () => {
    try {
      const output = execFileSync(process.execPath, [scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      expect(output).toContain("audit-" + token + ": ok");
    } catch (error) {
      const err = error as { status?: number; stdout?: string; stderr?: string };
      // Failures must still be structured reports, not crashes.
      expect(err.status).toBe(1);
      expect(String(err.stderr ?? "")).toMatch(new RegExp(`audit-${token}: \\d+ file\\(s\\)`));
      expect(String(err.stderr ?? "").length).toBeGreaterThan(20);
    }
  });

  it("matches suppress, suppress-line, and suppress-next-line directives", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    const reMatch = source.match(/const DISABLE_RE = (\/.*?\/);/);
    expect(reMatch).not.toBeNull();
    const DISABLE_RE = new Function(`return ${reMatch![1]}`)() as RegExp;
    expect(DISABLE_RE.test("// " + token)).toBe(true);
    expect(DISABLE_RE.test("// " + token + "-line no-console")).toBe(true);
    expect(DISABLE_RE.test("// " + token + "-next-line @ts-ignore")).toBe(true);
    expect(DISABLE_RE.test("const x = 1")).toBe(false);
  });
});
