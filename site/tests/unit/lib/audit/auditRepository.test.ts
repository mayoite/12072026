import { describe, it, expect, vi, beforeEach } from "vitest";
import { insertEvent } from "@/lib/audit/auditRepository";
import { db } from "@/platform/drizzle/db";

vi.mock("@/platform/drizzle/db", () => {
  const mockValues = vi.fn(() => Promise.resolve());
  const mockInsert = vi.fn(() => ({
    values: mockValues,
  }));
  return {
    db: {
      insert: mockInsert,
    },
  };
});

vi.mock("@/platform/drizzle/schema", () => ({
  auditEvents: {},
}));

describe("auditRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts an audit event into db", async () => {
    const event = {
      team_id: "team-123",
      actor_id: "user-456",
      action: "view",
      target_type: "document",
      target_id: "doc-789",
      metadata: { key: "value" },
    };

    await insertEvent(event);

    expect(db.insert).toHaveBeenCalled();
  });
});
