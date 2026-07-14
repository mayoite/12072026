import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { RenderBlockPrims } from "@/features/planner/catalog-api/renderBlockPrims";
import { blockToSvg } from "@/lib/catalog/blocks2d";
import { sanitizeInlineSvg } from "@/lib/security/sanitize";

vi.mock("@/lib/catalog/blocks2d", () => ({
  blockToSvg: vi
    .fn()
    .mockReturnValue(
      '<svg width="100" height="100"><script>alert(1)</script><circle cx="50" cy="50" r="40" /></svg>',
    ),
}));

vi.mock("@/lib/security/sanitize", () => ({
  sanitizeInlineSvg: vi.fn((svg: string) =>
    svg.replace(/<script[\s\S]*?<\/script>/gi, ""),
  ),
}));

describe("RenderBlockPrims", () => {
  it("returns null if prims are empty", () => {
    const { container } = render(
      <RenderBlockPrims prims={[]} width={100} height={100} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("sanitizes SVG markup before DOM injection", () => {
    const prims = [{ kind: "circle" }] as never[];
    const { container } = render(
      <RenderBlockPrims prims={prims} width={200} height={150} />,
    );

    expect(blockToSvg).toHaveBeenCalled();
    expect(sanitizeInlineSvg).toHaveBeenCalled();
    const html = container.querySelector(".pw-catalog-block-preview")?.innerHTML ?? "";
    expect(html).not.toMatch(/<script/i);
    expect(html).toMatch(/<circle/i);
  });
});
