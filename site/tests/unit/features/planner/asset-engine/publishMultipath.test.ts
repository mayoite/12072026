import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";

function countPathish(svg: string): number {
  return (
    (svg.match(/<rect\b/gi) ?? []).length +
    (svg.match(/<path\b/gi) ?? []).length +
    (svg.match(/<line\b/gi) ?? []).length
  );
}

describe("publishMultipath — oando-fluid-desk-1600 (linear-desk maker)", () => {
  it("maker compile emits ≥3 pathish elements with named pedestals", async () => {
    const raw = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "inventory/descriptors/oando-fluid-desk-1600.json"),
        "utf8",
      ),
    );
    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    const svg = result.svg;
    expect(countPathish(svg)).toBeGreaterThanOrEqual(3);
    expect(svg).toContain('id="desk-top"');
    expect(svg).toContain('id="pedestal-l"');
    expect(svg).toContain('id="pedestal-r"');
    expect(svg).not.toContain('id="desk-knee-space"');
    expect(svg).not.toMatch(/currentColor/i);
  });
});

describe("publishMultipath — oando-classy-meeting-1800 (union legs)", () => {
  it("compileSvgForPublish emits multipath filled legs, not difference holes", async () => {
    const raw = JSON.parse(
      fs.readFileSync(
        path.join(
          process.cwd(),
          "inventory/descriptors/oando-classy-meeting-1800.json",
        ),
        "utf8",
      ),
    );
    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    const svg = result.svg;
    expect(result.normalized.variant).toBe("union");
    expect(svg).toContain('data-block-variant="union"');
    expect(svg).not.toContain('data-block-variant="difference"');
    expect(svg).not.toContain('fill-rule="evenodd"');
    expect(countPathish(svg)).toBeGreaterThanOrEqual(5);
    expect(svg).toContain('id="tabletop"');
    expect(svg).toContain('id="leg-nw"');
    expect(svg).toContain('id="leg-ne"');
    expect(svg).toContain('id="leg-sw"');
    expect(svg).toContain('id="leg-se"');
    expect(svg).not.toMatch(/currentColor/i);
  });
});

describe("publishMultipath — oando-mellow-sofa-2200 (union multiparts)", () => {
  it("compileSvgForPublish emits one pathish element per block", async () => {
    const raw = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "inventory/descriptors/oando-mellow-sofa-2200.json"),
        "utf8",
      ),
    );
    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    const svg = result.svg;
    expect(countPathish(svg)).toBeGreaterThanOrEqual(4);
    expect(svg).toContain('id="seat"');
    expect(svg).toContain('id="backrest"');
  });
});
