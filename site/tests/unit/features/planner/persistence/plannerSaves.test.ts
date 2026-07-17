import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlannerDocument } from "@/features/planner/model";
import {
  PlannerStorageError,
  savePlannerDocumentToSupabase,
  loadPlannerDocumentFromSupabase,
  listPlannerDocumentsFromSupabase,
  deletePlannerDocumentFromSupabase,
} from "@/features/planner/persistence/plannerSaves";
import * as plannerCloudApi from "@/features/planner/persistence/plannerCloudApi";
import { PlannerCloudApiError } from "@/features/planner/persistence/plannerCloudApi";

const document = createPlannerDocument({ name: "API Plan", itemCount: 1 });
const USER = "00000000-0000-4000-8000-000000000002";
const SAVE_ID = "00000000-0000-4000-8000-000000000006";

function authClient(userId = USER) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      }),
    },
  };
}

describe("plannerSaves (persistence API path)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("requires auth when saving without userId", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    };
    await expect(
      savePlannerDocumentToSupabase(client as never, document),
    ).rejects.toMatchObject({ code: "planner:no-auth" });
  });

  it("saves through cloud API with resolved owner", async () => {
    const saveSpy = vi
      .spyOn(plannerCloudApi, "savePlanToApi")
      .mockResolvedValue(document);
    const saved = await savePlannerDocumentToSupabase(
      authClient() as never,
      document,
      { userId: USER },
    );
    expect(saved.name).toBe("API Plan");
    expect(saveSpy).toHaveBeenCalledWith(
      document,
      expect.objectContaining({
        userId: USER,
        ownerUserId: USER,
        accessMode: "owner",
      }),
    );
  });

  it("maps cloud API errors into PlannerStorageError on load", async () => {
    vi.spyOn(plannerCloudApi, "loadPlanFromApi").mockRejectedValue(
      new PlannerCloudApiError("not found", "planner:load-failed"),
    );
    await expect(
      loadPlannerDocumentFromSupabase(authClient() as never, SAVE_ID),
    ).rejects.toBeInstanceOf(PlannerStorageError);
  });

  it("lists owner plans through cloud API", async () => {
    vi.spyOn(plannerCloudApi, "listOwnerPlansFromApi").mockResolvedValue([
      {
        id: SAVE_ID,
        user_id: USER,
        name: "API Plan",
        project_name: null,
        client_name: null,
        prepared_by: null,
        room_width_mm: 0,
        room_depth_mm: 0,
        seat_target: 0,
        unit_system: "metric",
        item_count: 1,
        thumbnail_url: null,
        created_at: "2026-07-13T12:00:00.000Z",
        updated_at: "2026-07-13T12:00:00.000Z",
      },
    ]);
    const rows = await listPlannerDocumentsFromSupabase(authClient() as never, {
      userId: USER,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.name).toBe("API Plan");
  });

  it("rejects admin delete from browser repository path", async () => {
    await expect(
      deletePlannerDocumentFromSupabase(authClient() as never, SAVE_ID, {
        userId: USER,
        accessMode: "admin",
      }),
    ).rejects.toMatchObject({ code: "planner:delete-failed" });
  });

  it("deletes owner plans through cloud API", async () => {
    const del = vi.spyOn(plannerCloudApi, "deletePlanFromApi").mockResolvedValue(true);
    await expect(
      deletePlannerDocumentFromSupabase(authClient() as never, SAVE_ID, {
        userId: USER,
      }),
    ).resolves.toBe(true);
    expect(del).toHaveBeenCalledWith(SAVE_ID);
  });
});
