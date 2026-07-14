import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { ApiError, toApiError } from "@/features/shared/api/ApiError";
import { error } from "@/features/shared/api/apiResponse";
import { listAdminPriceBooks } from "@/features/admin/pricing/priceBookAdmin.server";

vi.mock("@/features/shared/api/withAuth", async () => {
  const { error: errorFn } = await import("@/features/shared/api/apiResponse");
  const { ApiError: AE, toApiError: toAE } = await import(
    "@/features/shared/api/ApiError"
  );
  const adminAuth = {
    user: { id: "admin-1", email: "a@test.com", role: "admin" },
    isAdmin: true,
    requiredRole: "admin" as const,
  };
  return {
    withAuth: (
      handler: (
        req: NextRequest,
        auth: typeof adminAuth,
        context: unknown,
      ) => Promise<Response>,
    ) => {
      return async (req: NextRequest, context?: unknown) => {
        try {
          return await handler(req, adminAuth, context);
        } catch (err) {
          if (err instanceof AE) return errorFn(err);
          return errorFn(toAE(err));
        }
      };
    },
  };
});

vi.mock("@/features/admin/pricing/priceBookAdmin.server", () => ({
  listAdminPriceBooks: vi.fn(),
}));

import { GET } from "@/app/api/admin/price-books/route";

describe("app/api/admin/price-books/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns listed price books", async () => {
    vi.mocked(listAdminPriceBooks).mockReturnValue([
      "pb-linear-2026-q3",
      "pb-other",
    ]);
    const res = await GET(
      new NextRequest("http://localhost/api/admin/price-books"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.books).toEqual(["pb-linear-2026-q3", "pb-other"]);
  });

  it("GET serializes thrown ApiError as failure envelope", async () => {
    vi.mocked(listAdminPriceBooks).mockImplementation(() => {
      throw new ApiError(500, "INTERNAL_ERROR", "store unavailable");
    });
    const res = await GET(
      new NextRequest("http://localhost/api/admin/price-books"),
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("store unavailable");
    // keep helpers referenced for type-safety of mock factory path
    expect(error).toBeTypeOf("function");
    expect(toApiError).toBeTypeOf("function");
  });
});
