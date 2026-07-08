/**
 * Documents single publish compile authority + V1 reference-only marker.
 * Does not delete or rewrite V1 — only asserts ownership strings and stages.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  COMPILE_AUTHORITY,
  PUBLISH_COMPILE_AUTHORITY,
  PUBLISH_SVG_COMPILE_STAGES,
  V1_COMPILE_AUTHORITY,
  listSvgStages,
} from "@/features/planner/asset-engine";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { compileAuthority as v1CompileAuthority } from "@/features/planner/open3d/catalog/svg/svgCompiler.server";

// tests/unit/features/planner/asset-engine → site/
const siteRoot = path.resolve(__dirname, "../../../../../");

describe("SVG compile authority (publish vs V1)", () => {
  it("documents publish authority as pipelineCore+normalize", () => {
    expect(PUBLISH_COMPILE_AUTHORITY).toBe("pipelineCore+normalize");
    expect(COMPILE_AUTHORITY.publish).toBe(PUBLISH_COMPILE_AUTHORITY);
    expect(COMPILE_AUTHORITY.publishEntries.normalize).toContain(
      "normalizeDescriptorForPipeline",
    );
    expect(COMPILE_AUTHORITY.publishEntries.compile).toContain("pipelineCore");
    expect(COMPILE_AUTHORITY.publishEntries.orderedApi).toContain(
      "compileSvgForPublish",
    );
  });

  it("marks V1 compiler as v1-reference-only (not deleted, not publish)", () => {
    expect(V1_COMPILE_AUTHORITY).toBe("v1-reference-only");
    expect(COMPILE_AUTHORITY.v1).toBe("v1-reference-only");
    expect(v1CompileAuthority).toBe("v1-reference-only");
    expect(COMPILE_AUTHORITY.v1Entry).toContain("svgCompiler.server");
  });

  it("lists publish compile stages S1–S3 in registry", () => {
    expect([...PUBLISH_SVG_COMPILE_STAGES]).toEqual([
      "svg-s1-normalize",
      "svg-s2-compile",
      "svg-s3-sanitize-optimize",
    ]);

    const svgStages = listSvgStages();
    for (const id of PUBLISH_SVG_COMPILE_STAGES) {
      const stage = svgStages.find((s) => s.id === id);
      expect(stage, `missing stage ${id}`).toBeDefined();
      expect(stage?.status).toBe("implemented");
    }

    const compile = svgStages.find((s) => s.id === "svg-s2-compile");
    expect(compile?.entry).toMatch(/pipelineCore/);
    expect(compile?.entry).not.toMatch(/svgCompiler\.server/);
    expect(compile?.note).toMatch(/v1-reference-only/i);
  });

  it("compileSvgForPublish is THE no-I/O publish entry (same stages as runSvgCompileStages)", async () => {
    const adminPath = path.join(siteRoot, "block-descriptors", "side-table-001.json");
    const raw = JSON.parse(readFileSync(adminPath, "utf8")) as unknown;

    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.stages).toEqual(
      expect.arrayContaining([...PUBLISH_SVG_COMPILE_STAGES]),
    );
    expect(result.svg).toContain("<svg");
    expect(result.svg.length).toBeGreaterThan(80);
  });
});
