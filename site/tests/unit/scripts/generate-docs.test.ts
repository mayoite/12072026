// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/generate-docs.mjs");

function planSteps(withAll: boolean, withCoverage: boolean) {
  return [
    ...(withAll ? ["generate-route-index.mjs"] : []),
    "generate-test-inventory.mjs",
    ...(withCoverage
      ? ["generate-coverage-summary.mjs", "analyze-coverage-report.mjs"]
      : []),
  ];
}

describe("generate-docs (name-mirror)", () => {
  it("orchestrates inventory and optional coverage with tracked check", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("generate-test-inventory.mjs");
    expect(src).toContain("--all");
    expect(src).toContain("--coverage");
    expect(src).toContain("--check");
    expect(src).toContain("site/tests/INVENTORY.md");
  });

  it("step plan matches flag matrix", () => {
    expect(planSteps(false, false)).toEqual(["generate-test-inventory.mjs"]);
    expect(planSteps(true, false)).toEqual([
      "generate-route-index.mjs",
      "generate-test-inventory.mjs",
    ]);
    expect(planSteps(false, true)).toEqual([
      "generate-test-inventory.mjs",
      "generate-coverage-summary.mjs",
      "analyze-coverage-report.mjs",
    ]);
    expect(planSteps(true, true)).toEqual([
      "generate-route-index.mjs",
      "generate-test-inventory.mjs",
      "generate-coverage-summary.mjs",
      "analyze-coverage-report.mjs",
    ]);
  });
});
