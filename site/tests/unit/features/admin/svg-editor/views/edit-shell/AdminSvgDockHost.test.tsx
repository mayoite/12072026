import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dock = vi.hoisted(() => {
  const panelIds: string[] = [];
  return {
    panelIds,
    api: {
      get panels() {
        return panelIds.map((id) => ({ id }));
      },
      addPanel: vi.fn((panel: { id: string }) => {
        panelIds.push(panel.id);
        return { id: panel.id };
      }),
      getPanel: vi.fn((id: string) =>
        panelIds.includes(id) ? { id, api: { close: vi.fn() } } : undefined,
      ),
      onDidRemovePanel: vi.fn(() => ({ dispose: vi.fn() })),
      onDidLayoutChange: vi.fn(() => ({ dispose: vi.fn() })),
      toJSON: vi.fn(() => ({ grid: {}, panels: {} })),
      fromJSON: vi.fn(),
    },
  };
});

vi.mock("dockview-react", () => ({
  DockviewDefaultTab: () => null,
  DockviewReact: ({ onReady }: { onReady: (event: { api: typeof dock.api }) => void }) => {
    onReady({ api: dock.api });
    return <div data-testid="mock-dockview" />;
  },
  themeLight: {},
}));

import { AdminSvgDockHost } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost";

beforeEach(() => {
  dock.panelIds.splice(0);
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(cleanup);

describe("AdminSvgDockHost", () => {
  it("preserves the freehand panel contract", () => {
    render(
      <AdminSvgDockHost
        slots={{ preview: <p>Preview</p>, stage: <p>Stage</p>, details: <p>Details</p> }}
      />,
    );
    expect(dock.panelIds).toEqual(["stage", "preview", "details"]);
    expect(screen.getByTestId("admin-svg-dock-host")).toHaveAttribute(
      "data-layout-mode",
      "freehand",
    );
  });

  it("seeds the factory tools, properties, and required canvas preset", () => {
    render(
      <AdminSvgDockHost
        layoutMode="factory"
        factorySlots={{
          tools: <p>Tools</p>,
          properties: <p>Properties</p>,
          canvas: <p>Canvas</p>,
        }}
      />,
    );
    expect(dock.panelIds).toEqual(["canvas", "properties", "tools"]);
    expect(screen.getByTestId("admin-svg-dock-host")).toHaveAttribute(
      "data-layout-mode",
      "factory",
    );
    expect(screen.getByTestId("admin-svg-dock-host")).toHaveAttribute(
      "data-required-panel",
      "canvas",
    );
  });
});
