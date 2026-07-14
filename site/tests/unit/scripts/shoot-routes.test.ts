// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { baseUrl } from "../../../scripts/lib/scriptEnv.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/shoot-routes.mjs");

describe("shoot-routes (name-mirror)", () => {
  it("screenshots marketing and gated planner routes with guest cookie", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("ROUTES");
    expect(src).toContain('"/planner/guest"');
    expect(src).toContain('"/planner/open3d"');
    expect(src).toContain("planner_guest_pass");
    expect(src).toContain("--out");
    expect(src).toContain("chromium");
    expect(src).toContain("defaultBaseUrl");
    // live ROUTES use planner guest/open3d only (comment may mention dropped configurator)
    expect(src).toMatch(/\["planner-guest",\s*"\/planner\/guest"/);
    expect(src).toMatch(/\["planner-open3d",\s*"\/planner\/open3d"/);
    expect(src).not.toMatch(/\["[^"]+",\s*"\/configurator\/guest"/);
  });

  it("defaults target base URL via shared baseUrl helper", () => {
    const prev = process.env.BASE_URL;
    try {
      process.env.BASE_URL = "http://localhost:4000/";
      expect(baseUrl()).toBe("http://localhost:4000");
    } finally {
      if (prev === undefined) delete process.env.BASE_URL;
      else process.env.BASE_URL = prev;
    }
  });
});
