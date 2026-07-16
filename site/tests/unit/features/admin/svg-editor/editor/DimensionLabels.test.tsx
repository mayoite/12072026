import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";

import { DimensionLabels } from "@/features/admin/svg-editor/editor/DimensionLabels";
import type { ExcalidrawAPI } from "@/features/admin/svg-editor/editor/elementUtils";

function makeApi(opts: {
  selectedElementIds?: Record<string, boolean>;
  elements?: ReadonlyArray<Record<string, unknown>>;
  scrollX?: number;
  scrollY?: number;
  zoom?: number;
}): ExcalidrawAPI {
  return {
    getAppState: vi.fn(() => ({
      scrollX: opts.scrollX ?? 0,
      scrollY: opts.scrollY ?? 0,
      zoom: { value: opts.zoom ?? 1 },
      selectedElementIds: opts.selectedElementIds ?? {},
    })),
    getSceneElements: vi.fn(() => opts.elements ?? []),
  } as unknown as ExcalidrawAPI;
}

describe("DimensionLabels", () => {
  let rafQueue: FrameRequestCallback[];

  beforeEach(() => {
    rafQueue = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      (cb: FrameRequestCallback): number => {
        rafQueue.push(cb);
        return rafQueue.length;
      },
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  async function flushRafFrames(times = 2) {
    for (let i = 0; i < times; i += 1) {
      const batch = rafQueue.splice(0, rafQueue.length);
      await act(async () => {
        for (const cb of batch) cb(i);
      });
    }
  }

  it("renders nothing without API or selection", async () => {
    const { container, rerender } = render(
      <DimensionLabels excalidrawAPI={null} unitSystem="metric" />,
    );
    await flushRafFrames(1);
    expect(container.querySelector(".admin-svg-dimension-labels")).toBeNull();

    const api = makeApi({ selectedElementIds: {} });
    rerender(<DimensionLabels excalidrawAPI={api} unitSystem="metric" />);
    await flushRafFrames(2);
    expect(container.querySelector(".admin-svg-dimension-labels")).toBeNull();
  });

  it("labels a selected rectangle with W×H", async () => {
    const api = makeApi({
      selectedElementIds: { r1: true },
      elements: [
        {
          id: "r1",
          type: "rectangle",
          x: 10,
          y: 20,
          width: 250,
          height: 100,
        },
      ],
    });

    render(<DimensionLabels excalidrawAPI={api} unitSystem="metric" />);
    await flushRafFrames(2);

    const host = document.querySelector(".admin-svg-dimension-labels");
    expect(host).not.toBeNull();
    expect(host).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(/2\.50 m × 1\.00 m/)).toBeInTheDocument();
  });

  it("labels a selected line with length and optional height", async () => {
    const api = makeApi({
      selectedElementIds: { "line-1": true },
      elements: [
        {
          id: "line-1",
          type: "line",
          x: 0,
          y: 0,
          width: 100,
          height: 0,
          points: [
            [0, 0],
            [250, 0],
          ],
          customData: { heightPx: 100 },
        },
      ],
    });

    render(<DimensionLabels excalidrawAPI={api} unitSystem="metric" />);
    await flushRafFrames(2);

    expect(screen.getByText(/L: 2\.50 m/)).toBeInTheDocument();
    expect(screen.getByText(/H: 1\.00 m/)).toBeInTheDocument();
  });

  it("ignores non-dimension element types even when selected", async () => {
    const api = makeApi({
      selectedElementIds: { t1: true },
      elements: [
        {
          id: "t1",
          type: "text",
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        },
      ],
    });

    const { container } = render(
      <DimensionLabels excalidrawAPI={api} unitSystem="metric" />,
    );
    await flushRafFrames(2);
    expect(container.querySelector(".admin-svg-dimension-labels")).toBeNull();
  });
});
