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

describe("publishMultipath — chaise-lounge-001", () => {
  it("compileSvgForPublish emits one pathish element per block (inventory preview)", async () => {
    const raw = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "block-descriptors/chaise-lounge-001.json"),
        "utf8",
      ),
    );
    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const svg = result.svg;
    expect(countPathish(svg)).toBeGreaterThanOrEqual(2);
    expect(svg).toContain('id="seat-block"');
    expect(svg).toContain('id="backrest-block"');
  });
});