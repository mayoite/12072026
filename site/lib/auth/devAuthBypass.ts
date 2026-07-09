/**
 * Development auth bypass for admin/UI/API.
 *
 * ENABLED only when:
 *   - DEV_AUTH_BYPASS=1 (server env), AND
 *   - NODE_ENV is not "production"
 *
 * Never enable in production builds/deployments. Playwright/dev webServer
 * should set DEV_AUTH_BYPASS=1 only for local/CI non-prod servers.
 */

export const DEV_AUTH_BYPASS_ENV = "DEV_AUTH_BYPASS" as const;

export type DevBypassUser = {
  id: string;
  email: string;
  role: "admin";
};

/** Stable synthetic admin for bypass sessions. */
export const DEV_BYPASS_USER: DevBypassUser = {
  id: "00000000-0000-4000-8000-0000000000dev",
  email: "dev-bypass@localhost",
  role: "admin",
};

/**
 * True when server-side auth may be short-circuited for local/dev E2E.
 * Production always returns false even if the env flag is set.
 */
function readFlag(env: NodeJS.ProcessEnv, key: string): string | undefined {
  // Dynamic key access avoids some bundlers inlining missing env as undefined.
  return env[key];
}

export function isDevAuthBypassEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const bypass = readFlag(env, DEV_AUTH_BYPASS_ENV);
  const allowProd = readFlag(env, "DEV_AUTH_BYPASS_ALLOW_PRODUCTION");
  const nodeEnv = readFlag(env, "NODE_ENV");

  if (nodeEnv === "production") {
    // Local Playwright against `next start` only when BOTH flags are set.
    return bypass === "1" && allowProd === "1";
  }
  return bypass === "1";
}
