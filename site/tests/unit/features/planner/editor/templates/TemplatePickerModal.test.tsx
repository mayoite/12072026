import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TemplatePickerModal, buildTemplatePreview } from "@/features/planner/editor/templates/TemplatePickerModal";
import { LAYOUT_TEMPLATES } from "@/features/planner/templates/layoutTemplates";

vi.mock("@/features/planner/templates/layoutTemplates", () => ({
  LAYOUT_TEMPLATES: [
    {
      id: "tpl-1",
      name: "Small Team Office",
      description: "A compact layout for 4 people",
      category: "office",
      totalSeats: 4,
      recommendedRoomSize: { minWidth: 1000, minHeight: 800 },
      shapes: [
        { type: "zone", x: 0.1, y: 0.1, widthMm: 200, heightMm: 200 },
        { type: "desk", x: 0.3, y: 0.3, widthMm: 120, heightMm: 80 },
      ],
    },
  ],
}));

vi.mock("@/features/planner/catalog/shapeTypeRegistry", () => ({
  isCatalogShapeType: vi.fn().mockImplementation((type, match) => type === match),
  isRoomCatalogShapeType: vi.fn().mockReturnValue(false),
  PlannerCatalogShapeType: { zone: "zone", room: "room" },
}));

describe("TemplatePickerModal", () => {
  it("builds correct SVG preview layout coordinates", () => {
    const preview = buildTemplatePreview(LAYOUT_TEMPLATES[0]);
    expect(preview.viewBoxHeight).toBe(80); // 800 * (100 / 1000)
    expect(preview.rects).toHaveLength(3); // room backdrop + 2 shapes
  });

  it("calls onApply when template selected and applied", () => {
    const mockClose = vi.fn();
    const mockApply = vi.fn();

    render(
      <TemplatePickerModal
        isOpen={true}
        onClose={mockClose}
        onApply={mockApply}
      />
    );

    expect(screen.getByText("Small Team Office")).toBeInTheDocument();

    const card = screen.getByRole("button", { name: /Small Team Office/ });
    fireEvent.click(card);

    const applyBtn = screen.getByRole("button", { name: "Apply template" });
    fireEvent.click(applyBtn);

    expect(mockApply).toHaveBeenCalledWith(LAYOUT_TEMPLATES[0]);
    expect(mockClose).toHaveBeenCalled();
  });
});
