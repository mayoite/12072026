// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  buildManagedUsers,
  ensureSupabaseUser,
  main,
} from "@/scripts/ensureAuthTestUsers";

describe("ensureAuthTestUsers (name-mirror)", () => {
  it("builds admin and user managed accounts from e2e env", () => {
    const users = buildManagedUsers({
      adminEmail: "admin@example.com",
      adminPassword: "admin-pass",
      userEmail: "user@example.com",
      userPassword: "user-pass",
    } as never);
    expect(users).toHaveLength(2);
    expect(users[0]).toMatchObject({
      email: "admin@example.com",
      role: "Admin",
    });
    expect(users[1]?.reusableEmails).toContain("demo@oando.co.in");
  });

  it("creates a missing user via admin API mock", async () => {
    const createUser = vi.fn(async () => ({ error: null }));
    const admin = {
      auth: {
        admin: {
          listUsers: vi.fn(async () => ({
            data: { users: [] },
            error: null,
          })),
          createUser,
          updateUserById: vi.fn(),
        },
      },
    };
    const result = await ensureSupabaseUser(admin as never, {
      email: "new@example.com",
      password: "secret",
      role: "Admin",
    });
    expect(result).toBe("created");
    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        email_confirm: true,
        app_metadata: { role: "admin" },
      }),
    );
  });

  it("updates an existing user via admin API mock", async () => {
    const updateUserById = vi.fn(async () => ({ error: null }));
    const admin = {
      auth: {
        admin: {
          listUsers: vi.fn(async () => ({
            data: { users: [{ id: "u1", email: "user@example.com" }] },
            error: null,
          })),
          createUser: vi.fn(),
          updateUserById,
        },
      },
    };
    const result = await ensureSupabaseUser(admin as never, {
      email: "user@example.com",
      password: "new-pass",
      role: "User",
    });
    expect(result).toBe("updated");
    expect(updateUserById).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ password: "new-pass" }),
    );
  });

  it("main provisions both users without real network", async () => {
    const ensureUser = vi.fn(async () => "created" as const);
    const write = vi.fn();
    const users = await main({
      getAuthEnv: () =>
        ({
          adminEmail: "a@x.com",
          adminPassword: "ap",
          userEmail: "u@x.com",
          userPassword: "up",
        }) as never,
      getSeedEnv: vi.fn() as never,
      createAdmin: vi.fn(() => ({})) as never,
      ensureUser: ensureUser as never,
      write,
    });
    expect(users).toHaveLength(2);
    expect(ensureUser).toHaveBeenCalledTimes(2);
    expect(write).toHaveBeenCalledWith(
      expect.stringContaining("Supabase E2E auth users are provisioned"),
    );
  });
});
