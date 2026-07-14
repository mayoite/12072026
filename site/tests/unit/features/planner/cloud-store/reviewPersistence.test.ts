import { beforeEach, describe, expect, it, vi } from "vitest";

const isConfigured = vi.fn();
const insertValues = vi.fn();
const updateSet = vi.fn();
const selectFrom = vi.fn();

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isPlannerDatabaseUrlConfigured: () => isConfigured(),
}));

vi.mock("@/platform/drizzle/adminDb", () => ({
  adminDb: {
    insert: () => ({
      values: (...args: unknown[]) => {
        insertValues(...args);
        return {
          returning: async () => [{ id: "link-1", token: "tok", planId: "plan-1" }],
        };
      },
    }),
    update: () => ({
      set: (...args: unknown[]) => {
        updateSet(...args);
        return {
          where: () => ({
            returning: async () => [{ id: "link-1", isRevoked: "true" }],
          }),
        };
      },
    }),
    select: () => ({
      from: (...args: unknown[]) => {
        selectFrom(...args);
        return {
          where: () => ({
            limit: async () => [
              {
                id: "link-1",
                token: "abc",
                isRevoked: "false",
                expiresAt: null,
              },
            ],
            orderBy: async () => [{ id: "link-1" }],
          }),
        };
      },
    }),
  },
}));

vi.mock("@/platform/drizzle/schema/planner", () => ({
  reviewLinks: { id: "id", planId: "planId", token: "token", isRevoked: "isRevoked", createdAt: "createdAt" },
  reviewComments: { id: "id", planId: "planId", createdAt: "createdAt" },
}));

vi.mock("drizzle-orm", () => ({
  and: (...args: unknown[]) => args,
  desc: (x: unknown) => x,
  eq: (a: unknown, b: unknown) => [a, b],
}));

import {
  ReviewPersistenceError,
  createReviewComment,
  createReviewLink,
  getReviewLinkByToken,
  listReviewComments,
  listReviewLinks,
  revokeReviewLink,
} from "@/features/planner/cloud-store/reviewPersistence";

describe("reviewPersistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when database is not configured", async () => {
    isConfigured.mockReturnValue(false);
    const result = await createReviewLink("plan-1", "user-1");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ReviewPersistenceError);
      expect(result.error.message).toMatch(/Database not configured/);
    }
  });

  it("creates review link when configured", async () => {
    isConfigured.mockReturnValue(true);
    const result = await createReviewLink("plan-1", "user-1", "comment");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("link-1");
      expect(result.data.planId).toBe("plan-1");
    }
    expect(insertValues).toHaveBeenCalled();
  });

  it("revokes review link", async () => {
    isConfigured.mockReturnValue(true);
    const result = await revokeReviewLink("link-1");
    expect(result.success).toBe(true);
    expect(updateSet).toHaveBeenCalledWith({ isRevoked: "true" });
  });

  it("gets review link by token with isActive", async () => {
    isConfigured.mockReturnValue(true);
    const result = await getReviewLinkByToken("abc");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data?.isActive).toBe(true);
      expect(result.data?.token).toBe("abc");
    }
  });

  it("lists links and comments for a plan", async () => {
    isConfigured.mockReturnValue(true);
    const links = await listReviewLinks("plan-1");
    expect(links.success).toBe(true);
    if (links.success) {
      expect(links.data).toHaveLength(1);
    }

    // comments select path reuses mock; create comment uses insert
    const created = await createReviewComment("plan-1", "Ann", "Looks good", {
      objectId: "furn-1",
      objectType: "furniture",
    });
    expect(created.success).toBe(true);

    const comments = await listReviewComments("plan-1");
    expect(comments.success).toBe(true);
  });
});
