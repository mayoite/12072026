import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { ApiError } from "@/features/shared/api/ApiError";
import { readAdminPriceBook } from "@/features/admin/pricing/priceBookAdmin.server";

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
  readAdminPriceBook: vi.fn(),
}));

import { GET } from "@/app/api/admin/price-books/[bookId]/route";

const routeContext = {
  params: Promise.resolve({ bookId: "pb-linear-2026-q3" }),
};

describe("app/api/admin/price-books/[bookId]/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns price book payload on success", async () => {
    vi.mocked(readAdminPriceBook).mockResolvedValue({
      contract: { bookId: "pb-linear-2026-q3" },
      snapshot: { book: {}, versions: [] },
    } as never);

    const res = await GET(
      new NextRequest("http://localhost/api/admin/price-books/pb-linear-2026-q3"),
      routeContext,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.contract.bookId).toBe("pb-linear-2026-q3");
    expect(readAdminPriceBook).toHaveBeenCalledWith("pb-linear-2026-q3");
  });

  it("GET returns 404 when book contract is missing", async () => {
    vi.mocked(readAdminPriceBook).mockResolvedValue(null);

    const res = await GET(
      new NextRequest("http://localhost/api/admin/price-books/missing"),
      { params: Promise.resolve({ bookId: "missing" }) },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("RESOURCE_NOT_FOUND");
    expect(ApiError).toBeTypeOf("function");
  });
});
