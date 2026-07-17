import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { notifyHandoffStaff } from "@/features/planner/shared/handoff/notifyHandoffStaff";

const baseInput = {
  referenceId: "ref-1",
  projectName: "North Wing",
  contactName: "Ada",
  contactEmail: "ada@example.com",
  contactPhone: "+91 90000 00000",
  company: "Oando",
  totalItems: 3,
  totalInr: 12000,
  pricingNote: "demo pricing",
  linePreview: "1 × Desk",
};

describe("notifyHandoffStaff", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;
    delete process.env.STAFF_NOTIFY_EMAIL;
    delete process.env.EMAIL_FROM;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("skips when Resend or staff email is not configured", async () => {
    const result = await notifyHandoffStaff(baseInput);
    expect(result).toEqual({
      attempted: false,
      sent: false,
      reason: "email_not_configured",
    });
  });

  it("filters optional contact fields and sends a string-only body", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.STAFF_NOTIFY_EMAIL = "staff@example.com";
    process.env.EMAIL_FROM = "Planner <planner@example.com>";

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "email_1" }), { status: 200 }),
    );

    const result = await notifyHandoffStaff({
      ...baseInput,
      contactEmail: undefined,
      contactPhone: undefined,
      company: undefined,
    });

    expect(result).toEqual({ attempted: true, sent: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.method).toBe("POST");
    const body = JSON.parse(String(init?.body)) as { text: string; to: string[] };
    expect(body.to).toEqual(["staff@example.com"]);
    expect(body.text).toContain("Reference: ref-1");
    expect(body.text).toContain("Contact: Ada");
    expect(body.text).not.toContain("Email:");
    expect(body.text).not.toContain("Phone:");
    expect(body.text).not.toContain("Company:");
    expect(body.text).not.toMatch(/\bnull\b/);
    expect(body.text).not.toMatch(/\bundefined\b/);
  });

  it("returns resend status reason when the API rejects", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.STAFF_NOTIFY_EMAIL = "staff@example.com";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 422 }),
    );

    const result = await notifyHandoffStaff(baseInput);
    expect(result).toEqual({
      attempted: true,
      sent: false,
      reason: "resend_422",
    });
  });
});
