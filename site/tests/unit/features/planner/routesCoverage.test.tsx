/**
 * Site planner route and layout coverage:
 * `/planner/guest` and `/planner/canvas` mount PlannerWorkspaceRoute → PlannerHost.
 * `/planner/open3d` is redirect-only (next.config → /planner/canvas) — no page module.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

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

vi.mock("@/lib/auth/plannerSession", () => ({
  getOptionalPlannerUser: vi.fn(async () => null),
}));

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div data-testid="planner-workspace-route">
      {guestMode ? "guest" : "member"}
      {planId ? ` ${planId}` : ""}
    </div>
  ),
}));

vi.mock("@/features/planner/ui/PlannerHost", () => ({
  PlannerHost: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div data-testid="planner-host">
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

  it("wires guest route to PlannerWorkspaceRoute", async () => {
    const { default: PlannerGuestPage } = await import("@/app/planner/(workspace)/guest/page");
    render(await PlannerGuestPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByTestId("planner-workspace-route")).toHaveTextContent("guest");
  });

  it("wires canvas route to PlannerWorkspaceRoute with plan id", async () => {
    const { default: PlannerCanvasPage } = await import("@/app/planner/(workspace)/canvas/page");
    render(
      await PlannerCanvasPage({
        searchParams: Promise.resolve({ id: "alpha-plan" }),
      }),
    );
    expect(screen.getByTestId("planner-workspace-route")).toHaveTextContent("alpha-plan");
  });

  it("has no pilot /planner/open3d page — redirect-only to canvas", () => {
    const open3dPage = path.resolve(process.cwd(), "app/planner/open3d/page.tsx");
    expect(existsSync(open3dPage)).toBe(false);
  });

  it("renders known feature slug pages and rejects unknown slugs", async () => {
    const { default: PlannerFeaturePage } = await import("@/app/planner/(marketing)/features/[slug]/page");

    render(await PlannerFeaturePage({ params: Promise.resolve({ slug: "measure" }) }));
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    await expect(
      PlannerFeaturePage({ params: Promise.resolve({ slug: "missing-feature" }) }),
    ).rejects.toThrow("NOT_FOUND");
  });

  // Direct navigation + refresh: guest vs planId on live /planner/canvas (same host as guest)
  it("preserves guest and planId mount on /planner/canvas for direct navigation and refresh", async () => {
    const { default: PlannerCanvasPage } = await import("@/app/planner/(workspace)/canvas/page");
    const guest = await PlannerCanvasPage({ searchParams: Promise.resolve({}) });
    const auth = await PlannerCanvasPage({ searchParams: Promise.resolve({ id: "plan-42" }) });
    const { unmount } = render(guest);
    expect(screen.getByTestId("planner-workspace-route")).toBeInTheDocument();
    unmount();
    render(auth);
    expect(screen.getByTestId("planner-workspace-route")).toHaveTextContent("plan-42");
  });
});
