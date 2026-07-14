import { describe, expect, it, vi } from "vitest";
import type { WorkspaceAiBridge } from "@/features/planner/ai/workspaceAiBridge";
import type { SuggestedLayoutJson } from "@/features/planner/ai/types";

describe("workspaceAiBridge", () => {
  it("describes the live document bridge contract", () => {
    const layout: SuggestedLayoutJson = {
      version: 1,
      source: "grid-pack",
      summary: "x",
      room: { label: "R", x: 0, y: 0, widthMm: 1000, depthMm: 1000 },
      walls: [],
      zones: [],
      furniture: [],
    };
    const bridge: WorkspaceAiBridge = {
      placementCount: 2,
      getPlacements: () => [
        {
          shapeId: "a",
          kind: "workstation",
          label: "Desk",
          widthMm: 1200,
          heightMm: 600,
        },
      ],
      applyLayout: vi.fn(),
      replaceCatalogMatch: vi.fn(),
      fitCanvas: vi.fn(),
    };
    expect(bridge.placementCount).toBe(2);
    expect(bridge.getPlacements()).toHaveLength(1);
    bridge.applyLayout(layout);
    bridge.replaceCatalogMatch("a", "sku-1");
    bridge.fitCanvas?.();
    expect(bridge.applyLayout).toHaveBeenCalledWith(layout);
    expect(bridge.replaceCatalogMatch).toHaveBeenCalledWith("a", "sku-1");
  });
});
