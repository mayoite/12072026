/** Discriminated union of all persistence error variants for the Open3D staging layer.
 *
 * Maps from plannerCloudApi.ts error codes:
 *   planner:no-auth (401)  → unauthenticated
 *   planner:no-auth (403)  → forbidden
 *   load returns null/404  → not-found
 *   parse failure          → corrupt
 *   version rejection      → unsupported-schema
 *   fetch throws           → network
 *   HTTP 409               → conflict
 */

export type Open3dPersistenceErrorKind =
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "corrupt"
  | "unsupported-schema"
  | "network"
  | "conflict";

export class Open3dPersistenceError extends Error {
  constructor(
    public readonly kind: Open3dPersistenceErrorKind,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "Open3dPersistenceError";
  }
}

export interface ApiErrorLike {
  code?: string;
  status?: number;
  message: string;
}

/** Maps a raw API/network rejection into an Open3dPersistenceError. */
export function mapToPersistenceError(error: unknown): Open3dPersistenceError {
  if (error instanceof Open3dPersistenceError) return error;

  const err = error as ApiErrorLike;
  const code = typeof err?.code === "string" ? err.code : "";
  const status = typeof err?.status === "number" ? err.status : 0;
  const message = typeof err?.message === "string" ? err.message : "Unknown persistence error";

  if (code === "planner:no-auth" && status === 403) {
    return new Open3dPersistenceError("forbidden", message, error);
  }
  if (code === "planner:no-auth" || status === 401) {
    return new Open3dPersistenceError("unauthenticated", message, error);
  }
  if (status === 404) {
    return new Open3dPersistenceError("not-found", message, error);
  }
  if (status === 409) {
    return new Open3dPersistenceError("conflict", message, error);
  }
  if (code === "planner:load-failed" && message.toLowerCase().includes("corrupt")) {
    return new Open3dPersistenceError("corrupt", message, error);
  }
  if (code === "planner:load-failed" && message.toLowerCase().includes("schema")) {
    return new Open3dPersistenceError("unsupported-schema", message, error);
  }
  if (
    error instanceof TypeError ||
    (error instanceof Error && (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch")
    ))
  ) {
    return new Open3dPersistenceError("network", message, error);
  }
  // Default unmapped errors to network (safe — surfaces to user as retry)
  return new Open3dPersistenceError("network", message, error);
}

export function isUnauthenticated(err: Open3dPersistenceError): boolean {
  return err.kind === "unauthenticated";
}
export function isForbidden(err: Open3dPersistenceError): boolean {
  return err.kind === "forbidden";
}
export function isNotFound(err: Open3dPersistenceError): boolean {
  return err.kind === "not-found";
}
export function isCorrupt(err: Open3dPersistenceError): boolean {
  return err.kind === "corrupt";
}
export function isUnsupportedSchema(err: Open3dPersistenceError): boolean {
  return err.kind === "unsupported-schema";
}
export function isNetworkError(err: Open3dPersistenceError): boolean {
  return err.kind === "network";
}
export function isConflict(err: Open3dPersistenceError): boolean {
  return err.kind === "conflict";
}
