import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlannerSessionHandlers } from "@/features/planner/editor/usePlannerSessionHandlers";

vi.mock("@/lib/hooks/useOnlineStatus", () => ({
  useOnlineStatus: vi.fn().mockReturnValue(true),
}));

vi.mock("@/features/planner/lib/sessionState", () => ({
  LOCAL_CURRENT_DRAFT_ID: "local-draft-id",
  createPlannerExportPayload: vi.fn(),
  formatPlannerSavedPlanTimestamp: vi.fn().mockReturnValue("Just now"),
  sanitizePlannerPlanName: vi.fn().mockImplementation((name) => name),
}));

vi.mock("@/features/planner/lib/measurements", () => ({
  formatDimensionPair: vi.fn(),
  plannerUnitSystemToMeasurementUnit: vi.fn(),
}));

vi.mock("@/features/planner/lib/featureFlags", () => ({
  isFeatureEnabled: vi.fn().mockReturnValue(true),
}));

vi.mock("@/features/planner/persistence/plannerImport", () => ({
  parsePlannerDocumentImportFile: vi.fn(),
}));

vi.mock("@/features/planner/model", () => ({
  normalizePlannerDocument: vi.fn().mockImplementation((doc) => doc),
}));

vi.mock("@/features/planner/lib/fabricDocumentBridge", () => ({
  loadPlannerDocumentIntoFabric: vi.fn().mockReturnValue(true),
}));

vi.mock("@/features/planner/persistence/plannerSaves", () => ({
  deletePlannerDocumentFromSupabase: vi.fn(),
  listPlannerDocumentsFromSupabase: vi.fn().mockResolvedValue([]),
  loadPlannerDocumentFromSupabase: vi.fn(),
  savePlannerDocumentToSupabase: vi.fn(),
}));

vi.mock("@/features/planner/store/offlineStorage", () => ({
  offlineStorage: {
    init: vi.fn().mockResolvedValue(undefined),
    listPlans: vi.fn().mockResolvedValue([]),
    getPlan: vi.fn().mockResolvedValue(null),
    savePlan: vi.fn().mockResolvedValue(undefined),
    addToSyncQueue: vi.fn().mockResolvedValue(undefined),
  },
  updateOfflinePlan: vi.fn(),
  deleteOfflinePlan: vi.fn(),
  computeContentHash: vi.fn().mockResolvedValue("hash"),
  CANONICAL_SCHEMA_VERSION: 1,
}));

vi.mock("@/features/planner/store/syncQueueProcessor", () => ({
  SyncQueueProcessor: vi.fn().mockImplementation(() => ({
    processSyncQueue: vi.fn().mockResolvedValue({ processed: 0 }),
  })),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: { role: "customer" } }),
        }),
      }),
    }),
  }),
  getBrowserSessionUser: vi.fn().mockResolvedValue({ id: "user-123" }),
}));

vi.mock("@/features/planner/catalog/plannerManagedProducts.client", () => ({
  deletePlannerManagedProduct: vi.fn(),
  listPlannerManagedProductsFromSupabase: vi.fn().mockResolvedValue([]),
  upsertPlannerManagedProduct: vi.fn(),
}));

vi.mock("@/features/planner/catalog/catalogStore", () => ({
  usePlannerCatalogStore: {
    getState: () => ({ hydrateCatalog: vi.fn() }),
  },
}));

vi.mock("@/features/planner/persistence/persistence", () => ({
  deleteProject: vi.fn(),
  getPlannerProjectId: vi.fn(),
}));

describe("usePlannerSessionHandlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bootstraps session and handles user identity on mount", async () => {
    const { result } = renderHook(() =>
      usePlannerSessionHandlers({
        getCurrentPlannerDocument: vi.fn(),
        importDraft: vi.fn(),
        planId: "my-plan",
        guestMode: false,
        shapeCount: 0,
        saveStatus: "saved",
      })
    );

    // Initial state check
    expect(result.current.activeDocumentId).toBe("my-plan");
  });
});
