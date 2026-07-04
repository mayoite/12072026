/**
 * Phase 03 Asset Validation
 *
 * Validates asset URLs against an allowed-origin allowlist, checks expiration,
 * and resolves safe URLs or triggers fallback paths.
 *
 * CSP-aligned: only HTTPS URLs from approved origins, plus relative local CDN paths.
 */

// ── Allowed origin allowlist ──

/**
 * Approved origins for catalog asset URLs.
 * Extend this list as CDN domains and image hosting services are added.
 */
const DEFAULT_ALLOWED_ORIGIN_PATTERNS = [
  // R2 / Cloudflare R2
  "pub-[a-z0-9]+\\.r2\\.dev",
  // Local relative paths (no origin — handled separately)
  // Supabase storage
  "[a-z0-9]+\\.supabase\\.co",
  // Common CDN domains (placeholder — configure per deployment)
  "cdn\\.oando\\.co\\.in",
  "assets\\.oando\\.co\\.in",
  "images\\.oando\\.co\\.in",
];

const allowedOriginPatterns = [...DEFAULT_ALLOWED_ORIGIN_PATTERNS];

function compileOriginPattern(pattern: string): RegExp | null {
  try {
    return new RegExp(`^https://${pattern}$`, "i");
  } catch {
    return null;
  }
}

let allowedOriginRegexes = allowedOriginPatterns
  .map(compileOriginPattern)
  .filter((regex): regex is RegExp => regex !== null);

/**
 * Test whether a URL origin matches any pattern in the allowlist.
 */
function originMatchesAllowlist(origin: string): boolean {
  return allowedOriginRegexes.some((regex) => regex.test(origin));
}

// ── URL validation ──

/**
 * Result of asset URL validation.
 */
export interface AssetUrlValidation {
  /** Whether the URL is safe to use */
  valid: boolean;
  /** Sanitized URL (null if invalid) */
  url: string | null;
  /** Reason for rejection, if invalid */
  reason?: string;
}

/**
 * Validate a single asset URL against the origin allowlist and format rules.
 *
 * Rules:
 * - Relative URLs (starting with /) are always valid (local CDN/public path).
 * - HTTPS URLs must match an allowed origin pattern.
 * - HTTP URLs are rejected (insecure).
 * - Non-string or empty values are rejected.
 *
 * Performance target: <10ms per asset.
 */
export function validateAssetUrl(raw: string | undefined | null): AssetUrlValidation {
  if (raw === null || typeof raw !== "string") {
    return { valid: false, url: null, reason: "missing or non-string URL" };
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { valid: false, url: null, reason: "empty URL" };
  }

  // Relative URLs (e.g., /images/chair.svg, ./preview.png) are valid
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return { valid: true, url: trimmed };
  }

  // Parse URL to extract scheme and origin
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, url: null, reason: `malformed URL: ${trimmed.slice(0, 100)}` };
  }

  // Must be HTTPS
  if (parsed.protocol !== "https:") {
    return { valid: false, url: null, reason: `insecure protocol: ${parsed.protocol}` };
  }

  // Check against allowlist
  if (!originMatchesAllowlist(parsed.origin)) {
    return {
      valid: false,
      url: null,
      reason: `origin not in allowlist: ${parsed.origin}`,
    };
  }

  return { valid: true, url: trimmed };
}

/**
 * Validate multiple asset URLs. Returns validated URLs and a count of rejected ones.
 */
export function validateAssetUrls(
  urls: readonly (string | undefined | null)[],
): { validUrls: string[]; rejectedCount: number } {
  const validUrls: string[] = [];
  let rejectedCount = 0;

  for (const raw of urls) {
    const result = validateAssetUrl(raw);
    if (result.valid && result.url) {
      validUrls.push(result.url);
    } else {
      rejectedCount++;
    }
  }

  return { validUrls, rejectedCount };
}

// ── Asset expiration ──

/**
 * Default TTL for signed URLs: 24 hours.
 */
const DEFAULT_ASSET_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Check whether an asset URL is expired based on its generation timestamp.
 *
 * Signed URLs from cloud storage typically include an expiration.
 * This is a client-side heuristic — the actual expiration is enforced
 * by the storage provider. If no timestamp is provided, the URL is
 * considered fresh.
 */
export function isAssetUrlExpired(
  generatedAtMs: number | undefined,
  ttlMs: number = DEFAULT_ASSET_TTL_MS,
): boolean {
  const generated = generatedAtMs ?? null;
  if (generated === null) return false;
  const now = Date.now();
  return now - generated > ttlMs;
}

// ── Asset resolution ──

/**
 * Resolve an asset URL: validate, check expiration, return safe URL or null.
 *
 * Returns the validated URL if:
 * - URL is present and non-empty
 * - URL passes origin allowlist validation
 * - URL is not expired (if timestamp provided)
 *
 * Returns null if any check fails — caller should use fallback geometry.
 */
export function resolveAssetUrl(
  raw: string | undefined | null,
  generatedAtMs?: number,
): string | null {
  const validation = validateAssetUrl(raw);
  if (!validation.valid || !validation.url) return null;

  if (isAssetUrlExpired(generatedAtMs)) return null;

  return validation.url;
}

/**
 * Add an allowed origin pattern to the runtime allowlist.
 * Use for testing or dynamic configuration.
 */
export function addAllowedOrigin(pattern: string): void {
  const normalizedPattern = pattern.trim();
  if (!normalizedPattern) return;

  const compiled = compileOriginPattern(normalizedPattern);
  if (!compiled) return;

  allowedOriginPatterns.push(normalizedPattern);
  allowedOriginRegexes = [...allowedOriginRegexes, compiled];
}

/**
 * Get the current allowlist (for debugging/testing).
 */
export function getAllowedOrigins(): readonly string[] {
  return [...allowedOriginPatterns];
}
