// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { baseUrl } from "../../../scripts/lib/scriptEnv.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/runtime-evidence-probe.mjs");

describe("runtime-evidence-probe (name-mirror)", () => {
  it("probes public pages, planner routes, and theme API into results JSON", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("PUBLIC_PAGES");
    expect(src).toContain("PLANNER_ROUTES");
    expect(src).toContain("/api/theme/active/");
    expect(src).toContain("dynamic-block-theme");
    expect(src).toContain("runtime-evidence.json");
    expect(src).toContain('"/products"');
    expect(src).toContain('"/planner/guest"');
    expect(src).toContain('"/planner/open3d"');
  });

  it("uses shared baseUrl with env override strip trailing slash", () => {
    const prev = process.env.BASE_URL;
    try {
      process.env.BASE_URL = "http://127.0.0.1:3456/";
      expect(baseUrl()).toBe("http://127.0.0.1:3456");
      delete process.env.BASE_URL;
      delete process.env.PLAYWRIGHT_BASE_URL;
      delete process.env.PROBE_BASE_URL;
      delete process.env.LAUNCH_SMOKE_BASE_URL;
      expect(baseUrl("http://localhost:3000")).toBe("http://localhost:3000");
    } finally {
      if (prev === undefined) delete process.env.BASE_URL;
      else process.env.BASE_URL = prev;
    }
  });
});
