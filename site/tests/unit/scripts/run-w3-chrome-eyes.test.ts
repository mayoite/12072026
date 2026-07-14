// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/run-w3-chrome-eyes.mjs");

describe("run-w3-chrome-eyes (name-mirror)", () => {
  it("targets planner guest with dev tools and parses furniture counts", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("/planner/guest/");
    expect(src).toContain("plannerDevTools=1");
    expect(src).toContain("furnitureCount");
    expect(src).toContain("furniture");
    expect(src).toContain("(\\d+)");
    expect(src).toContain("chromium");
    expect(src).toContain("Set up your space");
  });

  it("clears planner storage prefixes before boot", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("cad-suite:planner:");
    expect(src).toContain("oando-project-setup-complete-");
    expect(src).toContain("planner-workspace-db");
    expect(src).toContain("buddy-planner-db");
  });
});
