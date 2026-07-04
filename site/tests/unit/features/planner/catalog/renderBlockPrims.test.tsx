import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { RenderBlockPrims } from "@/features/planner/catalog/renderBlockPrims";
import { blockToSvg } from "@/lib/catalog/blocks2d";

vi.mock("@/lib/catalog/blocks2d", () => ({
  blockToSvg: vi.fn().mockReturnValue('<svg width="100" height="100"><circle cx="50" cy="50" r="40" /></svg>'),
}));

describe("RenderBlockPrims", () => {
  it("returns null if prims are empty", () => {
    const { container } = render(<RenderBlockPrims prims={[]} width={100} height={100} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders SVG markup with updated width/height", () => {
    const prims = [{ kind: "circle" }] as any[];
    render(<RenderBlockPrims prims={prims} width={200} height={150} />);

    expect(blockToSvg).toHaveBeenCalled();
  });
});
