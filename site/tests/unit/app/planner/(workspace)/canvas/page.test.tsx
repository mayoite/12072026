import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerCanvasRoute, {
  dynamic,
} from "@/app/planner/(workspace)/canvas/page";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";
import { TEST_PLAN_ID_1 } from "@/tests/fixtures/plannerTestUuids";

vi.mock("@/lib/auth/plannerSession", () => ({
  getOptionalPlannerUser: vi.fn(),
}));

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({
    guestMode,
    planId,
    ownerId,
  }: {
    guestMode?: boolean;
    planId?: string;
    ownerId?: string;
  }) => (
    <div
      data-testid="open3d-planner-route"
      data-guest-mode={String(guestMode)}
      data-plan-id={planId ?? ""}
      data-owner-id={ownerId ?? ""}
    />
  ),
}));

describe("PlannerCanvasRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports dynamic configuration", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("redirects unauthenticated users to the guest entry", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue(null);
    await expect(
      PlannerCanvasRoute({ searchParams: Promise.resolve({}) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT;replace;/planner/guest/"),
    });
  });

  it("keeps Site continuity params when bouncing unauthenticated canvas to guest", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue(null);
    await expect(
      PlannerCanvasRoute({
        searchParams: Promise.resolve({
          siteProduct: "desk",
          siteSource: "/choose-product",
          utm_campaign: "spring",
        }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringMatching(
        /NEXT_REDIRECT;replace;\/planner\/guest\/\?.*siteProduct=desk/,
      ),
    });
  });

  it("renders member mode with planId from searchParams", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: "user-1",
      email: "member@test.com",
    } as never);
    render(
      await PlannerCanvasRoute({
        searchParams: Promise.resolve({ id: TEST_PLAN_ID_1 }),
      }),
    );
    const host = screen.getByTestId("open3d-planner-route");
    expect(host).toHaveAttribute("data-guest-mode", "false");
    expect(host).toHaveAttribute("data-plan-id", TEST_PLAN_ID_1);
    expect(host).toHaveAttribute("data-owner-id", "user-1");
  });

  it("rejects malformed member plan ids", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: "user-1",
      email: "member@test.com",
    } as never);

    await expect(
      PlannerCanvasRoute({
        searchParams: Promise.resolve({ id: "plan-99" }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects overlong member plan ids", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: "user-1",
      email: "member@test.com",
    } as never);

    await expect(
      PlannerCanvasRoute({
        searchParams: Promise.resolve({ id: "a".repeat(256) }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects repeated member plan ids as ambiguous", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: "user-1",
      email: "member@test.com",
    } as never);

    await expect(
      PlannerCanvasRoute({
        searchParams: Promise.resolve({ id: [TEST_PLAN_ID_1, TEST_PLAN_ID_1] }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects an explicitly empty member plan id", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: "user-1",
      email: "member@test.com",
    } as never);

    await expect(
      PlannerCanvasRoute({ searchParams: Promise.resolve({ id: "" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });
});
