import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/customer-queries/route";
import { createSupabaseAuthAdminClient } from "@/platform/supabase/auth-admin";
import { rateLimit } from "@/lib/rateLimit";
import { API_ERROR_CODES } from "@/features/shared/api/ApiError";

vi.mock("@/platform/supabase/auth-admin", () => ({
  createSupabaseAuthAdminClient: vi.fn(),
}));

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

describe("app/api/customer-queries/route.ts", () => {
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: "query-1",
          created_at: "2026-01-01T00:00:00Z",
          email: "user@example.com",
          phone: "919876543210",
        },
        error: null,
      }),
    };
    vi.mocked(createSupabaseAuthAdminClient).mockReturnValue(mockSupabase as never);
    vi.mocked(rateLimit).mockResolvedValue({ success: true, reset: 1 });
  });

  const createReq = (body: Record<string, unknown>) =>
    new NextRequest("http://localhost/api/customer-queries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("returns 429 when rate limited", async () => {
    vi.mocked(rateLimit).mockResolvedValue({ success: false, reset: 100 });
    const res = await POST(createReq({ name: "A", message: "Hi", email: "a@b.com" }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(API_ERROR_CODES.RATE_LIMIT_EXCEEDED);
    expect(res.headers.get("X-RateLimit-Reset")).toBe("100");
  });

  it("returns 400 when name or message is missing", async () => {
    const res = await POST(createReq({ email: "a@b.com" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(API_ERROR_CODES.MISSING_REQUIRED_FIELD);
    expect(body.error.message).toBe("Name and message are required.");
  });

  it("returns 400 when neither email nor phone is provided", async () => {
    const res = await POST(createReq({ name: "Alex", message: "Need chairs" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(API_ERROR_CODES.MISSING_REQUIRED_FIELD);
    expect(body.error.message).toBe("Please provide email or phone.");
  });

  it("creates query and returns follow-up links", async () => {
    const res = await POST(
      createReq({
        name: "Alex",
        message: "Need 20 chairs",
        email: "user@example.com",
        phone: "919876543210",
      }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.queryId).toBe("query-1");
    expect(body.followUp.email).toContain("mailto:user@example.com");
    expect(body.followUp.whatsapp).toContain("https://wa.me/919876543210");
    expect(mockSupabase.from).toHaveBeenCalledWith("customer_queries");
  });

  it("returns honeypot success without persisting", async () => {
    const res = await POST(
      createReq({
        name: "Bot",
        message: "spam",
        email: "bot@evil.com",
        website: "http://spam.example",
      }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.queryId).toBe("submitted");
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });
});