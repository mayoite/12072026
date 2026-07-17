// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readPlannerApiError } from "@/features/planner/lib/plannerApiError";
import { CSRF_REJECTION_HEADER_NAME } from "@/lib/security/csrfConstants";

function jsonResponse(
  status: number,
  body: unknown,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });
}

describe("readPlannerApiError", () => {
  it("prefers envelope error.message", async () => {
    const res = jsonResponse(400, {
      success: false,
      error: { code: "INVALID_INPUT", message: "Invalid JSON body" },
    });
    await expect(readPlannerApiError(res)).resolves.toBe("Invalid JSON body");
  });

  it("maps CSRF rejection header to a refresh message", async () => {
    const res = jsonResponse(
      403,
      { success: false, error: { code: "CSRF_FAILED", message: "Invalid or missing CSRF token" } },
      { [CSRF_REJECTION_HEADER_NAME]: "1" },
    );
    await expect(readPlannerApiError(res)).resolves.toMatch(/refresh/i);
  });

  it("maps 501 not configured", async () => {
    const res = jsonResponse(501, {
      success: false,
      error: "not_configured",
      message: "Quote handoff to Oando is not configured.",
    });
    await expect(readPlannerApiError(res)).resolves.toMatch(/not configured/i);
  });

  it("falls back by status when body is empty", async () => {
    const res = new Response("", { status: 429 });
    await expect(readPlannerApiError(res)).resolves.toMatch(/too many/i);
  });
});
