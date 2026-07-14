/**
 * Name-mirror: features/shared/auth/lib/session
 */

import { describe, expect, it } from "vitest";
import type {
  AuthUser,
  SessionState,
  SharedSession,
} from "@/features/shared/auth/lib/session";

describe("session re-exports", () => {
  it("exports AuthProvider and useSession for component imports", async () => {
    const mod = await import("@/features/shared/auth/lib/session");
    expect(typeof mod.AuthProvider).toBe("function");
    expect(typeof mod.useSession).toBe("function");
  });

  it("exposes SharedSession / SessionState type contracts at use-sites", () => {
    const user: AuthUser = { id: "u1", email: "a@example.com" };
    const session: SharedSession = {
      user: {
        id: user.id,
        email: user.email,
        role: "viewer",
      },
      token: "tok",
      isGuest: false,
    };
    const state: SessionState = { status: "authenticated", user };
    expect(session.user?.role).toBe("viewer");
    expect(state.status).toBe("authenticated");
  });
});
