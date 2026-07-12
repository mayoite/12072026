/**
 * Narrow feature flag for Fabric furniture stage (Fabric 2B slice).
 * Default OFF — production UI unchanged until smoke with env set to "1".
 *
 * Enable: NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE=1
 */

export const PLANNER_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE" as const;

/**
 * True only when the public env var is exactly "1".
 * Safe on server and client; missing / other values → false.
 */
export function isPlannerFabricFurnitureEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env[PLANNER_FABRIC_FURNITURE_ENV] === "1";
}
