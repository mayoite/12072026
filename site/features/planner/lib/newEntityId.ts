/**
 * Single ID policy for planner entities: **UUID v7** (RFC 9562, time-ordered).
 * No plc- / timestamp / random suffixes. Package: `uuid` (site pin).
 *
 * Reads still accept any valid RFC UUID (legacy v4 documents).
 */
import { v7 as uuidv7, validate as uuidValidate, version as uuidVersion } from "uuid";

/** Mint version for new planner project / entity ids. */
export const PLANNER_ENTITY_UUID_VERSION = 7 as const;

/**
 * Mint a new planner entity id (UUID v7).
 */
export function newEntityId(): string {
  return uuidv7();
}

/** True for any valid RFC UUID string (v1–v8) — use when accepting loaded documents. */
export function isEntityUuid(id: string): boolean {
  return typeof id === "string" && uuidValidate(id);
}

/** True when id is UUID v7 (current mint policy). */
export function isPlannerEntityUuidV7(id: string): boolean {
  if (!isEntityUuid(id)) return false;
  return uuidVersion(id) === PLANNER_ENTITY_UUID_VERSION;
}
