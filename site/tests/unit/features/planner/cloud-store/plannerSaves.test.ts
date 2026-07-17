import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlannerDocument } from "@/features/planner/model";
import {
  savePlannerDocumentToStore,
  loadPlannerDocumentFromStore,
  listPlannerDocumentsFromStore,
  deletePlannerDocumentFromStore,
  savePlannerDocumentToSupabase,
  loadPlannerDocumentFromSupabase,
  listPlannerDocumentsFromSupabase,
  deletePlannerDocumentFromSupabase,
} from "@/features/planner/cloud-store/plannerSaves";
import * as plannerPersistence from "@/features/planner/cloud-store/plannerPersistence";

const document = createPlannerDocument({ name: "Cloud Plan", itemCount: 2 });
const USER = "00000000-0000-4000-8000-000000000002";
const SAVE_ID = "00000000-0000-4000-8000-000000000006";

describe("plannerSaves (cloud-store)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("requires userId when saving", async () => {
    await expect(savePlannerDocumentToStore(document)).rejects.toThrow(/userId/);
  });

  it("saves through persistence and surfaces failures", async () => {
    vi.spyOn(plannerPersistence, "savePlannerDocument").mockResolvedValue({
      success: true,
      id: SAVE_ID,
      document,
    });
    const saved = await savePlannerDocumentToStore(document, {
      userId: USER,
      saveId: SAVE_ID,
    });
    expect(saved.name).toBe("Cloud Plan");

    vi.spyOn(plannerPersistence, "savePlannerDocument").mockResolvedValue({
      success: false,
      error: Object.assign(new Error("boom"), { code: "SAVE_FAILED" }) as never,
    });
    await expect(
      savePlannerDocumentToStore(document, { userId: USER }),
    ).rejects.toThrow(/boom/);
  });

  it("loads documents and maps NOT_FOUND to null", async () => {
    vi.spyOn(plannerPersistence, "loadPlannerDocument").mockResolvedValue({
      success: true,
      document,
    });
    await expect(loadPlannerDocumentFromStore(SAVE_ID, USER)).resolves.toEqual(document);

    vi.spyOn(plannerPersistence, "loadPlannerDocument").mockResolvedValue({
      success: false,
      error: { code: "NOT_FOUND", message: "missing" } as never,
    });
    await expect(loadPlannerDocumentFromStore("missing")).resolves.toBeNull();

    vi.spyOn(plannerPersistence, "loadPlannerDocument").mockResolvedValue({
      success: false,
      error: { code: "LOAD_FAILED", message: "db down" } as never,
    });
    await expect(loadPlannerDocumentFromStore(SAVE_ID)).rejects.toThrow(/db down/);
  });

  it("lists summaries and returns empty without userId", async () => {
    await expect(listPlannerDocumentsFromStore({})).resolves.toEqual([]);

    vi.spyOn(plannerPersistence, "listPlannerDocuments").mockResolvedValue({
      success: true,
      documents: [{ id: SAVE_ID, document }],
    });
    const rows = await listPlannerDocumentsFromStore({ ownerUserId: USER });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.name).toBe("Cloud Plan");
    expect(rows[0]?.item_count).toBe(2);
  });

  it("throws list failures instead of swallowing them", async () => {
    vi.spyOn(plannerPersistence, "listPlannerDocuments").mockResolvedValue({
      success: false,
      error: Object.assign(new Error("list broke"), { code: "LIST_FAILED" }) as never,
    });
    await expect(listPlannerDocumentsFromStore({ userId: USER })).rejects.toThrow(/list broke/);
  });

  it("delete returns false for NOT_FOUND and throws on hard failures", async () => {
    vi.spyOn(plannerPersistence, "deletePlannerDocument").mockResolvedValue({
      success: true,
    });
    await expect(deletePlannerDocumentFromStore(SAVE_ID, USER)).resolves.toBe(true);

    vi.spyOn(plannerPersistence, "deletePlannerDocument").mockResolvedValue({
      success: false,
      error: { code: "NOT_FOUND", message: "gone" } as never,
    });
    await expect(deletePlannerDocumentFromStore(SAVE_ID, USER)).resolves.toBe(false);

    vi.spyOn(plannerPersistence, "deletePlannerDocument").mockResolvedValue({
      success: false,
      error: { code: "DELETE_FAILED", message: "db down" } as never,
    });
    await expect(deletePlannerDocumentFromStore(SAVE_ID, USER)).rejects.toThrow(/db down/);
  });

  it("exposes backwards-compatible Supabase aliases", async () => {
    vi.spyOn(plannerPersistence, "savePlannerDocument").mockResolvedValue({
      success: true,
      id: SAVE_ID,
      document,
    } as never);
    vi.spyOn(plannerPersistence, "loadPlannerDocument").mockResolvedValue({
      success: true,
      document,
    } as never);
    vi.spyOn(plannerPersistence, "listPlannerDocuments").mockResolvedValue({
      success: true,
      documents: [{ id: SAVE_ID, document }],
    } as never);
    vi.spyOn(plannerPersistence, "deletePlannerDocument").mockResolvedValue({
      success: true,
    } as never);

    await savePlannerDocumentToSupabase(document, { userId: USER });
    await loadPlannerDocumentFromSupabase(SAVE_ID);
    await listPlannerDocumentsFromSupabase({ userId: USER });
    await deletePlannerDocumentFromSupabase(SAVE_ID, USER);
    expect(plannerPersistence.savePlannerDocument).toHaveBeenCalled();
  });
});
