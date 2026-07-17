/**
 * P1 entry-state matrix (FINISH-PLAN):
 * new · resume · migrate · missing · malformed · expired · unauthorized
 *
 * Route + persistence + API contracts in one named suite.
 * Browser exit-gate (two UUID drafts / reload isolation) lives in
 * `tests/e2e/planner-entry-states.spec.ts`.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { NextRequest } from "next/server";

import PlannerGuestRoute from "@/app/planner/(workspace)/guest/page";
import PlannerCanvasRoute from "@/app/planner/(workspace)/canvas/page";
import { GET as getPlanById } from "@/app/api/plans/[id]/route";
import { isEntityUuid, newEntityId } from "@/features/planner/lib/newEntityId";
import {
  getPlannerProjectId,
  migrateGuestProjectToMember,
  shouldMigrateGuestPlan,
  clearGuestPlanClaimed,
  type BuddyProject,
} from "@/features/planner/persistence/persistence";
import {
  resolvePlannerDraftDocument,
  savePlannerDraftDocument,
  PLANNER_DRAFT_TTL_MS,
} from "@/features/planner/persistence/plannerDraft";
import { createEmptyPlannerDocument } from "@/features/planner/model/plannerDocument";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";
import { createServerClient } from "@/platform/supabase/server";
import {
  loadPlannerDocumentFromStore,
} from "@/features/planner/cloud-store/plannerSaves";
import { rateLimit } from "@/lib/rateLimit";
import {
  TEST_CLOUD_PLAN_1,
  TEST_CLOUD_PLAN_2,
  TEST_PLAN_ID_1,
  TEST_USER_ID,
} from "@/tests/fixtures/plannerTestUuids";

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
      data-testid="entry-workspace"
      data-guest-mode={String(guestMode)}
      data-plan-id={planId ?? ""}
      data-owner-id={ownerId ?? ""}
    />
  ),
}));

vi.mock("@/lib/auth/plannerSession", () => ({
  getOptionalPlannerUser: vi.fn(),
}));

vi.mock("@/platform/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/features/planner/cloud-store/plannerSaves", () => ({
  loadPlannerDocumentFromStore: vi.fn(),
  savePlannerDocumentToStore: vi.fn(),
  deletePlannerDocumentFromStore: vi.fn(),
}));

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/features/shared/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res: Response) => res),
}));

function makeBuddy(id: string, snapshot?: string): BuddyProject {
  return {
    id,
    name: id,
    createdAt: 1,
    updatedAt: 2,
    snapshot: snapshot ?? "",
  };
}

function redirectTarget(error: unknown): string {
  const digest = (error as { digest: string }).digest;
  return digest.split(";")[2] ?? "";
}

describe("P1 entry states — new", () => {
  it("bare /planner/guest/ mints a UUID and redirects to that draft URL", async () => {
    let thrown: unknown;
    try {
      await PlannerGuestRoute({ searchParams: Promise.resolve({}) });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
    const id = new URL(redirectTarget(thrown), "http://planner.local").searchParams.get("id");
    expect(id).toBeTruthy();
    expect(isEntityUuid(id ?? "")).toBe(true);
  });

  it("two runtime UUIDs map to independent guest IndexedDB keys", () => {
    const a = newEntityId();
    const b = newEntityId();
    expect(a).not.toBe(b);
    expect(getPlannerProjectId(true, a)).toBe(`planner-guest-local:${a}`);
    expect(getPlannerProjectId(true, b)).toBe(`planner-guest-local:${b}`);
    expect(getPlannerProjectId(true, a)).not.toBe(getPlannerProjectId(true, b));
  });
});

describe("P1 entry states — resume", () => {
  it("valid guest ?id= renders workspace scoped to that plan id", async () => {
    render(
      await PlannerGuestRoute({
        searchParams: Promise.resolve({ id: TEST_CLOUD_PLAN_1 }),
      }),
    );
    const host = screen.getByTestId("entry-workspace");
    expect(host).toHaveAttribute("data-guest-mode", "true");
    expect(host).toHaveAttribute("data-plan-id", TEST_CLOUD_PLAN_1);
  });

  it("member canvas with ?id= resumes under owner scope", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: TEST_USER_ID,
      email: "member@test.com",
    } as never);
    render(
      await PlannerCanvasRoute({
        searchParams: Promise.resolve({ id: TEST_PLAN_ID_1 }),
      }),
    );
    const host = screen.getByTestId("entry-workspace");
    expect(host).toHaveAttribute("data-guest-mode", "false");
    expect(host).toHaveAttribute("data-plan-id", TEST_PLAN_ID_1);
    expect(host).toHaveAttribute("data-owner-id", TEST_USER_ID);
    expect(getPlannerProjectId(false, TEST_PLAN_ID_1, TEST_USER_ID)).toContain(
      encodeURIComponent(TEST_USER_ID),
    );
  });
});

describe("P1 entry states — migrate", () => {
  beforeEach(() => {
    clearGuestPlanClaimed();
    clearGuestPlanClaimed(TEST_PLAN_ID_1);
  });

  it("copies guest snapshot into empty member slot once", async () => {
    const guestId = getPlannerProjectId(true, TEST_PLAN_ID_1);
    const memberId = getPlannerProjectId(false, TEST_PLAN_ID_1, TEST_USER_ID);
    const snapshot = JSON.stringify({ version: 1, store: { schema: {} } });
    const saved: BuddyProject[] = [];

    expect(
      shouldMigrateGuestPlan(makeBuddy(guestId, snapshot), undefined, false),
    ).toBe(true);

    const result = await migrateGuestProjectToMember({
      loadProject: async (id) => {
        if (id === guestId) return makeBuddy(guestId, snapshot);
        return undefined;
      },
      saveProject: async (project) => {
        saved.push(project);
      },
    }, TEST_PLAN_ID_1, TEST_USER_ID);

    expect(result).toBe("migrated");
    expect(saved).toHaveLength(1);
    expect(saved[0]?.id).toBe(memberId);
    expect(saved[0]?.snapshot).toBe(snapshot);
  });

  it("does not overwrite an existing member snapshot", async () => {
    const guestId = getPlannerProjectId(true, TEST_PLAN_ID_1);
    const memberId = getPlannerProjectId(false, TEST_PLAN_ID_1, TEST_USER_ID);
    const snapshot = JSON.stringify({ version: 1 });
    const saved: BuddyProject[] = [];

    const result = await migrateGuestProjectToMember({
      loadProject: async (id) => {
        if (id === guestId) return makeBuddy(guestId, snapshot);
        if (id === memberId) return makeBuddy(memberId, snapshot);
        return undefined;
      },
      saveProject: async (project) => {
        saved.push(project);
      },
    }, TEST_PLAN_ID_1, TEST_USER_ID);

    expect(result).toBe("skipped");
    expect(saved).toHaveLength(0);
  });
});

describe("P1 entry states — missing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: 1 } as never);
    vi.mocked(createServerClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: TEST_USER_ID } } }) },
    } as never);
  });

  it("GET /api/plans/[id] returns 404 when the plan is missing", async () => {
    vi.mocked(loadPlannerDocumentFromStore).mockResolvedValue(null);
    const res = await getPlanById(
      new NextRequest(`http://localhost/api/plans/${TEST_PLAN_ID_1}`),
      { params: Promise.resolve({ id: TEST_PLAN_ID_1 }) },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("draft resolve reports missing when no envelope exists", () => {
    window.localStorage.clear();
    const result = resolvePlannerDraftDocument({ documentId: "missing-doc-id" });
    expect(result.status).toBe("missing");
    expect(result.document).toBeNull();
  });
});

describe("P1 entry states — malformed", () => {
  it("guest route 404s on non-UUID plan ids", async () => {
    await expect(
      PlannerGuestRoute({ searchParams: Promise.resolve({ id: "not-a-uuid" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("guest route 404s on empty and ambiguous ids", async () => {
    await expect(
      PlannerGuestRoute({ searchParams: Promise.resolve({ id: "" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
    await expect(
      PlannerGuestRoute({
        searchParams: Promise.resolve({
          id: [TEST_CLOUD_PLAN_1, TEST_CLOUD_PLAN_2],
        }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("member canvas 404s on malformed plan ids", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: TEST_USER_ID,
      email: "member@test.com",
    } as never);
    await expect(
      PlannerCanvasRoute({ searchParams: Promise.resolve({ id: "plan-99" }) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });

  it("persistence rejects malformed ids before building storage keys", () => {
    expect(() => getPlannerProjectId(true, "not-a-uuid")).toThrow(/Invalid Planner plan ID/i);
  });
});

describe("P1 entry states — expired", () => {
  it("draft resolve reports expired after TTL and clears usable document", () => {
    window.localStorage.clear();
    const documentId = TEST_PLAN_ID_1;
    const doc = createEmptyPlannerDocument({ id: documentId });
    const nowMs = Date.parse("2026-07-17T10:00:00.000Z");
    vi.spyOn(Date, "now").mockReturnValue(nowMs);
    savePlannerDraftDocument(doc, { documentId });

    vi.spyOn(Date, "now").mockReturnValue(nowMs + PLANNER_DRAFT_TTL_MS + 1);
    // Force the expired branch when cleanup cannot delete (same contract as plannerDraft tests).
    vi.spyOn(window.localStorage, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const result = resolvePlannerDraftDocument({ documentId });
    expect(result.status).toBe("expired");
    expect(result.document).toBeNull();
  });
});

describe("P1 entry states — unauthorized", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: 1 } as never);
  });

  it("unauthenticated canvas redirects to guest entry", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue(null);
    await expect(
      PlannerCanvasRoute({ searchParams: Promise.resolve({}) }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT;replace;/planner/guest/"),
    });
  });

  it("GET /api/plans/[id] returns 401 when unauthenticated", async () => {
    vi.mocked(createServerClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never);
    const res = await getPlanById(
      new NextRequest(`http://localhost/api/plans/${TEST_PLAN_ID_1}`),
      { params: Promise.resolve({ id: TEST_PLAN_ID_1 }) },
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe("AUTH_REQUIRED");
  });

  it("GET /api/plans/[id] scopes load to the authenticated owner (enumeration blocked)", async () => {
    vi.mocked(createServerClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: TEST_USER_ID, app_metadata: {} } },
        }),
      },
    } as never);
    vi.mocked(loadPlannerDocumentFromStore).mockResolvedValue(null);

    const res = await getPlanById(
      new NextRequest(`http://localhost/api/plans/${TEST_PLAN_ID_1}`),
      { params: Promise.resolve({ id: TEST_PLAN_ID_1 }) },
    );
    expect(res.status).toBe(404);
    expect(loadPlannerDocumentFromStore).toHaveBeenCalledWith(
      TEST_PLAN_ID_1,
      TEST_USER_ID,
    );
  });
});
