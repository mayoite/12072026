import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { AuthProvider, useSession } from "@/features/shared/auth/lib/AuthProvider";
import { createClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => {
  const mockSubscription = {
    unsubscribe: vi.fn(),
  };
  const mockAuth = {
    onAuthStateChange: vi.fn(() => {
      return { data: { subscription: mockSubscription } };
    }),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
  };
  return {
    createClient: () => ({
      auth: mockAuth,
    }),
  };
});

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides loading state initially, then resolves session", async () => {
    const client = createClient();
    const mockGetSession = vi.mocked(client.auth.getSession);
    mockGetSession.mockResolvedValueOnce({
      data: {
        session: {
          user: { id: "user123", email: "user@example.com" },
        },
      },
    } as any);

    function TestComponent() {
      const session = useSession();
      return <div data-testid="session-status">{session.status}</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("session-status").textContent).toBe("loading");
    
    const resolvedEl = await screen.findByText("authenticated");
    expect(resolvedEl).toBeDefined();
  });
});
