// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runAudit } from "@/scripts/audit-test-quality";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-test-quality.ts");

describe("audit-test-quality", () => {
  it("exports runAudit for empty tests, missing expects, mocks, and any", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    expect(typeof runAudit).toBe("function");
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("export function runAudit");
    expect(source).toContain("Empty test block");
    expect(source).toContain("Test without assertions");
    expect(source).toContain("Internal business logic mocked");
  });

  it("reports clean files for a tiny fixture with a real assertion", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "audit-tq-clean-"));
    try {
      const testsDir = path.join(tmp, "tests");
      fs.mkdirSync(testsDir, { recursive: true });
      fs.writeFileSync(
        path.join(testsDir, "good.test.ts"),
        `import { describe, expect, it } from "vitest";
describe("good", () => {
  it("asserts", () => {
    expect(1 + 1).toBe(2);
  });
});
`,
        "utf8",
      );

      const result = runAudit(tmp);
      expect(result.exitCode).toBe(0);
      expect(result.cleanFiles).toBe(1);
      expect(result.dirtyFiles).toHaveLength(0);
      expect(result.totalIssues).toBe(0);
      expect(result.output).toContain("AUDIT COMPLETE");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("flags tests without expect and empty it blocks", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "audit-tq-dirty-"));
    try {
      const testsDir = path.join(tmp, "tests");
      fs.mkdirSync(testsDir, { recursive: true });
      fs.writeFileSync(
        path.join(testsDir, "bad.test.ts"),
        `import { describe, it } from "vitest";
describe("bad", () => {
  it("no assert", () => {
    const x = 1;
  });
  it("empty", () => {});
});
`,
        "utf8",
      );

      const result = runAudit(tmp);
      expect(result.exitCode).toBe(1);
      expect(result.totalIssues).toBeGreaterThan(0);
      expect(result.dirtyFiles.length).toBeGreaterThan(0);
      expect(result.output).toMatch(/without assertions|Empty test block/i);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
