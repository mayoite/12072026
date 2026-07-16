const DEFAULT_REDIRECT = "/choose-product";

/**
 * Restrict post-login / access redirects to same-origin relative paths only.
 * Blocks open-redirect and scheme-relative attacks (`//evil`, `/\evil`, encoded
 * variants, control characters, credentials-in-path).
 */
export function sanitizeNextPath(
  value: string | null | undefined,
  fallback = DEFAULT_REDIRECT,
): string {
  if (value == null || typeof value !== "string") {
    return fallback;
  }

  let path = value.trim();
  if (!path) {
    return fallback;
  }

  // Reject encoded protocol-relative / backslash tricks before decode.
  if (/%2f%2f/i.test(path) || /%5c/i.test(path) || /%00/i.test(path)) {
    return fallback;
  }

  try {
    path = decodeURIComponent(path);
  } catch {
    return fallback;
  }

  path = path.trim();
  if (!path.startsWith("/")) {
    return fallback;
  }

  // Protocol-relative, backslash, scheme, or userinfo tricks.
  if (
    path.startsWith("//") ||
    path.startsWith("/\\") ||
    path.includes("\\") ||
    path.includes("://") ||
    path.includes("@") ||
    /[\u0000-\u001f\u007f]/.test(path)
  ) {
    return fallback;
  }

  // Single leading slash only (no nested protocol after first segment tricks).
  if (path.length > 1 && path[1] === "/") {
    return fallback;
  }

  return path;
}

export function buildAccessRedirect(
  nextPath: string | null | undefined,
  fallback = DEFAULT_REDIRECT,
): string {
  const safeNext = sanitizeNextPath(nextPath, fallback);
  return `/access?next=${encodeURIComponent(safeNext)}`;
}

export const sanitizePlannerNextPath = sanitizeNextPath;
