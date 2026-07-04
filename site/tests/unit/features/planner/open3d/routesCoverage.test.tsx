/**
 * Site planner route and layout coverage for the current split:
 * `/planner/guest` and `/planner/canvas` mount Open3dPlannerWorkspaceRoute,
 * while `/planner/open3d` remains the pilot route on Open3dPlannerHost.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PlannerHelpPage } from "@/features/planner/help/PlannerHelpPage";
import PlannerWorkspaceLayout, { metadata as workspaceMetadata } from "@/app/planner/(workspace)/layout";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((target: string) => {
    throw new Error(`REDIRECT:${target}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  usePathname: vi.fn(() => "/planner/help"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })),
}));

vi.mock("@/features/planner/ui/Open3dPlannerWorkspaceRoute", () => ({
  Open3dPlannerWorkspaceRoute: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div data-testid="open3d-planner-route">
      {guestMode ? "guest" : "member"}
      {planId ? ` ${planId}` : ""}
    </div>
  ),
}));

vi.mock("@/features/planner/ui/Open3dPlannerHost", () => ({
  Open3dPlannerHost: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div data-testid="open3d-planner-host">
      {guestMode ? "guest" : "member"}
      {planId ? ` ${planId}` : ""}
    </div>
  ),
}));

describe("site planner routes", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports workspace layout metadata and renders children", () => {
    expect(workspaceMetadata.robots).toEqual({ index: false, follow: false });
    render(
      <PlannerWorkspaceLayout>
        <p>Workspace child</p>
      </PlannerWorkspaceLayout>,
    );
    expect(screen.getByText("Workspace child")).toBeInTheDocument();
  });

  it("renders the help marketing page", () => {
    render(<PlannerHelpPage />);
    expect(screen.getByRole("heading", { name: /workspace planner/i })).toBeInTheDocument();
  });

  it("wires guest route to Open3dPlannerWorkspaceRoute on the live hybrid planner route", async () => {
    const { default: PlannerGuestPage } = await import("@/app/planner/(workspace)/guest/page");
    render(<PlannerGuestPage />);
    expect(screen.getByTestId("open3d-planner-route")).toHaveTextContent("guest");
  });

  it("wires canvas route to Open3dPlannerWorkspaceRoute with plan id on the live hybrid planner route", async () => {
    const { default: PlannerCanvasPage } = await import("@/app/planner/(workspace)/canvas/page");
    render(
      await PlannerCanvasPage({
        searchParams: Promise.resolve({ id: "alpha-plan" }),
      }),
    );
    expect(screen.getByTestId("open3d-planner-route")).toHaveTextContent("alpha-plan");
  });

  it("mounts Open3dPlannerHost on the pilot /planner/open3d route", async () => {
    const { default: Open3dPage } = await import("@/app/planner/open3d/page");
    render(
      await Open3dPage({
        searchParams: Promise.resolve({ id: "pilot-plan" }),
      }),
    );
    expect(screen.getByTestId("open3d-planner-host")).toHaveTextContent("pilot-plan");
  });

  it("renders known feature slug pages and rejects unknown slugs", async () => {
    const { default: PlannerFeaturePage } = await import("@/app/planner/(marketing)/features/[slug]/page");

    render(await PlannerFeaturePage({ params: Promise.resolve({ slug: "measure" }) }));
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    await expect(
      PlannerFeaturePage({ params: Promise.resolve({ slug: "missing-feature" }) }),
    ).rejects.toThrow("NOT_FOUND");
  });
});
