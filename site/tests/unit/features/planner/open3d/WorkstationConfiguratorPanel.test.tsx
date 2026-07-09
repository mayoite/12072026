import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { WorkstationConfiguratorPanel } from "@/features/planner/open3d/editor/WorkstationConfiguratorPanel";
import type { WorkstationConfigV0 } from "@/features/planner/open3d/catalog/workstationSystemV0";

describe("WorkstationConfiguratorPanel", () => {
  it("arms single place with resolved config", () => {
    const onPlaceConfig = vi.fn();
    render(<WorkstationConfiguratorPanel onPlaceConfig={onPlaceConfig} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Place this workstation" }),
    );

    expect(onPlaceConfig).toHaveBeenCalledTimes(1);
    const config = onPlaceConfig.mock.calls[0]![0] as WorkstationConfigV0;
    expect(config.shape).toBe("linear");
    expect(config.modules).toContain("desk");
  });

  it("batch buttons place 2 / 4 / 10 with current draft config", () => {
    const onPlaceConfig = vi.fn();
    const onPlaceBatchConfig = vi.fn();
    render(
      <WorkstationConfiguratorPanel
        onPlaceConfig={onPlaceConfig}
        onPlaceBatchConfig={onPlaceBatchConfig}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "L-shape" }));
    fireEvent.click(screen.getByRole("button", { name: "Place 4 seats" }));

    expect(onPlaceBatchConfig).toHaveBeenCalledTimes(1);
    const [config, count] = onPlaceBatchConfig.mock.calls[0] as [
      WorkstationConfigV0,
      number,
    ];
    expect(count).toBe(4);
    expect(config.shape).toBe("l-shape");
    expect(config.modules).toContain("return");
    expect(onPlaceConfig).not.toHaveBeenCalled();
  });

  it("hides batch buttons when onPlaceBatchConfig is omitted", () => {
    render(
      <WorkstationConfiguratorPanel onPlaceConfig={vi.fn()} />,
    );
    expect(
      screen.queryByRole("button", { name: "Place 2 seats" }),
    ).toBeNull();
    expect(
      screen.queryByRole("group", { name: "Place multiple seats" }),
    ).toBeNull();
  });

  it("exposes all three batch counts", () => {
    render(
      <WorkstationConfiguratorPanel
        onPlaceConfig={vi.fn()}
        onPlaceBatchConfig={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Place 2 seats" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Place 4 seats" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Place 10 seats" }),
    ).toBeTruthy();
  });
});
