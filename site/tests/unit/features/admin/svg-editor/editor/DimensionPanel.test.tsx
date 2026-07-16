import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DimensionPanel } from "@/features/admin/svg-editor/editor/DimensionPanel";
import type { ExcalidrawAPI } from "@/features/admin/svg-editor/editor/elementUtils";
import { metersToPixels } from "@/features/admin/svg-editor/editor/units";

function makeApi(overrides?: {
  selectedElementIds?: Record<string, boolean>;
  elements?: Array<{
    id: string;
    type: string;
    width: number;
    height: number;
  }>;
}): ExcalidrawAPI {
  const elements = overrides?.elements ?? [
    { id: "rect-1", type: "rectangle", width: 100, height: 50 },
  ];
  return {
    getAppState: vi.fn(() => ({
      selectedElementIds: overrides?.selectedElementIds ?? { "rect-1": true },
    })),
    getSceneElements: vi.fn(() => elements),
    updateScene: vi.fn(),
  } as unknown as ExcalidrawAPI;
}

describe("DimensionPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows hint and disabled inputs with no selection", async () => {
    const api = makeApi({ selectedElementIds: {} });
    render(<DimensionPanel excalidrawAPI={api} />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(
      screen.getByText(/Select a rectangle to set dimensions/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Width in meters")).toBeDisabled();
    expect(screen.getByLabelText("Apply dimensions to selected rectangle")).toBeDisabled();
  });

  it("syncs metric dimensions from a selected rectangle", async () => {
    const api = makeApi({
      elements: [{ id: "rect-1", type: "rectangle", width: 250, height: 100 }],
    });
    render(<DimensionPanel excalidrawAPI={api} />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByLabelText("Width in meters")).toHaveValue(2.5);
    expect(screen.getByLabelText("Height in meters")).toHaveValue(1);
    expect(
      screen.getByLabelText("Apply dimensions to selected rectangle"),
    ).not.toBeDisabled();
  });

  it("switches to imperial inputs and applies converted dimensions", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const api = makeApi({
      elements: [{ id: "rect-1", type: "rectangle", width: 100, height: 100 }],
    });
    render(<DimensionPanel excalidrawAPI={api} />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    await user.click(screen.getByRole("button", { name: /Feet\/Inches/i }));
    expect(screen.getByLabelText("Width feet")).toBeInTheDocument();
    expect(screen.getByLabelText("Width inches")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Width feet"));
    await user.type(screen.getByLabelText("Width feet"), "1");
    await user.clear(screen.getByLabelText("Width inches"));
    await user.type(screen.getByLabelText("Width inches"), "0");
    await user.clear(screen.getByLabelText("Height feet"));
    await user.type(screen.getByLabelText("Height feet"), "1");
    await user.clear(screen.getByLabelText("Height inches"));
    await user.type(screen.getByLabelText("Height inches"), "0");

    await user.click(
      screen.getByLabelText("Apply dimensions to selected rectangle"),
    );

    expect(api.updateScene).toHaveBeenCalled();
    const call = vi.mocked(api.updateScene).mock.calls[0]?.[0] as {
      elements: Array<{ width: number; height: number }>;
    };
    expect(call.elements[0].width).toBeGreaterThan(0);
    expect(call.elements[0].height).toBeGreaterThan(0);
  });

  it("applies metric dimensions on Apply", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const api = makeApi({
      elements: [{ id: "rect-1", type: "rectangle", width: 100, height: 100 }],
    });
    render(<DimensionPanel excalidrawAPI={api} />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    const width = screen.getByLabelText("Width in meters");
    const height = screen.getByLabelText("Height in meters");
    await user.clear(width);
    await user.type(width, "3");
    await user.clear(height);
    await user.type(height, "2");
    await user.click(
      screen.getByLabelText("Apply dimensions to selected rectangle"),
    );

    expect(api.updateScene).toHaveBeenCalled();
    const call = vi.mocked(api.updateScene).mock.calls[0]?.[0] as {
      elements: Array<{ id: string; width: number; height: number }>;
    };
    expect(call.elements[0].width).toBe(metersToPixels(3));
    expect(call.elements[0].height).toBe(metersToPixels(2));
  });

  it("does nothing when api is null", () => {
    render(<DimensionPanel excalidrawAPI={null} />);
    expect(
      screen.getByText(/Select a rectangle to set dimensions/i),
    ).toBeInTheDocument();
  });
});
