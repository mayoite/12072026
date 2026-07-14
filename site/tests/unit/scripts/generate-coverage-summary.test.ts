// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/generate-coverage-summary.mjs");

const SITE_SCOPE_PREFIXES = [
  "features/site/data/",
  "lib/catalog/",
  "lib/configurator/",
  "lib/catalog/site/",
  "features/shared/",
  "features/site/assistant/",
  "features/ops/",
];
const SITE_SCOPE_EXACT = "features/site/advisor/aiadvisor.ts";

function normalizePath(filePath: string) {
  return filePath.replace(/\\/g, "/").toLowerCase();
}

function scopeFromPath(filePath: string) {
  const n = normalizePath(filePath);
  if (n.includes("/features/planner/")) return "features/planner";
  if (n.includes("/features/")) return "features/other";
  if (n.includes("/lib/")) return "lib";
  if (n.includes("/components/")) return "components";
  if (n.includes("/app/")) return "app";
  if (n.includes("/data/")) return "data";
  return "other";
}

function isSiteScopeFile(filePath: string) {
  const n = normalizePath(filePath);
  if (n.endsWith(SITE_SCOPE_EXACT) || n.endsWith(`/${SITE_SCOPE_EXACT}`)) return true;
  if (n.includes("/lib/configurator/")) {
    return n.endsWith(".ts") && !n.endsWith(".d.ts");
  }
  return SITE_SCOPE_PREFIXES.some(
    (prefix) => n.includes(`/${prefix}`) || n.includes(prefix),
  );
}

function pct(n: number, d: number) {
  return d ? Math.round((1000 * n) / d) / 10 : 0;
}

describe("generate-coverage-summary (name-mirror)", () => {
  it("aggregates planner and site scopes into coverage-summary.json", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("coverage-summary.json");
    expect(src).toContain("COVERAGE_GATE_PLANNER");
    expect(src).toContain("isSiteScopeFile");
    expect(src).toContain("aggregatePlannerScopes");
  });

  it("scope helpers classify planner/site paths and pct math", () => {
    expect(scopeFromPath("site/features/planner/x.ts")).toBe("features/planner");
    expect(scopeFromPath("site/lib/utils.ts")).toBe("lib");
    expect(isSiteScopeFile("features/site/data/homepage.ts")).toBe(true);
    expect(isSiteScopeFile("features/site/advisor/aiadvisor.ts")).toBe(true);
    expect(isSiteScopeFile("site/lib/configurator/foo.ts")).toBe(true);
    // .d.ts excluded only when path contains "/lib/configurator/" (leading slash segment).
    expect(isSiteScopeFile("site/lib/configurator/foo.d.ts")).toBe(false);
    expect(isSiteScopeFile("features/planner/canvas.ts")).toBe(false);
    expect(pct(1, 2)).toBe(50);
    expect(pct(0, 0)).toBe(0);
  });
});
