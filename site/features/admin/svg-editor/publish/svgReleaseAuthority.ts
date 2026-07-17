/**
 * Live released-SVG authority mode.
 *
 * - `disk` (default): inventory + public/svg-catalog remain release authority.
 *   Dual-write injects only when Products DB + R2 are ready
 *   (`resolveSvgPublishDualWriteDeps`). When dual-write is enabled it is
 *   fail-closed (DB/R2 failure rolls back disk). Dead R2 skips dual-write so
 *   disk-only publish still succeeds. Supabase Storage mirror is separate and
 *   best-effort (never rolls back disk).
 * - `db`: Products DB revision pointer + R2 artifact bytes are sole public
 *   release authority. Disk is not a silent override (DB-SVG-16). Dual-write
 *   deps are required; missing DB/R2 fails closed before publish.
 *
 * Flip only after one successful production dual-write publish is proven
 * (see Failures.md + docs/architecture/08-DATABASE-SVG-CONTRACT.md).
 *
 * Enabled dual-write ≠ cutover. Default remains disk until Failures.md closes.
 */

export type SvgReleaseAuthority = "disk" | "db";

export type SvgDualWriteModeForAuthority =
  | "enabled"
  | "skipped_no_db"
  | "skipped_r2_unavailable"
  | "skipped_schema_missing";

export function getSvgReleaseAuthority(
  env: NodeJS.ProcessEnv = process.env,
): SvgReleaseAuthority {
  const raw = env.SVG_RELEASE_AUTHORITY?.trim().toLowerCase() ?? "";
  if (raw === "db" || raw === "database" || raw === "r2") {
    return "db";
  }
  return "disk";
}

export function isDbSvgReleaseAuthority(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return getSvgReleaseAuthority(env) === "db";
}

/**
 * When SVG_RELEASE_AUTHORITY=db, dual-write deps must be injected.
 * Returns a fail-closed error string, or null when publish may proceed.
 *
 * Prefer `mode` from `resolveSvgPublishDualWriteDeps` at the entry gate.
 * Pipeline uses `productsDbConfigured` when mode is unavailable.
 */
export function getDbReleaseAuthorityDualWriteBlockError(input: {
  readonly dualWriteReady: boolean;
  readonly mode?: SvgDualWriteModeForAuthority;
  readonly productsDbConfigured?: boolean;
  readonly env?: NodeJS.ProcessEnv;
}): string | null {
  if (!isDbSvgReleaseAuthority(input.env)) {
    return null;
  }
  if (input.dualWriteReady) {
    return null;
  }
  if (input.mode === "skipped_no_db") {
    return "DB release authority requires PRODUCTS_DATABASE_URL";
  }
  if (input.mode === "skipped_r2_unavailable") {
    return "DB release authority requires reachable R2 catalog storage";
  }
  if (input.mode === "skipped_schema_missing") {
    return "DB release authority requires planner_managed_products.published_svg_revision_id (run db:apply)";
  }
  if (input.productsDbConfigured === false) {
    return "DB release authority requires PRODUCTS_DATABASE_URL";
  }
  // Ready=false with DB configured (or unknown) → require reachable R2.
  return "DB release authority requires reachable R2 catalog storage";
}
