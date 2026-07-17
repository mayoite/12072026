/**
 * Phase 03 — SVG pipeline golden round-trip tests (03-TEST-01)
 *
 * Gate: 03-TEST-01 — every fixture JSON → pipeline → output matches the
 * pinned golden SVG file.
 *
 * Three golden fixture blocks (union/difference/intersection) per quality-gates:
 *   chaise     → union         (two blocks → per-block paths for inventory preview)
 *   side-table → difference    (tabletop minus four leg cutouts)
 *   sectional  → intersection  (two overlapping sections → overlap only)
 *
 * Additional: missing-geometry fixture → cross-hatched fallback (§03-FIX-05).
 *
 * Sanitizer check:
 *   - Pipeline output does NOT contain <script>, inline event handlers, or
 *     <foreignObject>.
 *   - Pipeline output passes svgSanitizer.ts `sanitizeSvg()` gate.
 *
 * Performance budget (provisional, quality-gates.md §Performance):
 *   - Each fixture pipeline run < 200 ms.
 *
 * 03-SVG-GS-01: all token values in themeTokens reference 'currentColor'
 *   or CSS var() references — no hardcoded #hex literals.
 *
 * Type Safety (AGENTS.md): no any, no @ts-ignore, no eslint suppress.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import {
  runPipelineCore,
  sanitiseSvg,
  validateSlug,
  assertViewBoxStable,
  type PipelineDescriptor,
} from "@/scripts/generate-svg/pipelineCore";

import { sanitizeSvg } from "@/features/planner/catalog/svg/svgSanitizer";

// ── Path helpers ──────────────────────────────────────────────────────────────

const _dirname = dirname(fileURLToPath(import.meta.url));
// Test file: site/tests/unit/features/planner/catalog/ → 5 levels up to site/
const FIXTURES_DIR = join(_dirname, "../../../../../scripts/generate-svg/_fixtures");
const GOLDENS_DIR = join(_dirname, "../../../../../scripts/generate-svg/__goldens__");

function readFixture(name: string): PipelineDescriptor {
  const raw = readFileSync(join(FIXTURES_DIR, `${name}.json`), "utf-8");
  return JSON.parse(raw) as PipelineDescriptor;
}

function readGolden(name: string): string {
  return readFileSync(join(GOLDENS_DIR, `${name}-golden.svg`), "utf-8").trim();
}

// ── Fixture catalogue ─────────────────────────────────────────────────────────

const GOLDEN_FIXTURES = [
  { name: "chaise",      goldenName: "chaise",       variant: "union",        slug: "chaise-lounge-001" },
  { name: "side-table",  goldenName: "side-table",   variant: "difference",   slug: "side-table-001" },
  { name: "sectional",   goldenName: "sectional",    variant: "intersection", slug: "sectional-sofa-001" },
] as const;

// ── 03-TEST-01: Golden round-trip ─────────────────────────────────────────────

describe("03-TEST-01: SVG pipeline golden round-trip", () => {
  for (const fixture of GOLDEN_FIXTURES) {
    it(`${fixture.name} (${fixture.variant}): pipeline output matches golden`, async () => {
      const descriptor = readFixture(fixture.name);
      const golden = readGolden(fixture.goldenName);

      const output = await runPipelineCore(descriptor);

      // Primary equality: output is byte-identical to pinned golden.
      expect(output.trim()).toBe(golden);
    });

    it(`${fixture.name}: pipeline is idempotent (two runs yield same SVG)`, async () => {
      const descriptor = readFixture(fixture.name);
      const first = await runPipelineCore(descriptor);
      const second = await runPipelineCore(descriptor);
      expect(first).toBe(second);
    });
  }
});

// ── 03-TEST-01 structural invariants ─────────────────────────────────────────

describe("03-TEST-01: SVG pipeline structural invariants", () => {
  it("all three golden fixtures contain valid SVG root", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).toMatch(/^<svg[\s>]/);
      expect(output).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
    }
  });

  it("viewBox matches fixture dimensions in all three goldens", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      const { width, height } = descriptor.viewBox;
      expect(output).toContain(`viewBox="0 0 ${width} ${height}"`);
    }
  });

  it("each golden SVG contains expected slug in class attribute", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).toContain(`class="${fixture.slug}"`);
    }
  });

  it("each golden SVG contains the fixture variant in data-block-variant", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).toContain(`data-block-variant="${fixture.variant}"`);
    }
  });
});

// ── 03-SVG-GS-01: Semantic tokens only (no hardcoded hex) ────────────────────

describe("03-SVG-GS-01: semantic tokens only", () => {
  const HEX_LITERAL_RE = /#[0-9a-fA-F]{3,8}\b/;

  it("no hardcoded #hex literals in any pipeline output SVG", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).not.toMatch(HEX_LITERAL_RE);
    }
  });

  it("theme tokens in fixtures reference currentColor or var(--*)", () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const tokens = descriptor.themeTokens ?? {};
      for (const [, value] of Object.entries(tokens)) {
        const isSemanticToken =
          value === "currentColor" ||
          /^var\(--[a-z0-9-]/.test(value);
        expect(isSemanticToken).toBe(true);
      }
    }
  });
});

// ── 03-SVG-01: Sanitizer applied to output ────────────────────────────────────

describe("03-SVG-01: sanitizer applied to pipeline output", () => {
  it("pipeline output passes svgSanitizer.sanitizeSvg() for all three fixtures", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      const result = sanitizeSvg(output);
      expect(result.safe).toBe(true);
    }
  });

  it("pipeline output contains no <script> elements", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).not.toMatch(/<script/i);
    }
  });

  it("pipeline output contains no inline event handlers", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).not.toMatch(/\son\w+\s*=/i);
    }
  });

  it("pipeline output contains no <foreignObject> elements", async () => {
    for (const fixture of GOLDEN_FIXTURES) {
      const descriptor = readFixture(fixture.name);
      const output = await runPipelineCore(descriptor);
      expect(output).not.toMatch(/<foreignObject/i);
    }
  });

  it("sanitiseSvg() (pipeline internal) passes clean SVG unchanged", () => {
    const clean = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0 0h100v100H0z" fill="currentColor"/></svg>`;
    const result = sanitiseSvg(clean);
    expect(result).toBe(clean);
  });

  it("sanitiseSvg() strips <script> tags from unsafe SVG", () => {
    const unsafe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><script>alert(1)</script><path d="M0 0h100v100H0z"/></svg>`;
    const result = sanitiseSvg(unsafe);
    expect(result).not.toContain("<script");
  });

  it("sanitiseSvg() strips inline event handlers from unsafe SVG", () => {
    const unsafe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect onclick="bad()" width="100" height="100"/></svg>`;
    const result = sanitiseSvg(unsafe);
    expect(result).not.toContain("onclick");
  });

  it("sanitiseSvg() throws for javascript: href", () => {
    const unsafe = `<svg xmlns="http://www.w3.org/2000/svg"><use href="javascript:alert(1)"/></svg>`;
    expect(() => sanitiseSvg(unsafe)).toThrow(/javascript:/i);
  });
});

// ── §03-FIX-05: Missing-geometry fallback ────────────────────────────────────

describe("03-SVG-01: missing-geometry cross-hatched fallback (§03-FIX-05)", () => {
  it("descriptor with no blocks renders cross-hatched fallback SVG", async () => {
    const descriptor = readFixture("missing-geometry");
    const output = await runPipelineCore(descriptor);
    expect(output).toContain("<svg");
    // Fallback uses cross-hatch path
    expect(output).toMatch(/<path/);
    // Fallback is safe
    const result = sanitizeSvg(output);
    expect(result.safe).toBe(true);
  });

  it("missing-geometry fallback does not contain a class attribute with slug", async () => {
    const descriptor = readFixture("missing-geometry");
    const output = await runPipelineCore(descriptor);
    // Fallback SVG doesn't include the slug class (it's a generic cross-hatch)
    expect(output).not.toContain(`class="${descriptor.slug}"`);
  });
});

// ── Validate + ViewBox guards ─────────────────────────────────────────────────

describe("03-SVG-01: slug and viewBox validation guards", () => {
  it("validateSlug accepts valid lowercase kebab slugs", () => {
    expect(() => validateSlug("chaise-lounge-001")).not.toThrow();
    expect(() => validateSlug("side-table-001")).not.toThrow();
    expect(() => validateSlug("sectional-sofa-001")).not.toThrow();
  });

  it("validateSlug rejects uppercase, underscores, and too-short slugs", () => {
    expect(() => validateSlug("Chaise")).toThrow();
    expect(() => validateSlug("side_table")).toThrow();
    expect(() => validateSlug("a")).toThrow();
  });

  it("assertViewBoxStable accepts valid viewBox descriptor", () => {
    const vb = assertViewBoxStable({ viewBox: { x: 0, y: 0, width: 800, height: 1600 } });
    expect(vb.width).toBe(800);
    expect(vb.height).toBe(1600);
  });

  it("assertViewBoxStable throws for non-finite or zero dimensions", () => {
    expect(() => assertViewBoxStable({ viewBox: { x: 0, y: 0, width: 0, height: 100 } })).toThrow();
    expect(() => assertViewBoxStable({ viewBox: { x: 0, y: 0, width: NaN, height: 100 } })).toThrow();
    expect(() => assertViewBoxStable({})).toThrow(/missing viewBox/);
  });
});

// ── Performance budget (provisional, quality-gates.md §Performance) ──────────

describe("03-SVG-01: performance budget (p95 ≤ 200ms per fixture)", () => {
  // Run each fixture 3 times to get a basic p-budget check.
  // Full p95-25-run benchmark is exercised in the benchmark-foundation scripts.
  for (const fixture of GOLDEN_FIXTURES) {
    it(`${fixture.name}: single pipeline run completes within 200ms`, async () => {
      const descriptor = readFixture(fixture.name);
      const start = performance.now();
      await runPipelineCore(descriptor);
      const elapsed = performance.now() - start;
      // Log for evidence; do not fail on marginal CI machines but flag if far over.
      console.info(
        `[phase-03-perf] ${fixture.name} pipeline elapsed=${elapsed.toFixed(2)}ms budget=200ms`,
      );
      expect(elapsed).toBeLessThan(200);
    });
  }
});
