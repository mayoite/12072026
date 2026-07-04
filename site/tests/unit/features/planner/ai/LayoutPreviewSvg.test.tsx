import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { LayoutPreviewSvg } from "@/features/planner/ai/LayoutPreviewSvg";
import { buildLayoutPreviewModel } from "@/features/planner/ai/layoutPreviewBounds";

vi.mock("@/features/planner/ai/aiAdvisorConfig", () => ({
  ZONE_PREVIEW_COLORS: {
    focus: { fill: "rgb(255, 0, 0)", stroke: "rgb(0, 255, 0)" },
    collaboration: { fill: "rgb(0, 0, 255)", stroke: "rgb(255, 255, 0)" },
  },
}));

vi.mock("@/features/planner/ai/layoutPreviewBounds", () => ({
  buildLayoutPreviewModel: vi.fn(),
}));

describe("LayoutPreviewSvg", () => {
  it("renders correctly with room, zones, walls, and furniture", () => {
    vi.mocked(buildLayoutPreviewModel).mockReturnValue({
      bounds: { x: 0, y: 0, w: 100, h: 100 },
      room: { x: 10, y: 10, w: 80, h: 80 },
      zones: [
        { x: 20, y: 20, w: 20, h: 20, label: "Focus Zone", zoneType: "focus" },
      ],
      furniture: [
        { x: 30, y: 30, w: 10, h: 10, label: "Chair", catalogItemId: "sku-chair" },
      ],
      walls: [
        { x1: 0, y1: 0, x2: 100, y2: 0 },
      ],
    });

    const mockLayout = { room: {} } as any;
    const { container } = render(<LayoutPreviewSvg layout={mockLayout} />);

    // Verify SVGs are rendered
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    // Verify room is rendered as a rect
    const rects = container.querySelectorAll("rect");
    // Should have 1 room, 1 zone, 1 furniture = 3 rects
    expect(rects.length).toBe(3);

    // Verify walls are rendered as line
    const line = container.querySelector("line");
    expect(line).toBeInTheDocument();
  });
});
