import { beforeEach, describe, expect, it, vi } from "vitest";

import { invalidateCsrfToken } from "@/lib/api/browserApi";
import { createPlannerDocument } from "@/features/planner/model";
import {
  deletePlannerDocumentFromSupabase,
  listPlannerDocumentsFromSupabase,
  loadPlannerDocumentFromSupabase,
  savePlannerDocumentToSupabase,
} from "@/features/planner/persistence/plannerSaves";

function createAuthClient(userId = "550e8400-e29b-41d4-a716-446655440001") {
  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: userId } },
        error: null,
      })),
    },
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Mutating cloud calls bootstrap CSRF via browserApiFetch. */
function mockFetchWithCsrf(...responses: Response[]) {
  const fetchMock = vi.spyOn(globalThis, "fetch");
  fetchMock.mockResolvedValueOnce(jsonResponse({ token: "test-csrf-token" }));
  for (const response of responses) {
    fetchMock.mockResolvedValueOnce(response);
  }
  return fetchMock;
}

describe("planner cloud repository", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    invalidateCsrfToken();
  });

  it("lists owner plans from /api/plans", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        documents: [
          {
            id: "550e8400-e29b-41d4-a716-446655440010",
            user_id: "550e8400-e29b-41d4-a716-446655440001",
            name: "North Bay",
            project_name: null,
            client_name: null,
            prepared_by: null,
            room_width_mm: 6000,
            room_depth_mm: 8000,
            seat_target: 10,
            unit_system: "metric",
            item_count: 0,
            thumbnail_url: null,
            created_at: "2026-04-07T00:00:00.000Z",
            updated_at: "2026-04-07T00:00:00.000Z",
          },
        ],
      }),
    );

    const plans = await listPlannerDocumentsFromSupabase(createAuthClient() as never, {
      accessMode: "owner",
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/plans", {
      method: "GET",
      credentials: "include",
    });
    expect(plans).toHaveLength(1);
    expect(plans[0]?.name).toBe("North Bay");
  });

  it("lists admin plans from /api/admin/plans", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        plans: [
          {
            id: "550e8400-e29b-41d4-a716-446655440011",
            user_id: "550e8400-e29b-41d4-a716-446655440002",
            title: "Client Plan",
            project_name: "HQ",
            client_name: "Acme",
            prepared_by: null,
            room_width_mm: 5000,
            room_depth_mm: 4000,
            seat_target: 6,
            unit_system: "metric",
            item_count: 2,
            thumbnail_url: null,
            created_at: "2026-04-07T00:00:00.000Z",
            updated_at: "2026-04-07T00:00:00.000Z",
          },
        ],
      }),
    );

    const plans = await listPlannerDocumentsFromSupabase(createAuthClient() as never, {
      accessMode: "admin",
    });

    expect(plans).toHaveLength(1);
    expect(plans[0]?.name).toBe("Client Plan");
  });

  it("loads a plan via /api/plans/[id]", async () => {
    const document = createPlannerDocument({ name: "Loaded Plan", itemCount: 3 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ document }));

    const loaded = await loadPlannerDocumentFromSupabase(
      createAuthClient() as never,
      "550e8400-e29b-41d4-a716-446655440010",
    );

    expect(loaded?.name).toBe("Loaded Plan");
    expect(loaded?.itemCount).toBe(3);
  });

  it("saves a plan via PUT /api/plans/[id]", async () => {
    const saveId = "550e8400-e29b-41d4-a716-446655440099";
    const document = createPlannerDocument({ name: "Saved Plan" });
    const fetchMock = mockFetchWithCsrf(
      jsonResponse({ document: { ...document, id: saveId } }),
    );

    const saved = await savePlannerDocumentToSupabase(createAuthClient() as never, document, {
      saveId,
    });

    expect(fetchMock).toHaveBeenCalled();
    const putCall = fetchMock.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].includes(saveId) && call[1]?.method === "PUT",
    );
    expect(putCall?.[0]).toBe(`/api/plans/${saveId}/`);
    expect(putCall?.[1]).toEqual(
      expect.objectContaining({
        method: "PUT",
        credentials: "include",
        headers: expect.objectContaining({ "x-csrf-token": "test-csrf-token" }),
      }),
    );
    expect(saved.name).toBe("Saved Plan");
  });

  it("deletes a plan via DELETE /api/plans/[id]", async () => {
    const saveId = "550e8400-e29b-41d4-a716-446655440010";
    const fetchMock = mockFetchWithCsrf(jsonResponse({ success: true }));

    const deleted = await deletePlannerDocumentFromSupabase(createAuthClient() as never, saveId);

    expect(deleted).toBe(true);
    const deleteCall = fetchMock.mock.calls.find(
      (call) =>
        typeof call[0] === "string" && call[0].includes(saveId) && call[1]?.method === "DELETE",
    );
    expect(deleteCall?.[0]).toBe(`/api/plans/${saveId}/`);
    expect(deleteCall?.[1]).toEqual(
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
        headers: expect.objectContaining({ "x-csrf-token": "test-csrf-token" }),
      }),
    );
  });
});
