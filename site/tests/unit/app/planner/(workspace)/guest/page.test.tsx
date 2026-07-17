import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerGuestRoute, { dynamic } from "@/app/planner/(workspace)/guest/page";
import { isEntityUuid } from "@/features/planner/lib/newEntityId";
import {
  TEST_CLOUD_PLAN_1,
  TEST_CLOUD_PLAN_2,
} from "@/tests/fixtures/plannerTestUuids";

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({ guestMode, planId }: { guestMode?: boolean; planId?: string }) => (
    <div
      data-testid="open3d-planner-route"
      data-guest-mode={String(guestMode)}
      data-plan-id={planId ?? ""}
    />
  ),
}));

describe("PlannerGuestRoute", () => {
  it("exports dynamic configuration", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("redirects a bare guest route to a new UUID-scoped draft", async () => {
    let redirectError: unknown;
    try {
      await PlannerGuestRoute({ searchParams: Promise.resolve({}) });
    } catch (error) {
      redirectError = error;
    }

    expect(redirectError).toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
    const digest = (redirectError as { digest: string }).digest;
    const redirectTarget = digest.split(";")[2];
    const id = new URL(redirectTarget, "http://planner.local").searchParams.get("id");
    expect(id).not.toBeNull();
    expect(isEntityUuid(id ?? "")).toBe(true);
  });

  it("renders a valid guest draft with its plan id", async () => {
    render(
      await PlannerGuestRoute({
        searchParams: Promise.resolve({ id: TEST_CLOUD_PLAN_1 }),
      }),
    );
    const host = screen.getByTestId("open3d-planner-route");
    expect(host).toBeInTheDocument();
    expect(host).toHaveAttribute("data-guest-mode", "true");
    expect(host).toHaveAttribute("data-plan-id", TEST_CLOUD_PLAN_1);
  });

  it("rejects repeated plan ids as ambiguous", async () => {
    await expect(
      PlannerGuestRoute({
        searchParams: Promise.resolve({ id: [TEST_CLOUD_PLAN_1, TEST_CLOUD_PLAN_2] }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects an explicitly empty plan id", async () => {
    await expect(
      PlannerGuestRoute({ searchParams: Promise.resolve({ id: "" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects a plan id combined with legacy recovery", async () => {
    await expect(
      PlannerGuestRoute({
        searchParams: Promise.resolve({ id: TEST_CLOUD_PLAN_1, resume: "1" }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects malformed guest plan ids", async () => {
    await expect(
      PlannerGuestRoute({ searchParams: Promise.resolve({ id: "not-a-uuid" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("rejects overlong guest plan ids", async () => {
    await expect(
      PlannerGuestRoute({ searchParams: Promise.resolve({ id: "a".repeat(256) }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("keeps the legacy shared draft behind an explicit recovery flag", async () => {
    render(
      await PlannerGuestRoute({ searchParams: Promise.resolve({ resume: "1" }) }),
    );
    expect(screen.getByTestId("open3d-planner-route")).toHaveAttribute(
      "data-plan-id",
      "",
    );
  });
});
