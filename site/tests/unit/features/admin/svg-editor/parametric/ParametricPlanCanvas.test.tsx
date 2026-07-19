import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { deskAssemblyDrawer } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer";
import { ParametricPlanCanvas } from "@/features/admin/svg-editor/parametric/ParametricPlanCanvas";

const preview = deskAssemblyDrawer.render(deskAssemblyDrawer.defaults());

describe("ParametricPlanCanvas", () => {
  it("renders structured Maker paths and supports accessible viewport controls", async () => {
    const user = userEvent.setup();
    const onPartSelect = vi.fn();
    render(
      <ParametricPlanCanvas
        label="Desk assembly"
        capabilities={deskAssemblyDrawer.capabilities}
        preview={preview}
        selectedPartId={null}
        onPartSelect={onPartSelect}
      />,
    );

    expect(screen.getByTestId("parametric-plan-svg")).toHaveAttribute(
      "viewBox",
      `0 0 ${preview.viewBox.width} ${preview.viewBox.height}`,
    );
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByTestId("parametric-zoom-status")).toHaveTextContent("110%");
    await user.click(screen.getByRole("button", { name: "Fit plan" }));
    expect(screen.getByTestId("parametric-zoom-status")).toHaveTextContent("100%");
    await user.click(screen.getByTestId("parametric-part-workstation-01"));
    expect(onPartSelect).toHaveBeenCalledWith("workstation-01");
  });

  it("toggles the grid and exposes measurements when supported", async () => {
    const user = userEvent.setup();
    render(
      <ParametricPlanCanvas
        label="Desk assembly"
        capabilities={deskAssemblyDrawer.capabilities}
        preview={preview}
        selectedPartId="workstation-01"
        onPartSelect={() => undefined}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Grid" }));
    expect(screen.getByTestId("parametric-plan-svg")).toHaveAttribute(
      "data-grid",
      "true",
    );
    expect(screen.getByTestId("parametric-plan-measurements")).toHaveTextContent(
      `${preview.widthMm} × ${preview.depthMm} mm`,
    );
    expect(screen.getByTestId("parametric-part-workstation-01")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });

  it("reports an invalid preview without rendering an SVG", () => {
    render(
      <ParametricPlanCanvas
        label="Test bed"
        capabilities={deskAssemblyDrawer.capabilities}
        preview={null}
        selectedPartId={null}
        onPartSelect={() => undefined}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Fix field errors to preview Test bed",
    );
    expect(screen.queryByTestId("parametric-plan-svg")).not.toBeInTheDocument();
  });

  it("does not select parts when the drawer disables selection", async () => {
    const user = userEvent.setup();
    const onPartSelect = vi.fn();
    render(
      <ParametricPlanCanvas
        label="Static assembly"
        capabilities={{ ...deskAssemblyDrawer.capabilities, selectableParts: false }}
        preview={preview}
        selectedPartId={null}
        onPartSelect={onPartSelect}
      />,
    );

    await user.click(screen.getByTestId("parametric-part-workstation-01"));
    expect(onPartSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId("parametric-part-workstation-01")).not.toHaveAttribute("role");
  });
});
