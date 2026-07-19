import { describe, expect, it } from "vitest";

import { normalizeDescriptorForPipeline } from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";

describe("custom furniture path parts through the compile pipeline", () => {
  it("normalize carries `path` scene parts as pathParts (not dropped to rects)", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "custom-sofa",
      viewBox: { x: 0, y: 0, width: 200, height: 100 },
      parts: [
        { kind: "path", id: "outline", d: "M0 0 C50 -40 150 -40 200 0 L200 100 L0 100 Z", visible: true },
      ],
    });
    expect(normalized.pathParts).toBeDefined();
    expect(normalized.pathParts?.[0]?.dPath).toContain("C50");
  });

  it("compiles an imported curved outline to SVG that keeps the path d (curve survives)", async () => {
    const result = await compileSvgForPublish({
      slug: "custom-sofa",
      viewBox: { x: 0, y: 0, width: 200, height: 100 },
      parts: [
        { kind: "path", id: "outline", d: "M0 0 C50 -40 150 -40 200 0 L200 100 L0 100 Z", visible: true },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.svg).toContain("<path");
    // The cubic bezier command must survive — proof the outline is not a bounding rect.
    expect(result.svg).toMatch(/[Cc]\s*50/);
  });

  it("converts a line part to a path so it is not lost at compile", async () => {
    const result = await compileSvgForPublish({
      slug: "custom-line",
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      parts: [
        { kind: "line", id: "edge", x1: 0, y1: 0, x2: 100, y2: 100, visible: true },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.svg).toContain("<path");
  });
});
