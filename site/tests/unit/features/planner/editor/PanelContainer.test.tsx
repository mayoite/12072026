import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PanelContainer } from "@/features/planner/editor/PanelContainer";

describe("PanelContainer", () => {
  it("renders title and children when open and docked", () => {
    render(
      <PanelContainer
        id="left"
        title="Left panel"
        state="docked"
        width={280}
        height={600}
        x={0}
        y={0}
        zIndex={1}
        isOpen
      >
        <div>panel-body</div>
      </PanelContainer>,
    );
    expect(screen.getByText("Left panel")).toBeDefined();
    expect(screen.getByText("panel-body")).toBeDefined();
  });
});
