import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { OOPlannerWorkspace } from "@/features/planner/editor/OOPlannerWorkspace";

vi.mock("@/features/planner/editor/CanvasToolRail", () => ({
  CanvasToolRail: () => <div data-testid="tool-rail" />,
}));
vi.mock("@/features/planner/editor/CommandPalette", () => ({
  CommandPalette: () => <div data-testid="cmd-palette" />,
}));
vi.mock("@/features/planner/editor/LayersPanel", () => ({
  LayersPanel: () => <div data-testid="layers" />,
}));
vi.mock("@/features/planner/canvas", () => ({
  PlannerCanvasStage: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="canvas-stage">{children}</div>
  ),
}));
vi.mock("@/features/planner/3d/ThreeLazyViewer", () => ({
  Lazy3DViewer: () => <div data-testid="lazy-3d" />,
}));

const catalogHook = {
  items: [],
  isLoading: false,
  status: "ready" as const,
  resolveItem: () => null,
  isStale: false,
  error: null,
  retry: vi.fn(),
};

vi.mock("@/features/planner/catalog/usePlannerWorkspaceCatalog", () => ({
  usePlannerWorkspaceCatalog: () => catalogHook,
  usePlannerSvgCatalog: () => catalogHook,
}));

vi.mock("@/features/planner/persistence/usePlannerWorkspaceAutosave", () => ({
  usePlannerWorkspaceAutosave: () => ({
    status: "idle",
    isModified: false,
    isSynced: true,
    schedulePersist: vi.fn(),
    restoreSnapshot: async () => null,
  }),
}));

describe("OOPlannerWorkspace", () => {
  it("mounts workspace shell without throwing", () => {
    const { container } = render(<OOPlannerWorkspace />);
    expect(container.firstChild).not.toBeNull();
    expect((document.body.textContent ?? "").length).toBeGreaterThan(0);
  });
});
