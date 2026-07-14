// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/run-open3d-world-e2e.mjs");
const specsPath = path.join(
  siteRoot,
  "config",
  "build",
  "playwright-open3d-world-specs.json",
);

describe("run-open3d-world-e2e (name-mirror)", () => {
  it("reads curated world-standard specs and verifies each file exists", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    expect(fs.existsSync(specsPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(specsPath, "utf8")) as {
      version: number;
      specs: string[];
      workers?: number;
    };
    expect(manifest.version).toBe(1);
    expect(Array.isArray(manifest.specs)).toBe(true);
    expect(manifest.specs.length).toBeGreaterThanOrEqual(5);

    const missing: string[] = [];
    for (const rel of manifest.specs) {
      if (!fs.existsSync(path.join(siteRoot, rel))) missing.push(rel);
    }
    expect(missing).toEqual([]);
  });

  it("runs playwright with lock skip and open3d gate env", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("playwright-open3d-world-specs.json");
    expect(src).toContain("acquirePlaywrightDevLock");
    expect(src).toContain("PLAYWRIGHT_DEV_LOCK_SKIP");
    expect(src).toContain("OPEN3D_WORLD_GATE");
    expect(src).toContain("results");
    expect(src).toContain("world-standard-wave");
    expect(src).toContain("gate-e2e");
  });
});
