import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  GUEST_PROJECT_ID,
  GUEST_PROJECT_PREFIX,
  MEMBER_PROJECT_ID,
} from "@/features/planner/persistence/persistence";
import { getPlannerProjectId } from "@/features/planner/hooks/usePlannerAutosave";
import {
  TEST_CLOUD_PLAN_1,
  TEST_CLOUD_PLAN_2,
} from "@/tests/fixtures/plannerTestUuids";

const getOptionalPlannerUser = vi.fn();

vi.mock("@/lib/auth/plannerSession", () => ({
  getOptionalPlannerUser,
}));

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({
    guestMode = false,
    planId,
    ownerId,
  }: {
    guestMode?: boolean;
    planId?: string;
    ownerId?: string;
  }) => (
    <div
      data-testid="open3d-planner-host"
      data-guest-mode={guestMode ? "true" : "false"}
      data-plan-id={planId ?? ""}
      data-owner-id={ownerId ?? ""}
    />
  ),
}));

/**
 * Autosave identity contract:
 *   - Each guest URL owns a plan-scoped local key.
 *   - The unscoped guest key exists only for explicit legacy recovery.
 *   - A signed-in member opening `/planner/canvas?id=<plan>` gets a key scoped
 *     to that plan, so distinct cloud plans cannot overwrite each other.
 *   - A member with no plan id keeps the single legacy member slot.
 */

describe("getPlannerProjectId", () => {
  it("scopes the member key per plan id", () => {
    expect(getPlannerProjectId(false, TEST_CLOUD_PLAN_1)).toBe(
      `${MEMBER_PROJECT_ID}:${TEST_CLOUD_PLAN_1}`,
    );
    expect(getPlannerProjectId(false, TEST_CLOUD_PLAN_2)).toBe(
      `${MEMBER_PROJECT_ID}:${TEST_CLOUD_PLAN_2}`,
    );
    expect(getPlannerProjectId(false, TEST_CLOUD_PLAN_1)).not.toBe(
      getPlannerProjectId(false, TEST_CLOUD_PLAN_2),
    );
  });

  it("scopes member drafts by authenticated owner and plan", () => {
    expect(getPlannerProjectId(false, TEST_CLOUD_PLAN_1, "owner-a")).toBe(
      `${MEMBER_PROJECT_ID}:owner-a:${TEST_CLOUD_PLAN_1}`,
    );
    expect(getPlannerProjectId(false, TEST_CLOUD_PLAN_1, "owner-b")).not.toBe(
      getPlannerProjectId(false, TEST_CLOUD_PLAN_1, "owner-a"),
    );
    expect(getPlannerProjectId(false, undefined, "owner-a")).toBe(
      `${MEMBER_PROJECT_ID}:owner-a:default`,
    );
  });

  it("trims the plan id and falls back to the legacy member slot when blank", () => {
    expect(getPlannerProjectId(false, `  ${TEST_CLOUD_PLAN_1}  `)).toBe(
      `${MEMBER_PROJECT_ID}:${TEST_CLOUD_PLAN_1}`,
    );
    expect(getPlannerProjectId(false)).toBe(MEMBER_PROJECT_ID);
    expect(getPlannerProjectId(false, "")).toBe(MEMBER_PROJECT_ID);
    expect(getPlannerProjectId(false, "   ")).toBe(MEMBER_PROJECT_ID);
  });

  it("scopes each guest draft while preserving the explicit legacy slot", () => {
    expect(getPlannerProjectId(true)).toBe(GUEST_PROJECT_ID);
    expect(getPlannerProjectId(true, TEST_CLOUD_PLAN_1)).toBe(
      `${GUEST_PROJECT_PREFIX}${TEST_CLOUD_PLAN_1}`,
    );
    expect(getPlannerProjectId(true, TEST_CLOUD_PLAN_2)).toBe(
      `${GUEST_PROJECT_PREFIX}${TEST_CLOUD_PLAN_2}`,
    );
  });

  it("rejects malformed plan ids before persistence", () => {
    expect(() => getPlannerProjectId(true, "not-a-uuid")).toThrow(
      "Invalid Planner plan ID.",
    );
    expect(() => getPlannerProjectId(false, "plan-A")).toThrow(
      "Invalid Planner plan ID.",
    );
  });
});

describe("/planner/canvas route", () => {
  async function renderCanvas(searchParams: Record<string, string | string[] | undefined>) {
    const { default: PlannerCanvasRoute } = await import(
      "@/app/planner/(workspace)/canvas/page"
    );
    const page = await PlannerCanvasRoute({ searchParams: Promise.resolve(searchParams) });
    render(page);
    return screen.getByTestId("open3d-planner-host");
  }

  it("passes the query plan id into member workspace mode", async () => {
    getOptionalPlannerUser.mockResolvedValue({ id: "member-1" });

    const route = await renderCanvas({ id: TEST_CLOUD_PLAN_1 });

    expect(route.getAttribute("data-guest-mode")).toBe("false");
    expect(route.getAttribute("data-plan-id")).toBe(TEST_CLOUD_PLAN_1);
    expect(route.getAttribute("data-owner-id")).toBe("member-1");
  });

  it("rejects an array-valued plan id as ambiguous", async () => {
    getOptionalPlannerUser.mockResolvedValue({ id: "member-1" });

    await expect(
      renderCanvas({ id: [TEST_CLOUD_PLAN_1, TEST_CLOUD_PLAN_2] }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("falls back to the legacy member key when no plan id is provided", async () => {
    getOptionalPlannerUser.mockResolvedValue({ id: "member-2" });

    const route = await renderCanvas({});

    expect(route.getAttribute("data-guest-mode")).toBe("false");
    expect(route.getAttribute("data-plan-id")).toBe("");
    expect(route.getAttribute("data-owner-id")).toBe("member-2");
  });

  it("redirects unauthenticated canvas requests to the guest entry", async () => {
    getOptionalPlannerUser.mockResolvedValue(null);

    await expect(renderCanvas({ id: TEST_CLOUD_PLAN_1 })).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
  });
});
