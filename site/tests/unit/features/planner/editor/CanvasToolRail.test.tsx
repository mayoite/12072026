import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";

describe("CanvasToolRail", () => {
  it("renders live tool controls with accessible names", () => {
    render(<CanvasToolRail activeTool="select" onToolChange={vi.fn()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(3);
    const labels = radios.map((el) => el.getAttribute("aria-label") ?? "");
    expect(labels.some((l) => /select/i.test(l))).toBe(true);
    expect(labels.some((l) => /wall/i.test(l))).toBe(true);
    expect(document.querySelector('[data-testid="canvas-tool-wall"]')).not.toBeNull();
  });
});
