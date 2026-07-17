import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PropertiesPanel } from "@/features/planner/editor/PropertiesPanel";

describe("PropertiesPanel", () => {
  it("collapses to null when nothing is selected and no underlay actions", () => {
    const { container } = render(
      <PropertiesPanel selectedEntity={null} displayUnit="mm" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("keeps empty underlay chrome when calibrate is available", () => {
    render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        callbacks={{ onCalibrateUnderlay: vi.fn() }}
      />,
    );
    expect(screen.getByText(/no selection/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calibrate underlay width to 10 metres/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calibrate underlay width to 5 metres/i }),
    ).toBeInTheDocument();
  });

  it("calibrates underlay width to 10 m and 5 m presets", () => {
    const onCalibrateUnderlay = vi.fn();
    render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        callbacks={{ onCalibrateUnderlay }}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /calibrate underlay width to 10 metres/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /calibrate underlay width to 5 metres/i }),
    );
    expect(onCalibrateUnderlay).toHaveBeenNthCalledWith(1, 10_000);
    expect(onCalibrateUnderlay).toHaveBeenNthCalledWith(2, 5_000);
  });

  it("starts two-point underlay calibrate with known distance", () => {
    const onStartTwoPointCalibrate = vi.fn();
    render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        callbacks={{
          onCalibrateUnderlay: vi.fn(),
          onStartTwoPointCalibrate,
        }}
      />,
    );
    const known = screen.getByLabelText(/known underlay segment length/i);
    fireEvent.change(known, { target: { value: "3500" } });
    fireEvent.click(
      screen.getByRole("button", { name: /start two-point underlay calibration/i }),
    );
    expect(onStartTwoPointCalibrate).toHaveBeenCalledWith(3500);
  });

  it("does not start two-point calibrate with non-positive known distance", () => {
    const onStartTwoPointCalibrate = vi.fn();
    render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        callbacks={{
          onCalibrateUnderlay: vi.fn(),
          onStartTwoPointCalibrate,
        }}
      />,
    );
    const known = screen.getByLabelText(/known underlay segment length/i);
    fireEvent.change(known, { target: { value: "0" } });
    fireEvent.click(
      screen.getByRole("button", { name: /start two-point underlay calibration/i }),
    );
    fireEvent.change(known, { target: { value: "not-a-length" } });
    fireEvent.click(
      screen.getByRole("button", { name: /start two-point underlay calibration/i }),
    );
    expect(onStartTwoPointCalibrate).not.toHaveBeenCalled();
  });

  it("cancels an active two-point calibrate session", () => {
    const onCancelTwoPointCalibrate = vi.fn();
    render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        underlayCalibratePhase="pick-a"
        callbacks={{
          onCalibrateUnderlay: vi.fn(),
          onStartTwoPointCalibrate: vi.fn(),
          onCancelTwoPointCalibrate,
        }}
      />,
    );
    expect(screen.getByText(/first reference point/i)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /cancel two-point underlay calibration/i }),
    );
    expect(onCancelTwoPointCalibrate).toHaveBeenCalled();
  });

  it("disables width presets while two-point calibrate is active", () => {
    render(
      <PropertiesPanel
        selectedEntity={null}
        displayUnit="mm"
        underlayCalibratePhase="pick-b"
        callbacks={{
          onCalibrateUnderlay: vi.fn(),
          onStartTwoPointCalibrate: vi.fn(),
          onCancelTwoPointCalibrate: vi.fn(),
        }}
      />,
    );
    expect(screen.getByText(/second reference point/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calibrate underlay width to 10 metres/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /calibrate underlay width to 5 metres/i }),
    ).toBeDisabled();
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
