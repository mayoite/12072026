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
import {
  compileSvgForPublish,
  PUBLISH_COMPILE_AUTHORITY as PUBLISH_FROM_ENTRY,
} from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { compileAuthority as v1CompileAuthority } from "@/features/planner/catalog/svg/svgCompiler.server";

// tests/unit/features/planner/asset-engine → site/
const siteRoot = path.resolve(__dirname, "../../../../../");

describe("SVG compile authority (publish vs V1)", () => {
  it("documents publish authority as pipelineCore+normalize", () => {
    expect(PUBLISH_COMPILE_AUTHORITY).toBe("pipelineCore+normalize");
    expect(PUBLISH_FROM_ENTRY).toBe(PUBLISH_COMPILE_AUTHORITY);
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
    // Publish and V1 authority strings must stay distinct
    expect(PUBLISH_COMPILE_AUTHORITY).not.toBe(V1_COMPILE_AUTHORITY);
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
    const adminPath = path.join(siteRoot, "inventory", "descriptors", "side-table-001.json");
    const raw = JSON.parse(readFileSync(adminPath, "utf8")) as unknown;

    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");

    expect(result.stages).toEqual(
      expect.arrayContaining([...PUBLISH_SVG_COMPILE_STAGES]),
    );
    expect(result.svg).toContain("<svg");
    expect(result.svg.length).toBeGreaterThan(80);
  });

  it("compileSvgForPublish fails closed on missing slug (S1)", async () => {
    const result = await compileSvgForPublish({
      viewBox: { x: 0, y: 0, width: 10, height: 10 },
      blocks: [{ x: 0, y: 0, width: 10, height: 10 }],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failedAt).toBe("svg-s1-normalize");
    expect(result.error).toMatch(/slug/i);
    expect(result.stages).toContain("svg-s1-normalize");
  });

  it("compileSvgForPublish fails closed on non-object descriptor", async () => {
    const result = await compileSvgForPublish(null);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.failedAt).toBe("svg-s1-normalize");
    expect(result.error).toMatch(/object/i);
  });

  it("compileSvgForPublish succeeds for minimal single-block admin shape", async () => {
    const result = await compileSvgForPublish({
      slug: "unit-box-001",
      variant: "fixed",
      viewBox: { x: 0, y: 0, width: 100, height: 80 },
      blocks: [{ x: 0, y: 0, width: 100, depth: 80 }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.normalized.slug).toBe("unit-box-001");
    expect(result.normalized.variant).toBe("union");
    expect(result.normalized.blocks[0]?.height).toBe(80);
    expect(result.stages).toEqual([...PUBLISH_SVG_COMPILE_STAGES]);
    expect(result.svg).toMatch(/<svg[\s>]/i);
    expect(result.svg.length).toBeGreaterThan(40);
  });

  it("publish entries never point orderedApi at V1 svgCompiler.server", () => {
    expect(COMPILE_AUTHORITY.publishEntries.orderedApi).not.toMatch(
      /svgCompiler\.server/,
    );
    expect(COMPILE_AUTHORITY.publishEntries.compile).not.toMatch(
      /svgCompiler\.server/,
    );
    expect(COMPILE_AUTHORITY.v1Entry).toMatch(/svgCompiler\.server/);
  });
});
