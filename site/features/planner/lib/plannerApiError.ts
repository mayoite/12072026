/**
 * Human-readable planner API error messages for workspace chrome.
 * Prefer server message; map status when body is empty.
 */

import { CSRF_REJECTION_HEADER_NAME } from "@/lib/security/csrfConstants";

export async function readPlannerApiError(
  response: Response,
  fallback = "Request failed.",
): Promise<string> {
  let code: string | undefined;
  let message: string | undefined;
  try {
    const body = (await response.clone().json()) as {
      error?: string | { code?: string; message?: string };
      message?: string;
      code?: string;
    };
    if (typeof body.message === "string" && body.message.trim()) {
      message = body.message.trim();
    }
    if (typeof body.error === "string" && body.error.trim()) {
      message = message ?? body.error.trim();
    }
    if (body.error && typeof body.error === "object") {
      if (typeof body.error.message === "string" && body.error.message.trim()) {
        message = body.error.message.trim();
      }
      if (typeof body.error.code === "string") {
        code = body.error.code;
      }
    }
    if (typeof body.code === "string") {
      code = body.code;
    }
  } catch {
    // non-JSON
  }

  if (
    code === "CSRF_FAILED" ||
    response.headers.get(CSRF_REJECTION_HEADER_NAME) === "1"
  ) {
    return "Security check failed. Refresh the page and try again.";
  }
  if (message) return message;
  if (response.status === 401) return "Sign in required for this action.";
  if (response.status === 403) return "You do not have permission for this action.";
  if (response.status === 404) return "Not found.";
  if (response.status === 410) return "This endpoint is no longer available.";
  if (response.status === 429) return "Too many requests. Wait a moment and try again.";
  if (response.status === 501) return "This feature is not configured yet.";
  if (response.status >= 500) return "Server error. Try again in a moment.";
  return `${fallback} (${response.status})`;
}
