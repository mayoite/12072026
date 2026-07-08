/**
 * Single ID policy for planner entities: crypto.randomUUID() only (RFC 4122 string with hyphens).
 * No plc-/timestamp/random suffixes.
 */
export function newEntityId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  throw new Error(
    "crypto.randomUUID is required for entity ids (modern browser or Node 19+).",
  );
}

/** UUID v4 shape check (hyphenated). */
export function isEntityUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}
