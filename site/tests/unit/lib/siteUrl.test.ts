/**
 * Name-mirror coverage for lib/siteUrl.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("SITE_URL", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("defaults to production origin when no env is set", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.SITE_URL;

    const { SITE_URL } = await import("@/lib/siteUrl");
    expect(SITE_URL).toBe("https://oando.co.in");
  });

  it("uses NEXT_PUBLIC_SITE_URL and strips trailing slashes", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com///";
    delete process.env.SITE_URL;

    const { SITE_URL } = await import("@/lib/siteUrl");
    expect(SITE_URL).toBe("https://example.com");
  });

  it("falls back to production origin for vercel.app preview domains", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://oando-git-main.vercel.app";
    delete process.env.SITE_URL;

    const { SITE_URL } = await import("@/lib/siteUrl");
    expect(SITE_URL).toBe("https://oando.co.in");
  });

  it("prefers NEXT_PUBLIC_SITE_URL over SITE_URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://public.example";
    process.env.SITE_URL = "https://private.example";

    const { SITE_URL } = await import("@/lib/siteUrl");
    expect(SITE_URL).toBe("https://public.example");
  });
});
