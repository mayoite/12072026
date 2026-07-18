/**
 * Force loopback origin to http://localhost:PORT — never 127.0.0.1 / ::1.
 * Next treats those as different origins (HMR, cookies, "two different apps").
 */

const DEFAULT = "http://localhost:3000";

/**
 * @param {string | undefined} raw
 * @returns {string} origin without trailing slash
 */
export function forceLocalhostOrigin(raw) {
  const input = String(raw || process.env.PLAYWRIGHT_BASE_URL || DEFAULT).trim();
  try {
    const u = new URL(input);
    if (
      u.hostname === "127.0.0.1" ||
      u.hostname === "[::1]" ||
      u.hostname === "::1" ||
      u.hostname === "0.0.0.0" ||
      u.hostname === "localhost"
    ) {
      u.protocol = "http:";
      u.hostname = "localhost";
      if (!u.port) u.port = "3000";
    }
    return u.origin;
  } catch {
    return DEFAULT;
  }
}
