import { describe, it, expect, vi } from "vitest";
import { success, error, rateLimitedError, validationError } from "@/lib/api/apiResponse";
import { API_ERROR_CODES, ApiError } from "@/lib/api/ApiError";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

describe("apiResponse helpers", () => {
  it("creates a success response with spread payload", () => {
    const res = success({ val: 123 }, 201);
    expect(res).toEqual({
      body: { success: true, val: 123 },
      init: { status: 201 },
    });
  });

  it("creates an error response from ApiError", () => {
    const apiError = new ApiError(404, API_ERROR_CODES.RESOURCE_NOT_FOUND, "Not Found", { id: "1" });
    const res = error(apiError);
    expect(res).toEqual({
      body: {
        success: false,
        error: {
          code: "RESOURCE_NOT_FOUND",
          message: "Not Found",
          details: { id: "1" },
        },
      },
      init: {
        status: 404,
        headers: undefined,
      },
    });
  });

  it("handles rateLimitedError helper", () => {
    const res = rateLimitedError("Slow down", 60);
    expect(res).toEqual({
      body: {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Slow down",
        },
      },
      init: {
        status: 429,
        headers: { "X-RateLimit-Reset": "60" },
      },
    });
  });

  it("handles validationError helper", () => {
    const res = validationError([{ path: ["email"], message: "Invalid email" }]);
    expect(res).toEqual({
      body: {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: {
            issues: [
              { path: "email", message: "Invalid email" },
            ],
          },
        },
      },
      init: {
        status: 400,
        headers: undefined,
      },
    });
  });
});
