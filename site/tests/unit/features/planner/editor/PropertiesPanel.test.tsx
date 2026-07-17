import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PropertiesPanel } from "@/features/planner/editor/PropertiesPanel";

describe("PropertiesPanel", () => {
  it("renders empty state without selection", () => {
    const { container } = render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        onUpdateEntity={vi.fn()}
        onDeleteEntity={vi.fn()}
      />,
    );
    expect(container.firstChild).not.toBeNull();
    expect((container.textContent ?? "").length).toBeGreaterThan(0);
  });

  it("edits opening position as an exact host-wall offset", () => {
    const onUpdateEntity = vi.fn();
    render(
      <PropertiesPanel
        selectedEntity={{
          collection: "doors",
          id: "door-1",
          entity: {
            id: "door-1",
            wallId: "wall-1",
            position: 0.5,
            width: 900,
            height: 2100,
            type: "single",
            swingDirection: "left",
            flipSide: false,
          },
        }}
        displayUnit="mm"
        hostWallLengthMm={4000}
        callbacks={{ onUpdateEntity }}
      />,
    );

    const offset = screen.getByLabelText("Wall offset");
    expect(offset).toHaveValue("2000");
    fireEvent.change(offset, { target: { value: "2500" } });
    fireEvent.keyDown(offset, { key: "Enter" });
    expect(onUpdateEntity).toHaveBeenCalledWith("doors", "door-1", {
      position: 0.625,
    });
  });
});
