import { describe, it, expect } from "vitest";
import { getE2EAuthEnv, getE2EAuthSeedEnv } from "@/lib/auth/e2eAuthEnv";

describe("e2eAuthEnv", () => {
  it("resolves variables successfully if all required are present", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://url.com",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon_key",
      E2E_SUPABASE_ADMIN_EMAIL: "admin@test.com",
      E2E_SUPABASE_ADMIN_PASSWORD: "password",
      E2E_SUPABASE_USER_EMAIL: "user@test.com",
      E2E_SUPABASE_USER_PASSWORD: "password",
    };

    const resolved = getE2EAuthEnv(env);
    expect(resolved.publicSupabaseUrl).toBe("https://url.com");
    expect(resolved.adminEmail).toBe("admin@test.com");
  });

  it("throws error if required variables are missing", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://url.com",
    };
    expect(() => getE2EAuthEnv(env)).toThrow();
  });

  it("resolves seed variables successfully", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://url.com",
      SUPABASE_SERVICE_ROLE_KEY: "service_key",
    };
    const resolved = getE2EAuthSeedEnv(env);
    expect(resolved.serviceRoleKey).toBe("service_key");
  });
});
