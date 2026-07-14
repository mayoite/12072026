import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
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
});
