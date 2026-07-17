import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlannerDocument } from "@/features/planner/model";

const dbMocks = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/platform/drizzle/adminDb", () => ({
  adminDb: dbMocks,
}));

import {
  planRowToDocument,
  savePlannerDocument,
  loadPlannerDocument,
  listPlannerDocuments,
  listPlannerDocumentSummaries,
  deletePlannerDocument,
  isPlannerDatabaseConfigured,
  isMissingOandoPlansTableError,
  planRowToAdminSummary,
  planSummaryRowToAdminSummary,
  planRowToAdminDetail,
  listPlannerDocumentsAdmin,
  loadPlannerDocumentAdmin,
  patchPlannerDocumentAdmin,
  listPlannerAnalyticsRows,
} from "@/features/planner/cloud-store/plannerPersistence";

function makeThenable<T>(value: T) {
  const chain: Record<string, unknown> = {};
  const attach = () => {
    chain.set = vi.fn(() => chain);
    chain.where = vi.fn(() => chain);
    chain.values = vi.fn(() => chain);
    chain.from = vi.fn(() => chain);
    chain.orderBy = vi.fn(() => chain);
    chain.limit = vi.fn(() => chain);
    chain.offset = vi.fn(() => chain);
    chain.returning = vi.fn(async () => value);
    chain.then = (resolve: (v: T) => void) => Promise.resolve(value).then(resolve);
  };
  attach();
  return chain;
}

const userId = "550e8400-e29b-41d4-a716-446655440001";
const foreignUserId = "550e8400-e29b-41d4-a716-446655440002";
const planId = "550e8400-e29b-41d4-a716-446655440099";
const newClientId = "550e8400-e29b-41d4-a716-4466554400aa";

const document = createPlannerDocument({
  id: planId,
  name: "Persistence Plan",
  projectName: "HQ",
  clientName: "Acme",
  preparedBy: "Alex",
  itemCount: 3,
  sceneJson: { walls: [{ id: "w1" }] },
});

function makePlanRow(overrides: Record<string, unknown> = {}) {
  return {
    id: planId,
    userId,
    name: "Persistence Plan",
    engine: "oando",
    payload: document,
    thumbnailUrl: null,
    status: "draft",
    createdAt: new Date("2026-06-15T00:00:00.000Z"),
    updatedAt: new Date("2026-06-15T00:00:00.000Z"),
    ...overrides,
  };
}

