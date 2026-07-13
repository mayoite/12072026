import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { runSvgCompileStages } from "@/features/planner/asset-engine/svg/runSvgCompileStages";

// tests/unit/features/planner/asset-engine → site/
const siteRoot = path.resolve(__dirname, "../../../../../");

describe("runSvgCompileStages (SVG S1–S3)", () => {
  it("compiles admin-shaped side-table BlockDescriptor to non-empty SVG", async () => {
    const adminPath = path.join(siteRoot, "block-descriptors", "side-table-001.json");
    const raw = JSON.parse(readFileSync(adminPath, "utf8")) as unknown;

    const result = await runSvgCompileStages(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.stages).toContain("svg-s1-normalize");
    expect(result.stages).toContain("svg-s2-compile");
    expect(result.normalized.variant).toBe("difference");
    expect(result.normalized.blocks.every((b) => b.height > 0)).toBe(true);
    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain("path");
    expect(result.svg.length).toBeGreaterThan(80);
  });

  it("admin side-table via runSvgCompileStages still works (authority gate)", async () => {
    const adminPath = path.join(siteRoot, "block-descriptors", "side-table-001.json");
    const raw = JSON.parse(readFileSync(adminPath, "utf8")) as unknown;

    const viaStages = await runSvgCompileStages(raw);
    const viaPublish = await compileSvgForPublish(raw);

    expect(viaStages.ok).toBe(true);
    expect(viaPublish.ok).toBe(true);
    if (!viaStages.ok || !viaPublish.ok) return;

    expect(viaPublish.stages).toEqual(viaStages.stages);
    expect(viaPublish.svg).toBe(viaStages.svg);
    expect(viaPublish.normalized.slug).toBe("side-table-001");
    expect(viaPublish.normalized.blocks.length).toBe(7);
    expect(viaPublish.normalized.variant).toBe("difference");
    expect(viaPublish.svg.length).toBeGreaterThan(80);
  });

  it("compiles legacy CLI fixture without regression", async () => {
    const fixturePath = path.join(
      siteRoot,
      "scripts",
      "generate-svg",
      "_fixtures",
      "side-table.json",
    );
    const raw = JSON.parse(readFileSync(fixturePath, "utf8")) as unknown;
    const result = await runSvgCompileStages(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.svg).toContain("<svg");
  });
});
