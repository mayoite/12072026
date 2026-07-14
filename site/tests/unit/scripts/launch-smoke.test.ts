// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/launch-smoke.mjs");

describe("launch-smoke (name-mirror)", () => {
  it("covers critical launch routes and console failure patterns", () => {
    const source = fs.readFileSync(scriptPath, "utf8");

    for (const route of [
      { name: "home", path: "/" },
      { name: "products", path: "/products" },
      { name: "login", path: "/login" },
      { name: "contact", path: "/contact" },
      { name: "trusted-by", path: "/trusted-by" },
      { name: "sustainability", path: "/sustainability" },
      { name: "planner-entry", path: "/choose-product" },
    ]) {
      expect(source).toContain(`name: "${route.name}"`);
      expect(source).toContain(`path: "${route.path}"`);
    }

    expect(source).toContain("failed to fetch");
    expect(source).toContain("hydration failed");
    expect(source).toContain("launch-smoke-summary.json");
    expect(source).toContain("chromium");
    expect(source).toContain("desktop");
    expect(source).toContain("mobile");
    expect(source).toMatch(/width:\s*1440/);
    expect(source).toMatch(/width:\s*390/);
  });

  it("resolves base URL from --url or scriptEnv and fails the process when any route is not ok", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain('from "./lib/scriptEnv.mjs"');
    expect(source).toContain('getArgValue("--url"');
    expect(source).toContain("process.exitCode = 1");
    expect(source).toContain("results.every((result) => result.ok)");
  });
});
