import { readFileSync } from "node:fs";
import path from "node:path";
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

const WORKSPACE_SOURCE = path.join(
  process.cwd(),
  "features",
  "planner",
  "editor",
  "OOPlannerWorkspace.tsx",
);

describe("OOPlannerWorkspace", () => {
  it("mounts workspace shell without throwing", () => {
    const { container } = render(<OOPlannerWorkspace />);
    expect(container.firstChild).not.toBeNull();
    expect((document.body.textContent ?? "").length).toBeGreaterThan(0);
  });

  /**
   * W1: Review commercial preview uses the same furniture BOQ builder as export.
   * Source contract — full mount of Review with furniture is browser/e2e scope.
   */
  it("wires ReviewQuotePanel commercial props from buildPlannerFurnitureBoq", () => {
    const src = readFileSync(WORKSPACE_SOURCE, "utf8");
    expect(src).toMatch(/buildPlannerFurnitureBoq/);
    expect(src).toMatch(/reviewBoqPreview/);
    expect(src).toMatch(/pricingMode=\{reviewBoqPreview\.pricingMode\}/);
    expect(src).toMatch(
      /unpricedItemCount=\{reviewBoqPreview\.unpricedItemCount\}/,
    );
    expect(src).toMatch(/boqLines=\{reviewBoqPreview\.boqLines\}/);
    // Honesty labels only — no fabricated unit prices in the preview map.
    expect(src).toMatch(/unitNote:\s*line\.priced\s*\?\s*"demo list"\s*:\s*"unpriced"/);
    expect(src).not.toMatch(/unitPriceInr:\s*line/);
  });
});
