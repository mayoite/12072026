// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const signOut = vi.fn(async () => undefined);
const createClient = vi.fn(() => ({
  auth: {
    signInWithPassword,
    signOut,
  },
}));
const getE2EAuthEnv = vi.fn(() => ({
  publicSupabaseUrl: "https://example.supabase.co",
  publicSupabaseAnonKey: "anon-key",
  adminEmail: "admin@example.com",
  adminPassword: "admin-pass",
  userEmail: "user@example.com",
  userPassword: "user-pass",
}));

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => createClient(...args),
}));

vi.mock("@/lib/auth/e2eAuthEnv", () => ({
  getE2EAuthEnv: () => getE2EAuthEnv(),
}));

describe("checkAuthEnv (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    signInWithPassword.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });
    signOut.mockResolvedValue(undefined);
  });

  it("verifies admin and user credentials via mocked Supabase auth", async () => {
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    await import("../../../scripts/checkAuthEnv.ts");
    await vi.waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledTimes(2);
    });
    expect(getE2EAuthEnv).toHaveBeenCalled();
    expect(createClient).toHaveBeenCalled();
    expect(signInWithPassword).toHaveBeenNthCalledWith(1, {
      email: "admin@example.com",
      password: "admin-pass",
    });
    expect(signInWithPassword).toHaveBeenNthCalledWith(2, {
      email: "user@example.com",
      password: "user-pass",
    });
    expect(signOut).toHaveBeenCalledTimes(2);
    expect(write.mock.calls.flat().join("")).toContain("Supabase auth env sanity passed");
    write.mockRestore();
  });

  it("sets exit code when sign-in fails", async () => {
    signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Invalid login" },
    });
    const errWrite = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const prev = process.exitCode;
    process.exitCode = undefined;
    await import("../../../scripts/checkAuthEnv.ts");
    await vi.waitFor(() => {
      expect(process.exitCode).toBe(1);
    });
    expect(errWrite.mock.calls.flat().join("")).toContain("Admin auth failed");
    process.exitCode = prev;
    errWrite.mockRestore();
  });
});
