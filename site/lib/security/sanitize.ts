/**
 * Security utilities for sanitizing content injected via dangerouslySetInnerHTML.
 * Prevents XSS attacks by escaping characters that could break out of JSON-LD script blocks.
 */

/**
 * Sanitize JSON data for safe injection into <script> tags.
 * Escapes <, >, and & to prevent script injection attacks.
 */
export function sanitizeJsonForScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/** Strip script tags and inline event handlers from trusted-but-inline SVG markup. */
export function sanitizeInlineSvg(markup: string): string {
  return markup
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}