describe("plannerPersistence", () => {
  beforeEach(() => {
    dbMocks.select.mockReset();
    dbMocks.insert.mockReset();
    dbMocks.update.mockReset();
    dbMocks.delete.mockReset();
  });

  it("should have function planRowToDocument defined", () => {
    expect(planRowToDocument).toBeTypeOf("function");
  });
  it("should have function savePlannerDocument defined", () => {
    expect(savePlannerDocument).toBeTypeOf("function");
  });
  it("should have function loadPlannerDocument defined", () => {
    expect(loadPlannerDocument).toBeTypeOf("function");
  });
  it("should have function listPlannerDocuments defined", () => {
    expect(listPlannerDocuments).toBeTypeOf("function");
  });
  it("should have function listPlannerDocumentSummaries defined", () => {
    expect(listPlannerDocumentSummaries).toBeTypeOf("function");
  });
  it("should have function deletePlannerDocument defined", () => {
    expect(deletePlannerDocument).toBeTypeOf("function");
  });
  it("should have function isPlannerDatabaseConfigured defined", () => {
    expect(isPlannerDatabaseConfigured).toBeTypeOf("function");
  });
  it("should have function planRowToAdminSummary defined", () => {
    expect(planRowToAdminSummary).toBeTypeOf("function");
  });
  it("should have function planSummaryRowToAdminSummary defined", () => {
    expect(planSummaryRowToAdminSummary).toBeTypeOf("function");
  });
  it("should have function planRowToAdminDetail defined", () => {
    expect(planRowToAdminDetail).toBeTypeOf("function");
  });
  it("should have function listPlannerDocumentsAdmin defined", () => {
    expect(listPlannerDocumentsAdmin).toBeTypeOf("function");
  });
  it("should have function loadPlannerDocumentAdmin defined", () => {
    expect(loadPlannerDocumentAdmin).toBeTypeOf("function");
  });
  it("should have function patchPlannerDocumentAdmin defined", () => {
    expect(patchPlannerDocumentAdmin).toBeTypeOf("function");
  });
  it("should have function listPlannerAnalyticsRows defined", () => {
    expect(listPlannerAnalyticsRows).toBeTypeOf("function");
  });

  describe("isMissingOandoPlansTableError", () => {
    it("detects Postgres undefined_table / 42P01", () => {
      expect(isMissingOandoPlansTableError(new Error("42P01 undefined_table"))).toBe(true);
    });
    it("detects relation oando_plans does not exist", () => {
      expect(
        isMissingOandoPlansTableError(
          new Error('Database list failed: relation "oando_plans" does not exist'),
        ),
      ).toBe(true);
    });
    it("does not treat network/auth failures as missing table", () => {
      expect(isMissingOandoPlansTableError(new Error("connection refused"))).toBe(false);
      expect(isMissingOandoPlansTableError(new Error("password authentication failed"))).toBe(
        false,
      );
    });
    it("walks originalError/cause for nested Postgres missing-table signals", () => {
      const nested = Object.assign(new Error("Database list failed: Failed query: select …"), {
        originalError: new Error('relation "oando_plans" does not exist'),
      });
      expect(isMissingOandoPlansTableError(nested)).toBe(true);
    });
  });

  describe("savePlannerDocument ownership + first-create", () => {
    it("owner-scoped update succeeds without insert", async () => {
      const updateChain = makeThenable([makePlanRow({ name: "Owned update" })]);
      dbMocks.update.mockReturnValue(updateChain);

      const result = await savePlannerDocument(userId, document, planId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.id).toBe(planId);
      }
      expect(dbMocks.update).toHaveBeenCalled();
      expect(dbMocks.insert).not.toHaveBeenCalled();
      // Owner scope must be applied via where (id + user_id).
      expect(updateChain.where).toHaveBeenCalled();
    });

    it("foreign plan id does not overwrite and returns FORBIDDEN", async () => {
      // Owner-scoped update matches nothing.
      dbMocks.update.mockReturnValue(makeThenable([]));
      // Select finds a row owned by someone else.
      dbMocks.select.mockReturnValue(
        makeThenable([{ id: planId, userId: foreignUserId }]),
      );

      const result = await savePlannerDocument(userId, document, planId);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
        expect(result.error.message).toMatch(/not owned/i);
      }
      expect(dbMocks.insert).not.toHaveBeenCalled();
    });

    it("first save with new client UUID inserts with explicit id", async () => {
      dbMocks.update.mockReturnValue(makeThenable([]));
      // No existing row for this id.
      dbMocks.select.mockReturnValue(makeThenable([]));
      const inserted = makePlanRow({ id: newClientId });
      const insertChain = makeThenable([inserted]);
      dbMocks.insert.mockReturnValue(insertChain);

      const clientDoc = createPlannerDocument({
        id: newClientId,
        name: "New client plan",
        itemCount: 1,
      });
      const result = await savePlannerDocument(userId, clientDoc, newClientId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.id).toBe(newClientId);
      }
      expect(dbMocks.insert).toHaveBeenCalled();
      expect(insertChain.values).toHaveBeenCalled();
      const valuesArg = (insertChain.values as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as {
        id?: string;
        userId?: string;
      };
      expect(valuesArg.id).toBe(newClientId);
      expect(valuesArg.userId).toBe(userId);
    });

    it("insert without documentId does not require prior update", async () => {
      dbMocks.insert.mockReturnValue(makeThenable([makePlanRow()]));
      const result = await savePlannerDocument(userId, document);
      expect(result.success).toBe(true);
      expect(dbMocks.update).not.toHaveBeenCalled();
    });
  });

  describe("deletePlannerDocument ownership", () => {
    it("scopes delete by owner when userId is provided", async () => {
      const deleteChain = makeThenable([{ id: planId }]);
      dbMocks.delete.mockReturnValue(deleteChain);

      const result = await deletePlannerDocument(planId, userId);
      expect(result.success).toBe(true);
      expect(deleteChain.where).toHaveBeenCalled();
    });

    it("returns NOT_FOUND when owner-scoped delete matches no rows", async () => {
      dbMocks.delete.mockReturnValue(makeThenable([]));
      const result = await deletePlannerDocument(planId, userId);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });

    it("admin delete without userId does not require matching rows", async () => {
      dbMocks.delete.mockReturnValue(makeThenable([]));
      const result = await deletePlannerDocument(planId);
      expect(result.success).toBe(true);
    });
  });
});
