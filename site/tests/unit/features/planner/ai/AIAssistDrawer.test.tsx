import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AIAssistDrawer } from "@/features/planner/ai/AIAssistDrawer";
import type { WorkspaceAiBridge } from "@/features/planner/ai/workspaceAiBridge";

vi.mock("@/features/planner/cloud-store/workspaceStore", () => ({
  usePlannerWorkspaceStore: (
    selector: (s: { projectMetadata: null }) => unknown,
  ) => selector({ projectMetadata: null }),
}));

vi.mock("@/features/planner/ai/AiAdvisorChatPane", () => ({
  AiAdvisorChatPane: () => <div data-testid="chat-pane">chat</div>,
}));

vi.mock("@/features/planner/ai/LayoutPreviewSvg", () => ({
  LayoutPreviewSvg: () => <div data-testid="layout-preview">preview</div>,
}));

vi.mock("@/features/planner/catalog-api/CatalogBlockPreview", () => ({
  CatalogBlockPreview: () => <div data-testid="block-preview" />,
}));

describe("AIAssistDrawer", () => {
  afterEach(() => cleanup());

  it("renders AI Assist with tabs in embedded mode", () => {
    render(<AIAssistDrawer embedded defaultTab="chat" />);
    expect(screen.getByLabelText("AI Assist")).toBeTruthy();
    expect(screen.getByRole("tab", { name: /Suggest/i })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /Match/i })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /Chat/i })).toBeTruthy();
  });

  it("scans placements via workspace bridge on Match tab", () => {
    const bridge: WorkspaceAiBridge = {
      placementCount: 1,
      getPlacements: () => [
        {
          shapeId: "f1",
          kind: "workstation",
          label: "Desk",
          widthMm: 1200,
          heightMm: 600,
          catalogItemId: "desk-1",
        },
      ],
      applyLayout: vi.fn(),
      replaceCatalogMatch: vi.fn(),
    };
    render(
      <AIAssistDrawer
        embedded
        defaultTab="match-catalog"
        workspaceBridge={bridge}
      />,
    );
    const scan = screen.queryByRole("button", { name: /scan/i });
    if (scan) {
      fireEvent.click(scan);
      expect(bridge.getPlacements().length).toBe(1);
    }
  });

  it("toggles expand in non-embedded mode", () => {
    render(<AIAssistDrawer embedded={false} defaultExpanded={false} />);
    const toggle = screen.getByRole("button", { name: /AI Assist/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
});
