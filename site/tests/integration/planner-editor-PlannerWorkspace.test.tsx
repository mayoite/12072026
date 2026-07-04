import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CURATED_CATALOG_ITEMS } from "@/features/planner/catalog/workspaceCatalog";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";
import { usePlannerStore } from "@/features/planner/store/plannerStore";
import { usePlannerCatalogStore } from "@/features/planner/catalog/catalogStore";
import { resetFabricRuntimeState } from "./planner-fabric-mockRuntime";

vi.mock("fabric", async () => {
  const { createPlannerFabricModuleMock } = await import("./planner-fabric-moduleMock");
  return createPlannerFabricModuleMock();
});

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <span data-testid="logo" />,
}));

vi.mock("@/features/planner/lib/featureFlags", () => ({
  isFeatureEnabled: () => true,
}));

import { PlannerWorkspace } from "@/features/planner/editor/PlannerWorkspace";

async function waitForCatalogHydrationToSettle() {
  await waitFor(() => {
    const calls = vi.mocked(globalThis.fetch).mock.calls;
    expect(calls.some(([input]) => String(input).includes("/api/planner/catalog"))).toBe(true);
  });
  await waitFor(() => {
    expect(usePlannerCatalogStore.getState().catalogHydrating).toBe(false);
  });
}

describe("PlannerWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ name: "test-theme", payload_jsonb: {} }),
    );
    resetFabricRuntimeState();
    usePlannerWorkspaceStore.setState({
      plannerStep: "draw",
      layerVisible: {
        walls: true,
        rooms: true,
        zones: true,
        furniture: true,
        measurements: true,
      },
    });
    usePlannerStore.setState({ tool: "select" });
    usePlannerCatalogStore.setState({ recentIds: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts the Fabric workspace shell and handles tool keyboard shortcuts", async () => {
    render(<PlannerWorkspace guestMode />);
    
    // Wait for the canvas region to be rendered
    const canvasWrap = await screen.findByRole("application");
    expect(canvasWrap).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "w" });
    await waitFor(() => {
      expect(usePlannerStore.getState().tool).toBe("wall");
    });
    await waitForCatalogHydrationToSettle();
  }, 20_000);

  it("opens templates and export modals from the top bar", async () => {
    render(<PlannerWorkspace guestMode />);
    fireEvent.click(screen.getByRole("button", { name: "Open layout templates" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const exportBtn = await screen.findByRole("button", { name: /^Export$/ });
    fireEvent.click(exportBtn);
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /Export your plan/i })).toBeInTheDocument();
    });
    await waitForCatalogHydrationToSettle();
  }, 20_000);

  it("handles catalog drop on the canvas surface", async () => {
    render(<PlannerWorkspace guestMode />);
    const surface = await waitFor(() => document.querySelector(".pw-canvas-surface") as HTMLElement);
    const item = CURATED_CATALOG_ITEMS[0]!;
    const dataTransfer = {
      types: ["application/planner-catalog-item"],
      setData: () => undefined,
      getData: (mime: string) => (mime === "application/planner-catalog-item" ? JSON.stringify(item) : ""),
    };

    fireEvent.dragOver(surface, { dataTransfer });
    fireEvent.drop(surface, { dataTransfer });

    await waitFor(() => {
      expect(usePlannerCatalogStore.getState().recentIds).toContain(item.id);
    });
    await waitForCatalogHydrationToSettle();
  }, 20_000);

  it("shows blank canvas guidance and starter actions on an empty canvas", async () => {
    render(<PlannerWorkspace guestMode />);

    const region = await screen.findByRole("region", { name: "Empty canvas guidance" });
    expect(region).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Use template" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Draw walls" }));
    expect(usePlannerStore.getState().tool).toBe("wall");
    await waitForCatalogHydrationToSettle();
  }, 20_000);
});
