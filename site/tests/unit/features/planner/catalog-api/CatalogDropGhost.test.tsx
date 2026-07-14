import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CatalogDropGhost } from "@/features/planner/catalog-api/CatalogDropGhost";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";

vi.mock("@/features/planner/catalog-api/CatalogBlockPreview", () => ({
  CatalogBlockPreview: () => <div data-testid="block-preview" />,
}));

const item: CatalogItem = {
  id: "desk-1",
  name: "Buddy Task Desk",
  shortName: "Task Desk",
  category: "desks",
  shapeType: "planner-desk",
  widthMm: 120,
  heightMm: 60,
  depthMm: 60,
  description: "desk",
  tags: [],
};

describe("CatalogDropGhost", () => {
  it("renders label and preview with position and validity", () => {
    const { container } = render(
      <CatalogDropGhost item={item} x={50} y={80} width={60} height={40} valid />,
    );
    const ghost = container.querySelector(".pw-drop-ghost");
    expect(ghost).not.toBeNull();
    expect(ghost?.getAttribute("data-valid")).toBe("true");
    expect((ghost as HTMLElement).style.left).toBe("50px");
    expect((ghost as HTMLElement).style.top).toBe("80px");
    expect((ghost as HTMLElement).style.width).toBe("80px");
    expect((ghost as HTMLElement).style.height).toBe("68px");
    expect(screen.getByText("Task Desk")).toBeInTheDocument();
    expect(screen.getByTestId("block-preview")).toBeInTheDocument();
  });

  it("falls back to full name when shortName missing", () => {
    const { shortName: _s, ...noShort } = item;
    render(
      <CatalogDropGhost item={noShort} x={0} y={0} width={40} height={20} valid={false} />,
    );
    expect(screen.getByText("Buddy Task Desk")).toBeInTheDocument();
  });
});
