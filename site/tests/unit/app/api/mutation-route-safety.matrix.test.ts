// @vitest-environment node
/**
 * Static CSRF + rate-limit matrix for mutation routes.
 *
 * Complements scripts/audit-api-route-safety.mjs with focused source asserts
 * on admin ops, planner handoff, and site form mutators (unit/static proof).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const apiRoot = path.join(siteRoot, "app", "api");

function readRoute(...segments: string[]): string {
  const file = path.join(apiRoot, ...segments, "route.ts");
  expect(fs.existsSync(file), `missing ${file}`).toBe(true);
  return fs.readFileSync(file, "utf8");
}

function hasCsrf(source: string): boolean {
  return (
    /requireCsrf\s*:\s*true/.test(source) || /validateCsrfRequest\s*\(/.test(source)
  );
}

function hasRateLimit(source: string): boolean {
  return (
    /withAuth\s*[<(]/.test(source) ||
    /\brateLimit\s*\(/.test(source) ||
    /\benforceAdminRateLimit\s*\(/.test(source) ||
    /\benforcePublicApiRateLimit\s*\(/.test(source)
  );
}

function hasRejectionHeader(source: string): boolean {
  if (/requireCsrf\s*:\s*true/.test(source) && /withAuth\s*[<(]/.test(source)) {
    return true;
  }
  return (
    /CSRF_REJECTION_HEADER_NAME/.test(source) || /["']x-csrf-rejected["']/.test(source)
  );
}

describe("mutation route CSRF + rate-limit matrix (static)", () => {
  describe("admin ops mutators", () => {
    const adminOps: Array<{ segments: string[]; methods: RegExp }> = [
      { segments: ["admin", "plans"], methods: /export async function (PATCH|DELETE)/ },
      { segments: ["admin", "plans", "[id]"], methods: /export async function (PATCH|DELETE)/ },
      { segments: ["admin", "themes", "publish"], methods: /export async function POST/ },
      { segments: ["admin", "features"], methods: /requireCsrf:\s*true/ },
      {
        segments: ["admin", "price-books", "[bookId]", "action"],
        methods: /requireCsrf:\s*true/,
      },
      { segments: ["admin", "svg-editor"], methods: /requireCsrf:\s*true/ },
      { segments: ["admin", "catalog"], methods: /requireCsrf:\s*true/ },
      { segments: ["customer-queries", "manage"], methods: /export async function PATCH/ },
      { segments: ["theme", "manage"], methods: /export async function POST/ },
    ];

    it.each(adminOps)(
      "$segments join has CSRF + rate limit + rejection hygiene",
      ({ segments, methods }) => {
        const source = readRoute(...segments);
        expect(source).toMatch(methods);
        expect(hasCsrf(source)).toBe(true);
        expect(hasRateLimit(source)).toBe(true);
        expect(hasRejectionHeader(source)).toBe(true);
        // Fail-closed: no CSRF message with wrong error codes
        if (/Invalid or missing CSRF token/i.test(source)) {
          expect(source).not.toMatch(
            /API_ERROR_CODES\.(INVALID_INPUT|INSUFFICIENT_PERMISSIONS)/,
          );
        }
      },
    );
  });

  describe("planner handoff mutator", () => {
    it("POST handoff keeps withAuth requireCsrf + rate limit", () => {
      const source = readRoute("planner", "handoff");
      expect(source).toMatch(/export const POST\s*=\s*withAuth/);
      expect(source).toMatch(/requireCsrf:\s*true/);
      expect(source).toMatch(/rateLimitScope:\s*["']planner:handoff["']/);
      expect(source).toMatch(/rateLimit:\s*10/);
      expect(hasRateLimit(source)).toBe(true);
    });

    it("sketch-to-plan and cloud export keep CSRF + rate limit", () => {
      for (const segments of [
        ["planner", "sketch-to-plan"],
        ["planner", "export", "cloud"],
        ["plans"],
      ]) {
        const source = readRoute(...segments);
        expect(hasCsrf(source)).toBe(true);
        expect(hasRateLimit(source)).toBe(true);
        expect(source).toMatch(/requireCsrf:\s*true/);
      }
    });
  });

  describe("site public forms", () => {
    it("customer-queries POST is rate-limited with honeypot (CSRF optional)", () => {
      const source = readRoute("customer-queries");
      expect(source).toMatch(/export async function POST/);
      expect(hasRateLimit(source)).toBe(true);
      expect(source).toMatch(/honeypot|website/);
      // Public intake intentionally skips double-submit CSRF
      expect(source).not.toMatch(/requireCsrf:\s*true/);
      expect(source).not.toMatch(/validateCsrfRequest/);
    });

    it("tracking and log-error stay rate-limited without CSRF", () => {
      for (const segments of [["tracking"], ["log-error"]]) {
        const source = readRoute(...segments);
        expect(source).toMatch(/export async function POST/);
        expect(hasRateLimit(source)).toBe(true);
      }
    });
  });

  describe("authenticated non-admin mutators", () => {
    it("audit POST uses CSRF_FAILED + rejection header", () => {
      const source = readRoute("audit");
      expect(hasCsrf(source)).toBe(true);
      expect(hasRateLimit(source)).toBe(true);
      expect(hasRejectionHeader(source)).toBe(true);
      expect(source).toMatch(/API_ERROR_CODES\.CSRF_FAILED/);
      expect(source).not.toMatch(
        /validateCsrfRequest[\s\S]{0,400}?API_ERROR_CODES\.(INVALID_INPUT|INSUFFICIENT_PERMISSIONS)/,
      );
    });
  });
});
