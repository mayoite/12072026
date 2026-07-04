import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv, getOptionalPublicSupabaseEnv } from "@/lib/supabase/env";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn((url, anonKey) => ({
    auth: {
      getUser: vi.fn(),
    },
    url,
    anonKey,
  })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn((url, anonKey) => ({
    auth: {
      getUser: vi.fn(),
    },
    url,
    anonKey,
  })),
}));

vi.mock("@/lib/supabase/env", () => ({
  getPublicSupabaseEnv: vi.fn(),
  getOptionalPublicSupabaseEnv: vi.fn(),
}));

import {
  createClient,
  createOptionalClient,
  createRawClient,
  getBrowserSessionUser,
} from "@/lib/supabase/client";

describe("supabase client creators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createClient", () => {
    it("should call createBrowserClient with public env values", () => {
      vi.mocked(getPublicSupabaseEnv).mockReturnValue({
        url: "https://mock.supabase.co",
        anonKey: "mock-anon",
      });

      const client = createClient();
      expect(getPublicSupabaseEnv).toHaveBeenCalled();
      expect(createBrowserClient).toHaveBeenCalledWith("https://mock.supabase.co", "mock-anon");
      expect(client).toBeDefined();
    });
  });

  describe("createOptionalClient", () => {
    it("should return null if optional env is not defined", () => {
      vi.mocked(getOptionalPublicSupabaseEnv).mockReturnValue(null);

      const client = createOptionalClient();
      expect(client).toBeNull();
    });

    it("should create client if optional env is defined", () => {
      vi.mocked(getOptionalPublicSupabaseEnv).mockReturnValue({
        url: "https://opt.supabase.co",
        anonKey: "opt-anon",
      });

      const client = createOptionalClient();
      expect(createBrowserClient).toHaveBeenCalledWith("https://opt.supabase.co", "opt-anon");
      expect(client).not.toBeNull();
    });
  });

  describe("createRawClient", () => {
    it("should call createSupabaseClient with public env values", () => {
      vi.mocked(getPublicSupabaseEnv).mockReturnValue({
        url: "https://raw.supabase.co",
        anonKey: "raw-anon",
      });

      const client = createRawClient();
      expect(createSupabaseClient).toHaveBeenCalledWith("https://raw.supabase.co", "raw-anon");
      expect(client).toBeDefined();
    });
  });

  describe("getBrowserSessionUser", () => {
    it("should return user if call succeeds", async () => {
      const mockUser = { id: "user-123" };
      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        },
      } as any;

      const user = await getBrowserSessionUser(mockClient);
      expect(user).toEqual(mockUser);
    });

    it("should throw error if getUser returns error", async () => {
      const mockError = new Error("Auth error");
      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: mockError }),
        },
      } as any;

      await expect(getBrowserSessionUser(mockClient)).rejects.toThrow("Auth error");
    });
  });
});
