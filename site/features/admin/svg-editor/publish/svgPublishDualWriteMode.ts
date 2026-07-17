/**
 * Dual-write readiness mode labels (client-safe).
 *
 * Keep this module free of server-only deps so Admin list chrome can show
 * honesty without pulling Products DB / R2 clients into the browser bundle.
 *
 * Modes match resolveSvgPublishDualWriteDeps. `enabled` is readiness only —
 * disk remains live release authority until cutover.
 */

export type SvgPublishDualWriteMode =
  | "enabled"
  | "skipped_no_db"
  | "skipped_r2_unavailable"
  | "skipped_schema_missing";

/**
 * Pure Admin list source-line for dual-write readiness.
 * Never claims DB cutover.
 */
export function formatSvgDualWriteListSourceMeta(
  mode: SvgPublishDualWriteMode,
): string {
  return `Dual-write: ${mode} · live authority remains disk until cutover`;
}
