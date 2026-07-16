import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { AdminSvgStudioSidebar } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgStudioSidebar";

const stageMeta = {
  identity: "side-table-001 · SKU OFL-TBL-001",
  footprint: "Footprint 600×600 mm",
  draft: "In sync with published",
  validation: "Draft ready",
  revision: "Last published today",
};

describe("AdminSvgStudioSidebar", () => {
  it("renders geometry inputs and full stage meta", () => {
    render(
      <AdminSvgStudioSidebar
        geometry={{ widthMm: 600, depthMm: 600, heightMm: 750 }}
        stageMeta={stageMeta}
        onGeometryChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("admin-svg-stage-sidebar")).toBeInTheDocument();
    expect(screen.getByText("Footprint (mm)")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("600")).toHaveLength(2);
    expect(screen.getByDisplayValue("750")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-stage-meta")).toHaveTextContent(
      /Footprint 600/,
    );
    expect(screen.getByTestId("admin-svg-stage-meta")).toHaveTextContent(
      /Draft ready/,
    );
    expect(screen.getByTestId("admin-svg-stage-meta")).toHaveTextContent(
      /Last published/,
    );
    expect(
      screen.getByLabelText("Footprint width in millimetres"),
    ).toBeInTheDocument();
  });

  it("shows empty string for zero dimensions", () => {
    render(
      <AdminSvgStudioSidebar
        geometry={{ widthMm: 0, depthMm: 0, heightMm: 0 }}
        stageMeta={stageMeta}
        onGeometryChange={vi.fn()}
      />,
    );
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(3);
    for (const input of inputs) {
      expect(input).toHaveValue(null);
    }
  });

  it("emits geometry change for width field", () => {
    const onGeometryChange = vi.fn();
    render(
      <AdminSvgStudioSidebar
        geometry={{ widthMm: 600, depthMm: 600, heightMm: 750 }}
        stageMeta={stageMeta}
        onGeometryChange={onGeometryChange}
      />,
    );

    const width = screen.getByLabelText("Footprint width in millimetres");
    fireEvent.change(width, { target: { value: "800" } });
    expect(onGeometryChange).toHaveBeenCalledWith({
      widthMm: 800,
      depthMm: 600,
      heightMm: 750,
    });
  });

  it("stops keydown/keyup propagation so studio does not steal keys", () => {
    const parentKey = vi.fn();
    render(
      <div onKeyDown={parentKey} onKeyUp={parentKey}>
        <AdminSvgStudioSidebar
          geometry={{ widthMm: 600, depthMm: 600, heightMm: 750 }}
          stageMeta={stageMeta}
          onGeometryChange={vi.fn()}
        />
      </div>,
    );
    const sidebar = screen.getByTestId("admin-svg-stage-sidebar");
    fireEvent.keyDown(sidebar, { key: "Delete" });
    fireEvent.keyUp(sidebar, { key: "Delete" });
    expect(parentKey).not.toHaveBeenCalled();
  });
});
