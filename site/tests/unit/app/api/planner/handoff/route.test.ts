import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const insertMock = vi.fn();
const maybeSingleMock = vi.fn();
const limitMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const orderMock = vi.fn(() => ({ limit: limitMock }));
const eqRequirementMock = vi.fn(() => ({ order: orderMock }));
const eqSourceMock = vi.fn(() => ({ eq: eqRequirementMock }));
const selectMock = vi.fn(() => ({ eq: eqSourceMock }));

const fromMock = vi.fn(() => ({
  select: selectMock,
  insert: insertMock,
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth:
    (
      handler: (
        req: NextRequest,
        auth: {
          user: { id: string; email: string; role: string };
          isAdmin: boolean;
          requiredRole: string;
        },
      ) => Promise<Response>,
    ) =>
    (req: NextRequest) =>
      handler(req, {
        user: { id: "user-1", email: "member@example.com", role: "member" },
        isAdmin: false,
        requiredRole: "member",
      }),
}));

vi.mock("@/platform/supabase/auth-admin", () => ({
  createSupabaseAuthAdminClient: vi.fn(() => ({ from: fromMock })),
}));

vi.mock("@/features/planner/shared/handoff/notifyHandoffStaff", () => ({
  notifyHandoffStaff: vi.fn(async () => ({
    attempted: false,
    sent: false,
    reason: "email_not_configured",
  })),
}));

import { POST } from "@/app/api/planner/handoff/route";
import { createSupabaseAuthAdminClient } from "@/platform/supabase/auth-admin";
import { notifyHandoffStaff } from "@/features/planner/shared/handoff/notifyHandoffStaff";

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    idempotencyKey: "test-key-abcdef12",
    confirmDemoPricing: true,
    contact: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
    },
    boq: {
      kind: "open3d-furniture-boq-v1",
      projectId: "proj-1",
      projectName: "HQ Floor",
      calculationHash: "abc123hash",
      pricingMode: "demo-list-partial",
      pricingNote: "Demo list only",
      currencyCode: "INR",
      totalItems: 2,
      totalLines: 1,
      subtotalInr: 1000,
      gstInr: 180,
      totalInr: 1180,
      pricedItemCount: 2,
      unpricedItemCount: 0,
      lines: [
        {
          catalogId: "ws-v0-linear",
          name: "Workstation Linear",
          sku: "WS-1",
          category: "workstation",
          quantity: 2,
          unitPriceInr: 500,
          lineTotalInr: 1180,
          priced: true,
          priceSource: "demo-list",
        },
      ],
    },
    ...overrides,
  };
}

describe("app/api/planner/handoff/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    insertMock.mockReturnValue({
      select: vi.fn(() => ({
        single: vi.fn(async () => ({
          data: { id: "ref-1", created_at: "2026-07-17T00:00:00.000Z" },
          error: null,
        })),
      })),
    });
    vi.mocked(createSupabaseAuthAdminClient).mockReturnValue({
      from: fromMock,
    } as never);
    vi.mocked(notifyHandoffStaff).mockResolvedValue({
      attempted: false,
      sent: false,
      reason: "email_not_configured",
    });
  });

  it("returns 400 for invalid payload", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("returns 501 not_configured when CRM client is missing", async () => {
    vi.mocked(createSupabaseAuthAdminClient).mockImplementation(() => {
      throw new Error("Missing required env var: NEXT_ADMIN_SUPABASE_URL");
    });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("not_configured");
  });

  it("persists handoff and returns a reference id", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.referenceId).toBe("ref-1");
    expect(body.idempotentReplay).toBe(false);
    expect(insertMock).toHaveBeenCalled();
    expect(notifyHandoffStaff).toHaveBeenCalled();
  });

  it("replays the same idempotency key without a second insert", async () => {
    maybeSingleMock.mockResolvedValue({
      data: { id: "ref-existing", created_at: "2026-07-16T00:00:00.000Z" },
      error: null,
    });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.referenceId).toBe("ref-existing");
    expect(body.idempotentReplay).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("replays legacy handoff-key:{key} when scoped miss and owner matches", async () => {
    // First maybeSingle = scoped miss; second = legacy hit.
    maybeSingleMock
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({
        data: {
          id: "ref-legacy",
          created_at: "2026-07-15T00:00:00.000Z",
          followup_notes: JSON.stringify({ memberUserId: "user-1" }),
        },
        error: null,
      });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.referenceId).toBe("ref-legacy");
    expect(body.idempotentReplay).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
    expect(eqRequirementMock).toHaveBeenCalledWith(
      "requirement",
      "handoff-key:user-1:test-key-abcdef12",
    );
    expect(eqRequirementMock).toHaveBeenCalledWith(
      "requirement",
      "handoff-key:test-key-abcdef12",
    );
  });

  it("does not replay legacy key owned by another member", async () => {
    maybeSingleMock
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({
        data: {
          id: "ref-other",
          created_at: "2026-07-15T00:00:00.000Z",
          followup_notes: JSON.stringify({ memberUserId: "other-user" }),
        },
        error: null,
      });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.idempotentReplay).toBe(false);
    expect(body.referenceId).toBe("ref-1");
    expect(insertMock).toHaveBeenCalled();
  });

  it("fail-closes on idempotency lookup error without inserting", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: { message: "connection timeout" },
    });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("idempotency_lookup_failed");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("scopes idempotency requirement key by authenticated user id", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody({ idempotencyKey: "scoped-key-123456" })),
      }),
    );
    expect(res.status).toBe(200);
    // requirement filter must include user-1 scope.
    expect(eqRequirementMock).toHaveBeenCalledWith(
      "requirement",
      "handoff-key:user-1:scoped-key-123456",
    );
    expect(insertMock).toHaveBeenCalled();
    const insertArg = insertMock.mock.calls[0]?.[0] as { requirement?: string };
    expect(insertArg.requirement).toBe("handoff-key:user-1:scoped-key-123456");
  });

  it("returns 400 when contact has neither email nor phone", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          validBody({
            contact: { name: "Ada Lovelace", company: "Analytical Engines" },
          }),
        ),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toMatch(/email or phone/i);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns 400 when confirmDemoPricing is not true", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody({ confirmDemoPricing: false })),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(String(body.message)).toMatch(/confirmDemoPricing/i);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("reports staffNotified true when Resend notify succeeds", async () => {
    vi.mocked(notifyHandoffStaff).mockResolvedValue({
      attempted: true,
      sent: true,
    });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.staffNotified).toBe(true);
    expect(String(body.message)).toMatch(/staff were notified/i);
  });

  it("keeps success when staff notify is not configured", async () => {
    vi.mocked(notifyHandoffStaff).mockResolvedValue({
      attempted: false,
      sent: false,
      reason: "email_not_configured",
    });
    const res = await POST(
      new NextRequest("http://localhost/api/planner/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.staffNotified).toBe(false);
    expect(String(body.message)).toMatch(/not configured|still saved/i);
  });
});

