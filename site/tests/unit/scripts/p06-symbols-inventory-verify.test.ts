// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/p06-symbols-inventory-verify.mjs",
);

describe("p06-symbols-inventory-verify (name-mirror)", () => {
  it("targets guest planner with inventory check keys", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("/planner/guest/");
    expect(src).toContain("06-symbols-inventory");
    expect(src).toContain("apiFiveDescriptors");
    expect(src).toContain("chaise-lounge-001");
    expect(src).toContain("desk-linear-1200-001");
    expect(src).toContain("symbolsCategoryVisible");
    expect(src).toContain("chaisePlaced");
    expect(src).toContain("deskPlaced");
  });

  it("writes run.json evidence under world-standard-wave path", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("run.json");
    expect(src).toContain("world-standard-wave");
    expect(src).toContain("06-symbols-inventory");
    expect(src).toContain('status: overallPass ? "pass" : "fail"');
  });
});
