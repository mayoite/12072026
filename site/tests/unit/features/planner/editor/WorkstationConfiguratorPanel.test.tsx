import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkstationConfiguratorPanel } from "@/features/planner/editor/WorkstationConfiguratorPanel";
import type { WorkstationConfigV0 } from "@/features/planner/project/catalog/workstationSystemV0";

describe("WorkstationConfiguratorPanel", () => {
  it("places single workstation config", () => {
    const onPlaceConfig = vi.fn();
    render(<WorkstationConfiguratorPanel onPlaceConfig={onPlaceConfig} />);
    fireEvent.click(screen.getByRole("button", { name: /Place this workstation/i }));
    expect(onPlaceConfig).toHaveBeenCalledTimes(1);
    const config = onPlaceConfig.mock.calls[0]![0] as WorkstationConfigV0;
    expect(config.shape).toBe("linear");
  });
});
