/**
 * Live released-SVG authority mode.
 *
 * - `disk` (default): inventory + public/svg-catalog remain release authority.
 *   Dual-write is optional best-effort when Products DB + R2 are ready.
 * - `db`: Products DB revision pointer + R2 artifact bytes are sole public
 *   release authority. Disk is not a silent override (DB-SVG-16).
 *
 * Flip only after one successful production dual-write publish is proven
 * (see Failures.md + docs/architecture/08-DATABASE-SVG-CONTRACT.md).
 */

export type SvgReleaseAuthority = "disk" | "db";

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
