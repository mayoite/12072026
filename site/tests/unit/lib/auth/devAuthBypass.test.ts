import { afterEach, describe, expect, it } from "vitest";
import {
  DEV_BYPASS_USER,
  isDevAuthBypassEnabled,
} from "@/lib/auth/devAuthBypass";
import { resolveAuthContext } from "@/features/shared/api/withAuth";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("isDevAuthBypassEnabled", () => {
  it("is false by default", () => {
    delete process.env.DEV_AUTH_BYPASS;
    delete process.env.DEV_AUTH_BYPASS_ALLOW_PRODUCTION;
    process.env.NODE_ENV = "development";
    expect(isDevAuthBypassEnabled(process.env)).toBe(false);
  });

  it("is true in development when DEV_AUTH_BYPASS=1", () => {
    process.env.NODE_ENV = "development";
    process.env.DEV_AUTH_BYPASS = "1";
    delete process.env.DEV_AUTH_BYPASS_ALLOW_PRODUCTION;
    expect(isDevAuthBypassEnabled(process.env)).toBe(true);
  });

  it("is false in production even with DEV_AUTH_BYPASS=1", () => {
    process.env.NODE_ENV = "production";
    process.env.DEV_AUTH_BYPASS = "1";
    delete process.env.DEV_AUTH_BYPASS_ALLOW_PRODUCTION;
    expect(isDevAuthBypassEnabled(process.env)).toBe(false);
  });

  it("allows production only with explicit second flag (local Playwright)", () => {
    process.env.NODE_ENV = "production";
    process.env.DEV_AUTH_BYPASS = "1";
    process.env.DEV_AUTH_BYPASS_ALLOW_PRODUCTION = "1";
    expect(isDevAuthBypassEnabled(process.env)).toBe(true);
  });
});

describe("resolveAuthContext with bypass", () => {
  it("returns synthetic admin when bypass enabled", async () => {
    process.env.NODE_ENV = "development";
    process.env.DEV_AUTH_BYPASS = "1";
    const auth = await resolveAuthContext("admin");
    expect(auth.isAdmin).toBe(true);
    expect(auth.user?.id).toBe(DEV_BYPASS_USER.id);
    expect(auth.user?.email).toBe(DEV_BYPASS_USER.email);
  });
});
