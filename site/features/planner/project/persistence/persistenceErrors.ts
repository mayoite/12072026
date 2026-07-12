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

export type PlannerPersistenceErrorKind =
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "corrupt"
  | "unsupported-schema"
  | "network"
  | "conflict";

export class PlannerPersistenceError extends Error {
  constructor(
    public readonly kind: PlannerPersistenceErrorKind,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "PlannerPersistenceError";
  }
}

export interface ApiErrorLike {
  code?: string;
  status?: number;
  message: string;
}

// mapToPersistenceError + is* helpers removed (dead, unused in prod). Kept class for potential; PLAN-FAIL-0408 clean.
