import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { CatalogBlockPreview } from "@/features/planner/catalog-api/CatalogBlockPreview";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";

vi.mock("@/features/planner/catalog-api/catalogBlockBridge", () => ({
  resolveCatalogItemBlock2D: vi.fn(() => null),
}));

vi.mock("@/lib/catalog/blocks2d", () => ({
  blockToSvg: vi.fn(() => '<svg width="10" height="10"></svg>'),
}));

vi.mock("@/lib/security/sanitize", () => ({
  sanitizeInlineSvg: (s: string) => s,
}));

const item: CatalogItem = {
  id: "desk-1",
  name: "Desk",
  category: "desks",
  shapeType: "planner-desk",
  widthMm: 120,
  heightMm: 60,
  depthMm: 60,
  description: "desk",
  tags: [],
};

describe("CatalogBlockPreview", () => {
  it("renders fallback box when block prims are unavailable", () => {
    const { container } = render(<CatalogBlockPreview item={item} />);
    const fallback = container.querySelector("[aria-hidden]");
    expect(fallback).not.toBeNull();
    expect(fallback?.className).toMatch(/rounded-sm/);
    const style = (fallback as HTMLElement).style;
    expect(Number.parseFloat(style.getPropertyValue("--pw-catalog-preview-width"))).toBeGreaterThan(0);
    expect(Number.parseFloat(style.getPropertyValue("--pw-catalog-preview-height"))).toBeGreaterThan(0);
  });

  it("renders svg preview when block prims resolve", async () => {
    const bridge = await import("@/features/planner/catalog-api/catalogBlockBridge");
    vi.mocked(bridge.resolveCatalogItemBlock2D).mockReturnValue({
      footprint: { L: 120, D: 60 },
      prims: [{ kind: "rect" as never }],
    } as never);

    const { container } = render(<CatalogBlockPreview item={item} />);
    const preview = container.querySelector(".pw-catalog-block-preview");
    expect(preview).not.toBeNull();
    expect(preview?.getAttribute("aria-hidden")).toBe("true");
    expect(preview?.innerHTML).toContain("svg");
  });
});
