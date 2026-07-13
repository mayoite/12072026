/**
 * Real contract: open3d world e2e pack is declared and every file exists.
 * Prevents "folder evidence" without a callable gate script.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve(__dirname, "../../..");
const manifestPath = path.join(
  siteRoot,
  "config",
  "build",
  "playwright-open3d-world-specs.json",
);
const runnerPath = path.join(siteRoot, "scripts", "run-open3d-world-e2e.mjs");
const packageJsonPath = path.join(siteRoot, "package.json");

type Manifest = {
  version: number;
  description?: string;
  workers?: number;
  specs: string[];
  gates?: Record<string, string>;
  evidenceRoot?: string;
};

describe("playwright-open3d-world-specs (gate contract)", () => {
  it("manifest exists and lists non-empty specs", () => {
    expect(fs.existsSync(manifestPath), manifestPath).toBe(true);
    const raw = fs.readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(raw) as Manifest;
    expect(manifest.version).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(manifest.specs)).toBe(true);
    expect(manifest.specs.length).toBeGreaterThanOrEqual(4);
    expect(manifest.workers ?? 1).toBe(1);
  });

  it("every declared spec file exists under site/", () => {
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as Manifest;
    for (const rel of manifest.specs) {
      const abs = path.join(siteRoot, rel);
      expect(fs.existsSync(abs), `missing ${rel}`).toBe(true);
      expect(rel.startsWith("tests/e2e/")).toBe(true);
      expect(rel.endsWith(".spec.ts")).toBe(true);
    }
  });

  it("pack covers W3 W4 journey and save honesty by filename", () => {
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as Manifest;
    const joined = manifest.specs.join("\n");
    expect(joined).toMatch(/open3d-world-standard-journey\.spec\.ts/);
    expect(joined).toMatch(/open3d-w3-select-delete\.spec\.ts/);
    expect(joined).toMatch(/open3d-w4-orbit-continuity\.spec\.ts/);
    expect(joined).toMatch(/open3d-w5-save-honesty\.spec\.ts/);
  });

  it("gates map keys W3/W4 (and pack peers) resolve into declared specs", () => {
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as Manifest;
    expect(manifest.gates, "manifest.gates required for W-gate lookup").toBeDefined();
    const gates = manifest.gates as Record<string, string>;
    expect(gates.W3).toBe("open3d-w3-select-delete.spec.ts");
    expect(gates.W4).toBe("open3d-w4-orbit-continuity.spec.ts");
    expect(gates["W1-W2"]).toBe("open3d-world-standard-journey.spec.ts");
    expect(gates["W5-W6"]).toBe("open3d-w5-save-honesty.spec.ts");
    const basenames = new Set(
      manifest.specs.map((rel) => path.basename(rel)),
    );
    for (const [gateId, basename] of Object.entries(gates)) {
      expect(basename.endsWith(".spec.ts"), `${gateId} target`).toBe(true);
      expect(
        basenames.has(basename),
        `gate ${gateId} → ${basename} not in specs[]`,
      ).toBe(true);
    }
  });

  it("runner script and package.json scripts exist", () => {
    expect(fs.existsSync(runnerPath), runnerPath).toBe(true);
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["test:e2e:open3d-world"]).toBeTruthy();
    expect(pkg.scripts["gate:open3d"]).toBeTruthy();
    expect(pkg.scripts["test:e2e:open3d-world"]).toContain(
      "run-open3d-world-e2e.mjs",
    );
  });
});
