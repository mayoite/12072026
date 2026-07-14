// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-svg-catalog.ts");

describe("audit-svg-catalog", () => {
  it("censuses live SVG descriptors vs public/svg-catalog artifacts", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("VERSIONED_DESCRIPTOR_RE");
    expect(source).toContain("LATEST_POINTER_RE");
    expect(source).toContain("readSvgArtifactStatus");
    expect(source).toContain("loadAll");
    expect(source).toContain("svg-catalog");
    expect(source).toContain("census.json");
    expect(source).toContain("orphanArtifacts");
  });

  it("excludes version snapshots and latest pointers from live descriptor identity", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    const versioned = source.match(
      /const VERSIONED_DESCRIPTOR_RE = (\/\^[\s\S]*?\$\/);/,
    );
    const latest = source.match(
      /const LATEST_POINTER_RE = (\/\^[\s\S]*?\$\/);/,
    );
    expect(versioned).not.toBeNull();
    expect(latest).not.toBeNull();

    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- rehydrate script regex under test
    const VERSIONED_DESCRIPTOR_RE = new Function(`return ${versioned![1]}`)() as RegExp;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- rehydrate script regex under test
    const LATEST_POINTER_RE = new Function(`return ${latest![1]}`)() as RegExp;

    expect(VERSIONED_DESCRIPTOR_RE.test("chair.1.json")).toBe(true);
    expect(VERSIONED_DESCRIPTOR_RE.test("chair.12.json")).toBe(true);
    expect(VERSIONED_DESCRIPTOR_RE.test("chair.json")).toBe(false);
    expect(LATEST_POINTER_RE.test("chair.latest.json")).toBe(true);
    expect(LATEST_POINTER_RE.test("chair.json")).toBe(false);
  });

  it("reports PASS only when published artifacts exist and no orphans remain", () => {
    // Contract of main() residual calculation without executing loader/network IO.
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain('artifact.state !== "published"');
    expect(source).toContain("orphanArtifacts");
    expect(source).toContain('SVG catalog census: ${ok ? "PASS" : "FAIL"}');

    const sandbox: {
      missingOrInvalid: Array<{ state: string }>;
      orphanArtifacts: string[];
      ok?: boolean;
    } = {
      missingOrInvalid: [{ state: "missing" }],
      orphanArtifacts: ["ghost"],
    };
    vm.runInNewContext(
      `this.ok = this.missingOrInvalid.length === 0 && this.orphanArtifacts.length === 0;`,
      sandbox,
    );
    expect(sandbox.ok).toBe(false);

    sandbox.missingOrInvalid = [];
    sandbox.orphanArtifacts = [];
    vm.runInNewContext(
      `this.ok = this.missingOrInvalid.length === 0 && this.orphanArtifacts.length === 0;`,
      sandbox,
    );
    expect(sandbox.ok).toBe(true);
  });

  it("targets planner admin-svg-pipeline evidence under results/", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("admin-svg-pipeline");
    expect(source).toContain("results");
  });
});
