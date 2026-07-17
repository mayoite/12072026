// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  PlannerPipelineError,
  assertViewBoxStable,
  blockToPolygon,
  buildFallbackSvg,
  buildSvgString,
  polygonsToPath,
  runPipelineCore,
  sanitiseSvg,
  validateSlug,
} from "@/scripts/generate-svg/pipelineCore";

describe("pipelineCore (name-mirror)", () => {
  it("validateSlug accepts kebab slugs and rejects invalid forms", () => {
    expect(() => validateSlug("chaise-lounge-001")).not.toThrow();
    expect(() => validateSlug("AB")).toThrow(PlannerPipelineError);
    expect(() => validateSlug("a")).toThrow(/Slug/);
  });

  it("assertViewBoxStable requires finite positive dimensions", () => {
    expect(assertViewBoxStable({ viewBox: { x: 0, y: 0, width: 100, height: 50 } })).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    });
    expect(() => assertViewBoxStable({})).toThrow(/viewBox/);
    expect(() =>
      assertViewBoxStable({ viewBox: { x: 0, y: 0, width: 0, height: 10 } }),
    ).toThrow(/positive/);
  });

  it("sanitiseSvg strips script tags and event handlers", () => {
    const dirty =
      '<svg><script>alert(1)</script><rect onclick="evil()" width="1" height="1"/></svg>';
    const clean = sanitiseSvg(dirty);
    expect(clean).not.toMatch(/<script/i);
    expect(clean).not.toMatch(/onclick/i);
    expect(clean).toContain("<rect");
  });

  it("sanitiseSvg throws on javascript: href", () => {
    expect(() =>
      sanitiseSvg('<svg><a href="javascript:alert(1)">x</a></svg>'),
    ).toThrow(/javascript:/i);
  });

  it("blockToPolygon and polygonsToPath build closed path data", () => {
    const poly = blockToPolygon({ x: 0, y: 0, width: 10, height: 5 });
    expect(poly[0]).toEqual([
      [0, 0],
      [10, 0],
      [10, 5],
      [0, 5],
    ]);
    const d = polygonsToPath(poly);
    expect(d).toMatch(/^M 0 0/);
    expect(d).toContain("Z");
  });

  it("buildSvgString embeds slug title and path", () => {
    const svg = buildSvgString(
      "demo-block",
      { x: 0, y: 0, width: 20, height: 10 },
      "M 0 0 L 20 0 L 20 10 L 0 10 Z",
      { "fill-primary": "currentColor" },
      "Demo",
      "desc",
      "union",
    );
    expect(svg).toContain('viewBox="0 0 20 10"');
    expect(svg).toContain("<title>Demo</title>");
    expect(svg).toContain('class="demo-block"');
    expect(svg).toContain('data-block-variant="union"');
    // currentColor is unsafe for Fabric/img — defaults to plan grey
    expect(svg).not.toMatch(/fill="currentColor"/i);
    expect(svg).toMatch(/fill="#[0-9a-f]{6}"/i);
  });

  it("buildSvgString uses evenodd on difference variants", () => {
    const svg = buildSvgString(
      "cutout",
      { x: 0, y: 0, width: 100, height: 100 },
      "M 0 0 L 100 0 L 100 100 L 0 100 Z M 20 20 L 20 40 L 40 40 L 40 20 Z",
      undefined,
      "Cut",
      undefined,
      "difference",
    );
    expect(svg).toContain('fill-rule="evenodd"');
  });

  it("buildFallbackSvg emits cross-hatch geometry missing marker", () => {
    const svg = buildFallbackSvg({ x: 0, y: 0, width: 100, height: 100 });
    expect(svg).toContain("Fallback - geometry missing");
    expect(svg).toContain('stroke="currentColor"');
  });

  it("runPipelineCore returns sanitized fallback when blocks are empty", async () => {
    const svg = await runPipelineCore({
      slug: "empty-block",
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      blocks: [],
    });
    expect(svg).toContain("Fallback - geometry missing");
    expect(svg).not.toMatch(/<script/i);
  });
});
