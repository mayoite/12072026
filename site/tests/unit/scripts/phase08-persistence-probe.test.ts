// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/phase08-persistence-probe.mjs",
);

describe("phase08-persistence-probe (name-mirror)", () => {
  it("wraps the dual-read vitest targets and check ids", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("phase08-persistence.test.ts");
    expect(src).toContain("persistBlockDescriptor.test.ts");
    expect(src).toContain("08-PERS-04");
    expect(src).toContain("08-PERS-09");
    expect(src).toContain("08-PERS-10");
    expect(src).toContain("dual-read");
    expect(src).toContain("PLAN-FAIL-0409");
  });

  it("writes disk-only dual-read evidence with mirror deferred", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("disk-only-dual-read.json");
    expect(src).toContain('source: "site/inventory/descriptors"');
    expect(src).toContain("mirror: { enabled: false");
    expect(src).toMatch(/pass\s*=\s*exitCode\s*===\s*0/);
  });
});
